import React, { useEffect, useState, useMemo, useRef } from "react";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedJobCard from "@/components/User/FeaturedJobCard";
import JobCard from "@/components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Country, State, City } from "country-state-city";
import { getCountryName, getStateName } from "@/utils/formatLocation";
import Pagination from "@/components/ui/Pagination";
import { JOB_GRID_PAGE_SIZE } from "@/constants/pagination";

/* ─── Google Fonts ─── */
if (!document.getElementById("ajp-font-link")) {
  const l = document.createElement("link");
  l.id = "ajp-font-link"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(l);
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

const EXPERIENCE_OPTIONS = [
  { id: "0", label: "Fresher"  },
  { id: "1", label: "1+ years" },
  { id: "2", label: "2+ years" },
  { id: "3", label: "3+ years" },
  { id: "5", label: "5+ years" },
  { id: "7", label: "7+ years" },
  { id: "10", label: "10+ years" },
];

const TIME_OPTIONS = [
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const jobMatchesExperience = (job, selected) => {
  if (!selected.length) return true;
  const jobMin = Number(job.experienceRequired?.[0] ?? 0);
  const jobMax = Number(job.experienceRequired?.[job.experienceRequired?.length - 1] ?? jobMin);
  return selected.some((id) => {
    const threshold = Number(id);
    if (Number.isNaN(threshold)) return true;
    if (threshold === 0) return jobMin === 0;
    return jobMin >= threshold || (jobMin <= threshold && jobMax >= threshold);
  });
};

const getTimeFilteredJobs = (source, timeRange) => {
  if (!timeRange) return source;
  const now = Date.now();
  const ranges = {
    "1h": 1 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "3d": 3 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  const windowMs = ranges[timeRange];
  if (!windowMs) return source;
  return source.filter((job) => {
    if (!job.createdAt) return false;
    const created = new Date(job.createdAt).getTime();
    if (Number.isNaN(created)) return false;
    return now - created <= windowMs;
  });
};

const globalStyle = `
  .ajp-root *, .ajp-root *::before, .ajp-root *::after { box-sizing: border-box; }
  .ajp-root { font-family:'DM Sans',sans-serif; overflow-x:hidden; max-width:100vw; }
  .ajp-root h1,.ajp-root h2,.ajp-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

  .job-card-wrap { transition:transform 0.2s ease; min-width:0; width:100%; }
  .job-card-wrap:hover { transform:translateY(-2px); }
  .page-btn { transition:all 0.18s ease; }
  .page-btn:hover:not(:disabled) { transform:scale(1.05); }
  .search-container { transition:border-color 0.2s, box-shadow 0.2s; }
  .search-container:focus-within { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.12) !important; }
  .filter-chip { display:inline-flex; align-items:center; gap:5px; background:#eef2ff; color:#4f46e5; border-radius:999px; padding:3px 10px 3px 12px; font-size:12px; font-weight:500; }
  .filter-chip button { display:flex; align-items:center; }

  /* Technical Filters */
  .tf-panel { background:#eef3f8; display:flex; flex-direction:column; min-height:100%; }
  .tf-header { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:18px 18px 14px; border-bottom:1px solid #d8e0ea; }
  .tf-header-title { display:flex; align-items:center; gap:8px; color:#121A2D; font-weight:700; font-size:15px; font-family:'Plus Jakarta Sans',sans-serif; }
  .tf-body { padding:4px 18px 18px; flex:1; }
  .tf-section { margin-top:14px; border-bottom:1px solid #d8e0ea; padding-bottom:12px; }
  .tf-section:last-of-type { border-bottom:none; }
  .tf-section-toggle { width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px; background:none; border:none; padding:4px 0 8px; cursor:pointer; text-align:left; }
  .tf-section-toggle:hover .tf-section-label { color:#64748b; }
  .tf-section-label { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#94a3b8; font-family:'DM Sans',monospace,sans-serif; transition:color 0.15s ease; }
  .tf-chevron { color:#94a3b8; flex-shrink:0; transition:transform 0.2s ease; }
  .tf-chevron.open { transform:rotate(180deg); }
  .tf-section-content { padding-top:2px; }
  .tf-option { display:flex; align-items:flex-start; gap:10px; padding:5px 0; cursor:pointer; user-select:none; }
  .tf-option-label { font-size:13.5px; color:#334155; line-height:1.35; font-family:'DM Sans',sans-serif; }
  .tf-box { width:15px; height:15px; border:1.5px solid #c5d0dc; border-radius:3px; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; background:#fff; transition:all 0.15s ease; }
  .tf-box.checked { background:#0950a0; border-color:#0950a0; }
  .tf-box.checked::after { content:''; width:7px; height:4px; border-left:2px solid #fff; border-bottom:2px solid #fff; transform:rotate(-45deg) translateY(-1px); }
  .tf-radio { width:15px; height:15px; border:1.5px solid #c5d0dc; border-radius:50%; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; background:#fff; transition:all 0.15s ease; }
  .tf-radio.checked { border-color:#0950a0; }
  .tf-radio.checked::after { content:''; width:7px; height:7px; border-radius:50%; background:#0950a0; }
  .tf-clear-btn { width:100%; margin-top:22px; padding:11px 14px; border:1.5px solid #c5d0dc; background:transparent; color:#121A2D; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',monospace,sans-serif; transition:all 0.15s ease; }
  .tf-clear-btn:hover { border-color:#0950a0; color:#0950a0; background:#fff; }
  .tf-close-bottom-btn { width:100%; margin-top:10px; padding:11px 14px; border:1.5px solid #121A2D; background:#121A2D; color:#fff; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',monospace,sans-serif; transition:all 0.15s ease; text-align:center; }
  .tf-close-bottom-btn:hover { background:#0950a0; border-color:#0950a0; }
  .tf-close-btn {
    background:#fff; border:1.5px solid #c5d0dc; color:#121A2D; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center;
    width:36px; height:36px; padding:0; border-radius:10px; flex-shrink:0;
    box-shadow:0 1px 3px rgba(15,23,42,0.08);
  }
  .tf-close-btn:hover { background:#dde6f0; border-color:#0950a0; color:#0950a0; }
  .tf-header.sticky-close { position:sticky; top:0; z-index:2; background:#eef3f8; }
  .tf-count { background:#0950a0; color:#fff; font-size:10px; font-weight:700; padding:2px 7px; border-radius:999px; min-width:18px; text-align:center; }
  .tf-field-label { display:block; font-size:11px; font-weight:600; color:#64748b; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em; }
  .tf-select { width:100%; padding:8px 10px; border:1.5px solid #c5d0dc; border-radius:8px; font-size:13px; background:#fff; margin-bottom:10px; font-family:'DM Sans',sans-serif; color:#334155; }
  .tf-select:focus { outline:none; border-color:#0950a0; box-shadow:0 0 0 2px rgba(9,80,160,0.12); }
  .tf-select:disabled { opacity:0.55; cursor:not-allowed; }

  /* Drawer */
  .ajp-overlay { display:none; position:fixed; inset:0; background:rgba(15,23,42,0.45); z-index:40; backdrop-filter:blur(2px); }
  .ajp-overlay.open { display:block; }
  .ajp-drawer { position:fixed; top:0; left:0; bottom:0; width:min(300px,88vw); background:#eef3f8; z-index:50; overflow-y:auto; box-shadow:4px 0 32px rgba(15,23,42,0.18); transform:translateX(-100%); transition:transform 0.28s cubic-bezier(.4,0,.2,1); border-radius:0; }
  .ajp-drawer.open { transform:translateX(0); }

  /* Layout */
  .ajp-layout { display:flex; gap:20px; align-items:flex-start; width:100%; min-width:0; }
  .ajp-sidebar { width:272px; flex-shrink:0; border-radius:4px; overflow:hidden; border:1px solid #d8e0ea; box-shadow:0 2px 12px rgba(18,26,45,0.05); }
  .ajp-right-col { flex:1; min-width:0; max-width:100%; }

  /* Search row */
  .ajp-search-row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:20px; align-items:stretch; width:100%; }
  .ajp-search-bar-wrap { flex:1 1 200px; min-width:0; display:flex; }

  /* Controls */
  .ajp-filter-toggle { display:none; align-items:center; gap:7px; padding:10px 16px; background:#fff; color:#121A2D; border:1.5px solid #d8e0ea; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap; flex-shrink:0; }
  .ajp-filter-toggle:hover { border-color:#0950a0; color:#0950a0; }
  .ajp-results-badge { display:flex; align-items:center; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 16px; gap:6px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.04); flex-shrink:0; }
  .ajp-view-toggle { display:flex; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04); flex-shrink:0; }

  /* Jobs grid — 3 columns on desktop = 4 rows per page (12 jobs) */
  .ajp-jobs-grid { display:grid; grid-template-columns:repeat(1, minmax(0, 1fr)); gap:20px; width:100%; min-width:0; }
  @media (min-width:640px) {
    .ajp-jobs-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width:960px) {
    .ajp-jobs-grid { grid-template-columns:repeat(3, minmax(0, 1fr)); }
  }

  /* Pagination */
  .ajp-pagination { display:flex; justify-content:center; align-items:center; gap:6px; margin-top:28px; flex-wrap:wrap; }

  /* Tablet */
  @media (max-width:900px) {
    .ajp-sidebar { display:none; }
    .ajp-filter-toggle { display:inline-flex; }
    .ajp-jobs-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
  }

  /* Mobile */
  @media (max-width:640px) {
    .ajp-hero { padding:80px 0 52px !important; }
    .ajp-main { padding:0 12px 36px !important; margin-top:-24px !important; }

    /* Row 1: Filters | badge | view-toggle  (order 1)
       Row 2: search bar full-width          (order 2) */
    .ajp-search-row     { gap:8px; }
    .ajp-filter-toggle  { order:1; padding:9px 12px; font-size:11px; }
    .ajp-results-badge  { order:1; flex:1; justify-content:center; padding:8px 10px; min-width:0; }
    .ajp-view-toggle    { order:1; }
    .ajp-search-bar-wrap { order:2; flex:1 1 100%; width:100%; }

    .ajp-jobs-grid { grid-template-columns:1fr; gap:12px; }
    .ajp-pagination { gap:4px; margin-top:20px; }
    .job-card-wrap { width:100%; min-width:0; max-width:100%; }
  }

  /* Very small */
  @media (max-width:380px) {
    .ajp-search-btn-text { display:none; }
    .ajp-results-badge { display:none !important; }
  }

  @keyframes spin { to { transform:rotate(360deg); } }
`;

const CheckboxGroup = ({ options, selected, onToggle }) => (
  <div>
    {options.map((opt) => {
      const checked = selected.includes(opt.id ?? opt.value);
      return (
        <label key={opt.id ?? opt.value} className="tf-option">
          <span className={`tf-box${checked ? " checked" : ""}`} aria-hidden="true" />
          <span className="tf-option-label">{opt.label}</span>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(opt.id ?? opt.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
        </label>
      );
    })}
  </div>
);

const RadioGroup = ({ options, value, onChange, name }) => (
  <div>
    {options.map((opt) => {
      const checked = value === (opt.id ?? opt.value);
      return (
        <label key={opt.id ?? opt.value} className="tf-option">
          <span className={`tf-radio${checked ? " checked" : ""}`} aria-hidden="true" />
          <span className="tf-option-label">{opt.label}</span>
          <input
            type="radio"
            name={name}
            checked={checked}
            onChange={() => onChange(opt.id ?? opt.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
        </label>
      );
    })}
  </div>
);

const CollapsibleSection = ({ label, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="tf-section">
      <button
        type="button"
        className="tf-section-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="tf-section-label">{label}</span>
        <ChevronDown size={14} className={`tf-chevron${open ? " open" : ""}`} />
      </button>
      {open && <div className="tf-section-content">{children}</div>}
    </div>
  );
};

const LocationFilter = ({
  filterCountry,
  setFilterCountry,
  filterState,
  setFilterState,
  filterCity,
  setFilterCity,
}) => {
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () => (filterCountry ? State.getStatesOfCountry(filterCountry) : []),
    [filterCountry]
  );
  const cities = useMemo(
    () => (filterCountry && filterState ? City.getCitiesOfState(filterCountry, filterState) : []),
    [filterCountry, filterState]
  );

  return (
    <div>
      <label className="tf-field-label">Country</label>
      <select
        className="tf-select"
        value={filterCountry}
        onChange={(e) => {
          setFilterCountry(e.target.value);
          setFilterState("");
          setFilterCity("");
        }}
      >
        <option value="">All countries</option>
        {countries.map((c) => (
          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
        ))}
      </select>

      <label className="tf-field-label">State / Province</label>
      <select
        className="tf-select"
        value={filterState}
        disabled={!filterCountry}
        onChange={(e) => {
          setFilterState(e.target.value);
          setFilterCity("");
        }}
      >
        <option value="">All states</option>
        {states.map((s) => (
          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
        ))}
      </select>

      <label className="tf-field-label">City</label>
      <select
        className="tf-select"
        value={filterCity}
        disabled={!filterState}
        onChange={(e) => setFilterCity(e.target.value)}
      >
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};

const FilterPanel = ({
  filterCountry,
  setFilterCountry,
  filterState,
  setFilterState,
  filterCity,
  setFilterCity,
  experienceLevels,
  setExperienceLevels,
  timeRange,
  setTimeRange,
  activeFiltersCount,
  clearAll,
  onClose,
}) => {

  const toggleExperience = (level) => {
    setExperienceLevels((prev) => (prev.includes(level) ? prev.filter((v) => v !== level) : [...prev, level]));
  };

  return (
    <div className="tf-panel">
      <div className={`tf-header${onClose ? " sticky-close" : ""}`}>
        <div className="tf-header-title">
          <SlidersHorizontal size={16} strokeWidth={2.2} />
          <span>Technical Filters</span>
          {activeFiltersCount > 0 && <span className="tf-count">{activeFiltersCount}</span>}
        </div>
        {onClose && (
          <button type="button" className="tf-close-btn" onClick={onClose} aria-label="Close filters">
            <RxCross2 size={20} />
          </button>
        )}
      </div>

      <div className="tf-body">
        <CollapsibleSection label="Location" defaultOpen>
          <LocationFilter
            filterCountry={filterCountry}
            setFilterCountry={setFilterCountry}
            filterState={filterState}
            setFilterState={setFilterState}
            filterCity={filterCity}
            setFilterCity={setFilterCity}
          />
        </CollapsibleSection>

        <CollapsibleSection label="Experience" defaultOpen>
          <CheckboxGroup
            options={EXPERIENCE_OPTIONS}
            selected={experienceLevels}
            onToggle={toggleExperience}
          />
        </CollapsibleSection>

        <CollapsibleSection label="Posted" defaultOpen>
          <RadioGroup
            options={TIME_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
            value={timeRange}
            name="tf-posted"
            onChange={(id) => setTimeRange((prev) => (prev === id ? "" : id))}
          />
        </CollapsibleSection>

        <button type="button" className="tf-clear-btn" onClick={clearAll}>
          Clear All Filters
        </button>

        {onClose && (
          <button type="button" className="tf-close-bottom-btn" onClick={onClose}>
            Close Filters
          </button>
        )}
      </div>
    </div>
  );
};

const AllJobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState(searchParams.get("country") || "");
  const [filterState, setFilterState] = useState(searchParams.get("state") || "");
  const [filterCity, setFilterCity] = useState(searchParams.get("city") || "");
  const [jobs, setJobs] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { searchInput } = location.state || {};
  const user = useSelector((state) => state.user.seekerInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = JOB_GRID_PAGE_SIZE;
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const skipLocationFetch = useRef(true);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setDrawerOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (searchInput) {
      setSearchTerm(searchInput);
      window.history.replaceState({}, document.title);
      fetchJobs({ page: 1, searchOverride: searchInput });
    } else {
      fetchJobs({ page: 1 });
    }
  }, []);

  useEffect(() => { fetchJobs({ page: currentPage }); }, [currentPage]);

  useEffect(() => {
    if (skipLocationFetch.current) {
      skipLocationFetch.current = false;
      return;
    }
    setCurrentPage(1);
    fetchJobs({ page: 1 });
  }, [filterCountry, filterState, filterCity]);

  const fetchJobs = async ({ page = 1, searchOverride } = {}) => {
    try {
      setLoading(true);
      const { data } = await userAxiosInstance.get("/getJobPosts", {
        params: {
          userId: user?.userId,
          page,
          limit: jobsPerPage,
          search: (searchOverride ?? searchTerm)?.trim() || undefined,
          country: filterCountry || undefined,
          state: filterState || undefined,
          city: filterCity || undefined,
        },
      });
      const serverJobs = data?.jobs || data?.jobPosts || [];
      setJobs(serverJobs);
      setServerTotalPages(data?.totalPages || 1);
    } catch (error) {
      toast.warning(error?.response?.data?.message || "An error occurred");
    } finally { setLoading(false); }
  };

  const clearAll = () => {
    setFilterCountry("");
    setFilterState("");
    setFilterCity("");
    setExperienceLevels([]);
    setTimeRange("");
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
    fetchJobs({ page: 1 });
  };
  const clearSearchTerm = () => { setSearchTerm(""); setCurrentPage(1); fetchJobs({ page: 1, searchOverride: "" }); };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterCountry) params.set("country", filterCountry);
    if (filterState) params.set("state", filterState);
    if (filterCity) params.set("city", filterCity);
    setSearchParams(params, { replace: true });
  }, [filterCountry, filterState, filterCity, setSearchParams]);

  const locationLabel = [filterCity, getStateName(filterCountry, filterState), getCountryName(filterCountry)]
    .filter(Boolean)
    .join(", ");

  const pageTitle = locationLabel
    ? `Mobile Repair Jobs in ${locationLabel} | TechPath`
    : "Mobile Phone Repair Jobs Worldwide | TechPath Job Board";
  const pageDescription = locationLabel
    ? `Browse mobile repair jobs in ${locationLabel}. Find chip-level technician, Android repair, iPhone repair, software, and management positions on TechPath.`
    : "Browse mobile repair jobs worldwide. Find chip-level technician, Android repair, iPhone repair, software, and management positions. Filter by country, state, city, job type, and experience level.";
  const pageCanonical = locationLabel
    ? `https://www.techpath.in/all-jobs?${new URLSearchParams({ ...(filterCountry && { country: filterCountry }), ...(filterState && { state: filterState }), ...(filterCity && { city: filterCity }) }).toString()}`
    : "https://www.techpath.in/all-jobs";

  const activeFiltersCount =
    (filterCountry ? 1 : 0) +
    (filterState ? 1 : 0) +
    (filterCity ? 1 : 0) +
    experienceLevels.length +
    (timeRange ? 1 : 0);

  const timeFilteredJobs = useMemo(() => {
    let result = jobs;
    result = result.filter((job) => jobMatchesExperience(job, experienceLevels));
    result = getTimeFilteredJobs(result, timeRange);
    return result;
  }, [jobs, experienceLevels, timeRange]);

  const totalPages = serverTotalPages;

  const filterProps = {
    filterCountry,
    setFilterCountry,
    filterState,
    setFilterState,
    filterCity,
    setFilterCity,
    experienceLevels,
    setExperienceLevels,
    timeRange,
    setTimeRange,
    activeFiltersCount,
    clearAll,
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageCanonical} />
      </Helmet>
      <style>{globalStyle}</style>

      {/* Mobile drawer */}
      <div className={`ajp-overlay${drawerOpen?" open":""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`ajp-drawer${drawerOpen?" open":""}`}>
        <FilterPanel {...filterProps} onClose={() => setDrawerOpen(false)} />
      </div>

      <motion.div className="ajp-root" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}
        style={{ background:"#f1f5f9", minHeight:"100vh" }}>

        {/* Hero */}
        <div className="ajp-hero" style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)", padding:"110px 0 60px", position:"relative", overflow:"hidden", maxWidth:"100vw" }}>
          <div style={{ position:"absolute", top:-40, right:0, width:180, height:180, borderRadius:"50%", background:"rgba(99,102,241,0.25)", filter:"blur(50px)", transform:"translateX(40%)" }} />
          <div style={{ position:"absolute", bottom:-20, left:"30%", width:150, height:150, borderRadius:"50%", background:"rgba(167,139,250,0.15)", filter:"blur(40px)" }} />
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px", position:"relative", zIndex:1 }}>
            <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}>
              <p style={{ color:"#a5b4fc", fontSize:13, fontWeight:500, marginBottom:6, letterSpacing:"0.05em", textTransform:"uppercase" }}>Discover opportunities</p>
              <h1 style={{ color:"#fff", fontSize:"clamp(20px,4vw,32px)", fontWeight:800, margin:0, letterSpacing:"-0.02em" }}>
                Mobile Repair Jobs{locationLabel ? ` in ${locationLabel}` : " Worldwide"}
              </h1>
              <p style={{ color:"#c7d2fe", fontSize:14, marginTop:8, fontWeight:400 }}>
                {timeFilteredJobs.length} positions available — Chip-level, Android, iPhone, &amp; Management Roles
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main */}
        <div className="ajp-main" style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px 48px", marginTop:-32, position:"relative", zIndex:2 }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="ajp-layout">

            {/* Desktop sidebar */}
            <motion.aside variants={itemVariants} className="ajp-sidebar">
              <FilterPanel {...filterProps} onClose={null} />
            </motion.aside>

            {/* Right column */}
            <motion.div variants={itemVariants} className="ajp-right-col">

              {/* Search row */}
              <div className="ajp-search-row">

                {/* Row 1 on mobile: Filters toggle */}
                <button className="ajp-filter-toggle" onClick={() => setDrawerOpen(true)}>
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFiltersCount > 0 && <span className="tf-count">{activeFiltersCount}</span>}
                </button>

                {/* Row 1 on mobile: Results badge */}
                <div className="ajp-results-badge">
                  <span style={{ fontSize:18, fontWeight:800, color:"#4f46e5", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{timeFilteredJobs.length}</span>
                  <span style={{ fontSize:13, color:"#64748b" }}>jobs found</span>
                </div>

                {/* Row 1 on mobile: View toggle — tiles vs list */}
                <div className="ajp-view-toggle">
                  {[{ mode: "grid", icon: <FaTh /> }, { mode: "list", icon: <FaList /> }].map(({ mode, icon }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      title={mode === "grid" ? "Tile view" : "List view"}
                      style={{
                        padding: "10px 14px",
                        border: "none",
                        background: viewMode === mode ? "linear-gradient(135deg,#4f46e5,#6366f1)" : "transparent",
                        color: viewMode === mode ? "#fff" : "#94a3b8",
                        cursor: "pointer",
                        fontSize: 14,
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Row 2 on mobile: Search bar (full width) */}
                <div className="ajp-search-bar-wrap">
                  <div className="search-container"
                    style={{ display:"flex", alignItems:"center", flex:1, background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:12, padding:"0 6px 0 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", minWidth:0 }}>
                    <FaSearch style={{ color:"#94a3b8", flexShrink:0, fontSize:14, marginRight:8 }} />
                    <input type="text" value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => { if (e.key==="Enter") { setCurrentPage(1); fetchJobs({page:1}); } }}
                      placeholder="Search job title…"
                      style={{ flex:1, border:"none", background:"transparent", fontSize:14, color:"#1e293b", outline:"none", fontFamily:"'DM Sans',sans-serif", padding:"12px 0", minWidth:0 }} />
                    {searchTerm && (
                      <button onClick={clearSearchTerm} style={{ background:"#f1f5f9", border:"none", borderRadius:6, padding:"3px 6px", cursor:"pointer", display:"flex", alignItems:"center", marginRight:6, flexShrink:0 }}>
                        <RxCross2 style={{ color:"#64748b", fontSize:13 }} />
                      </button>
                    )}
                    <button onClick={() => { setCurrentPage(1); fetchJobs({page:1}); }}
                      style={{ padding:"8px 14px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 2px 6px rgba(99,102,241,0.3)", transition:"all 0.1s ease", flexShrink:0, display:"flex", alignItems:"center", gap:6 }}
                      onMouseOver={(e) => e.currentTarget.style.transform="scale(1.02)"}
                      onMouseOut={(e) => e.currentTarget.style.transform="scale(1)"}>
                      <FaSearch size={11} />
                      <span className="ajp-search-btn-text">Search</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Listings */}
              {loading ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:280, background:"#fff", borderRadius:16, border:"1.5px solid #e2e8f0" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #e0e7ff", borderTopColor:"#6366f1", animation:"spin 0.8s linear infinite", marginBottom:14 }} />
                  <p style={{ color:"#64748b", fontSize:14, fontWeight:500 }}>Fetching opportunities…</p>
                </div>
              ) : timeFilteredJobs.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={viewMode === "grid" ? "ajp-jobs-grid" : ""}
                    style={viewMode === "list" ? { display: "flex", flexDirection: "column", gap: 12 } : undefined}
                  >
                    {timeFilteredJobs.map((job, index) => (
                      <motion.div key={job._id} variants={itemVariants} className="job-card-wrap min-w-0 h-full">
                        {viewMode === "grid" ? (
                          <FeaturedJobCard job={job} index={index} compact />
                        ) : (
                          <JobCard job={job} layout="list" />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                  {totalPages > 1 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="ajp-pagination">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        prevLabel="← Prev"
                        nextLabel="Next →"
                      />
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:260, padding:"40px 20px", background:"#fff", borderRadius:16, border:"1.5px solid #e2e8f0", gap:12, textAlign:"center" }}>
                  <div style={{ fontSize:48 }}>🔍</div>
                  <p style={{ fontSize:18, fontWeight:700, color:"#1e293b", margin:0 }}>No jobs found</p>
                  <ul style={{ fontSize:14, color:"#64748b", margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:4 }}>
                    <li>Clear filters and browse all locations</li>
                    <li>Search for a specific job: &quot;Chip-Level Technician&quot; or &quot;iPhone Repair&quot;</li>
                    <li>Select a different Kerala district</li>
                    <li>Check back soon — new jobs posted daily</li>
                  </ul>
                  <a href="/employer/register"
                    style={{ marginTop:8, padding:"10px 20px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Post a Mobile Repair Job Now
                  </a>
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AllJobsPage;