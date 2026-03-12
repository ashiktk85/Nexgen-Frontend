import React, { useEffect, useState } from "react";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import JobCard from "../../../components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { useSelector } from "react-redux";

/* ─── Google Fonts ─── */
if (!document.getElementById("ajp-font-link")) {
  const l = document.createElement("link");
  l.id = "ajp-font-link"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(l);
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

const globalStyle = `
  .ajp-root *, .ajp-root *::before, .ajp-root *::after { box-sizing: border-box; }
  .ajp-root { font-family:'DM Sans',sans-serif; overflow-x:hidden; max-width:100vw; }
  .ajp-root h1,.ajp-root h2,.ajp-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

  .filter-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px !important; }
  .filter-select:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
  .job-card-wrap { transition:transform 0.2s ease; }
  .job-card-wrap:hover { transform:translateY(-2px); }
  .page-btn { transition:all 0.18s ease; }
  .page-btn:hover:not(:disabled) { transform:scale(1.05); }
  .search-container { transition:border-color 0.2s, box-shadow 0.2s; }
  .search-container:focus-within { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.12) !important; }
  .filter-chip { display:inline-flex; align-items:center; gap:5px; background:#eef2ff; color:#4f46e5; border-radius:999px; padding:3px 10px 3px 12px; font-size:12px; font-weight:500; }
  .filter-chip button { display:flex; align-items:center; }

  /* Drawer */
  .ajp-overlay { display:none; position:fixed; inset:0; background:rgba(15,23,42,0.45); z-index:40; backdrop-filter:blur(2px); }
  .ajp-overlay.open { display:block; }
  .ajp-drawer { position:fixed; top:0; left:0; bottom:0; width:min(300px,88vw); background:#fff; z-index:50; overflow-y:auto; box-shadow:4px 0 32px rgba(15,23,42,0.18); transform:translateX(-100%); transition:transform 0.28s cubic-bezier(.4,0,.2,1); border-radius:0 20px 20px 0; }
  .ajp-drawer.open { transform:translateX(0); }

  /* Layout */
  .ajp-layout { display:flex; gap:20px; align-items:flex-start; width:100%; min-width:0; }
  .ajp-sidebar { width:260px; flex-shrink:0; background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden; border:1px solid #e8edf5; }
  .ajp-right-col { flex:1; min-width:0; max-width:100%; overflow:hidden; }

  /* Search row */
  .ajp-search-row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:20px; align-items:stretch; width:100%; }
  .ajp-search-bar-wrap { flex:1 1 200px; min-width:0; display:flex; }

  /* Controls */
  .ajp-filter-toggle { display:none; align-items:center; gap:7px; padding:10px 16px; background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; border:none; border-radius:12px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 4px 12px rgba(99,102,241,.3); white-space:nowrap; flex-shrink:0; }
  .ajp-results-badge { display:flex; align-items:center; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 16px; gap:6px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.04); flex-shrink:0; }
  .ajp-view-toggle { display:flex; background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04); flex-shrink:0; }

  /* Jobs grid */
  .ajp-jobs-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(280px,100%), 1fr)); gap:16px; width:100%; }

  /* Pagination */
  .ajp-pagination { display:flex; justify-content:center; align-items:center; gap:6px; margin-top:28px; flex-wrap:wrap; }

  /* Tablet */
  @media (max-width:900px) {
    .ajp-sidebar { display:none; }
    .ajp-filter-toggle { display:inline-flex; }
    .ajp-jobs-grid { grid-template-columns:repeat(auto-fill, minmax(min(240px,100%), 1fr)); }
  }

  /* Mobile */
  @media (max-width:640px) {
    .ajp-hero { padding:80px 0 52px !important; }
    .ajp-main { padding:0 12px 36px !important; margin-top:-24px !important; }

    /* Row 1: Filters | badge | view-toggle  (order 1)
       Row 2: search bar full-width          (order 2) */
    .ajp-search-row     { gap:8px; }
    .ajp-filter-toggle  { order:1; }
    .ajp-results-badge  { order:1; flex:1; justify-content:center; }
    .ajp-view-toggle    { order:1; }
    .ajp-search-bar-wrap { order:2; flex:1 1 100%; width:100%; }

    .ajp-jobs-grid { grid-template-columns:1fr; gap:10px; }
    .ajp-pagination { gap:4px; margin-top:20px; }
  }

  /* Very small */
  @media (max-width:380px) {
    .ajp-search-btn-text { display:none; }
    .ajp-results-badge { display:none !important; }
  }

  @keyframes spin { to { transform:rotate(360deg); } }
`;

const SelectField = ({ label, icon, value, onChange, options, placeholder }) => (
  <div>
    <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"#94a3b8", marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {icon} {label}
    </label>
    <select className="filter-select" value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width:"100%", padding:"9px 36px 9px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, background:"#f8fafc", fontSize:13.5, color:value?"#1e293b":"#94a3b8", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
      <option value="">{placeholder}</option>
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const FilterPanel = ({
  jobs,
  searchLocation,
  setSearchLocation,
  jobType,
  setJobType,
  experienceLevel,
  setExperienceLevel,
  timeRange,
  setTimeRange,
  activeFiltersCount,
  clearAll,
  handleFilter,
  onClose,
}) => {
  const timeOptions = [
    { value: "1h", label: "Last hour" },
    { value: "24h", label: "Last 24 hours" },
    { value: "3d", label: "Last 3 days" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];
  const timeLabelMap = timeOptions.reduce((acc, opt) => {
    acc[opt.value] = opt.label;
    return acc;
  }, {});

  return (
  <>
    <div style={{ background:"linear-gradient(135deg,#312e81,#4f46e5)", padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:1 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:16 }}>⚙️</span>
        <span style={{ color:"#fff", fontWeight:700, fontSize:15, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Filters</span>
        {activeFiltersCount > 0 && <span style={{ background:"#a5b4fc", color:"#1e1b4b", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{activeFiltersCount}</span>}
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {activeFiltersCount > 0 && <button onClick={clearAll} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#e0e7ff", fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>Clear all</button>}
        {onClose && <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", borderRadius:6, padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}><RxCross2 size={16} /></button>}
      </div>
    </div>
    <div style={{ padding:"20px 18px", display:"flex", flexDirection:"column", gap:18 }}>
      <SelectField label="Location" icon="📍" value={searchLocation} onChange={setSearchLocation} placeholder="All locations" options={Array.from(new Set(jobs.map(j=>j.city))).map(c=>({value:c,label:c}))} />
      <SelectField label="Job Type" icon="💼" value={jobType} onChange={setJobType} placeholder="All job types" options={Array.from(new Set(jobs.map(j=>j.jobTitle))).map(t=>({value:t,label:t}))} />
      <SelectField label="Experience" icon="📈" value={experienceLevel} onChange={setExperienceLevel} placeholder="Any experience" options={Array.from(new Set(jobs.flatMap(j=>j.experienceRequired))).sort((a,b)=>a-b).map(l=>({value:l,label:`${l} years`}))} />
      <SelectField
        label="Posted"
        icon="⏱️"
        value={timeRange}
        onChange={setTimeRange}
        placeholder="Any time"
        options={timeOptions}
      />
      {activeFiltersCount > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {searchLocation && <span className="filter-chip">📍 {searchLocation}<button onClick={()=>setSearchLocation("")} style={{ background:"none",border:"none",cursor:"pointer",color:"#6366f1",padding:0 }}><RxCross2 size={11}/></button></span>}
          {jobType && <span className="filter-chip">💼 {jobType.length>12?jobType.slice(0,12)+"…":jobType}<button onClick={()=>setJobType("")} style={{ background:"none",border:"none",cursor:"pointer",color:"#6366f1",padding:0 }}><RxCross2 size={11}/></button></span>}
          {experienceLevel && <span className="filter-chip">📈 {experienceLevel} yrs<button onClick={()=>setExperienceLevel("")} style={{ background:"none",border:"none",cursor:"pointer",color:"#6366f1",padding:0 }}><RxCross2 size={11}/></button></span>}
          {timeRange && (
            <span className="filter-chip">
              ⏱️ {timeLabelMap[timeRange] || timeRange}
              <button
                onClick={() => setTimeRange("")}
                style={{ background:"none",border:"none",cursor:"pointer",color:"#6366f1",padding:0 }}
              >
                <RxCross2 size={11}/>
              </button>
            </span>
          )}
        </div>
      )}
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={()=>{handleFilter();onClose?.();}}
        style={{ width:"100%", padding:"11px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 4px 12px rgba(99,102,241,0.35)" }}>
        Apply Filters
      </motion.button>
    </div>
  </>
  );
};

const AllJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { searchInput } = location.state || {};
  const user = useSelector((state) => state.user.seekerInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const [serverTotalPages, setServerTotalPages] = useState(1);

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

  const fetchJobs = async ({ page = 1, searchOverride } = {}) => {
    try {
      setLoading(true);
      const { data } = await userAxiosInstance.get("/getJobPosts", {
        params: {
          userId: user?.userId,
          page,
          limit: jobsPerPage,
          search: (searchOverride ?? searchTerm)?.trim() || undefined,
          city: searchLocation || undefined,
          jobTitle: jobType || undefined,
          experience: experienceLevel || undefined,
        },
      });
      const serverJobs = data?.jobs || data?.jobPosts || [];
      setJobs(serverJobs); setFilteredJobs(serverJobs);
      setServerTotalPages(data?.totalPages || 1);
    } catch (error) {
      toast.warning(error?.response?.data?.message || "An error occurred");
    } finally { setLoading(false); }
  };

  const handleFilter = () => { setCurrentPage(1); fetchJobs({ page:1 }); };
  const clearAll = () => {
    setFilteredJobs(jobs);
    setSearchLocation("");
    setJobType("");
    setExperienceLevel("");
    setTimeRange("");
    setCurrentPage(1);
  };
  const clearSearchTerm = () => { setSearchTerm(""); setCurrentPage(1); };

  const totalPages = serverTotalPages;
  const activeFiltersCount = [searchLocation, jobType, experienceLevel, timeRange].filter(Boolean).length;

  const getTimeFilteredJobs = (source) => {
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

  const timeFilteredJobs = getTimeFilteredJobs(filteredJobs);

  const filterProps = {
    jobs,
    searchLocation,
    setSearchLocation,
    jobType,
    setJobType,
    experienceLevel,
    setExperienceLevel,
    timeRange,
    setTimeRange,
    activeFiltersCount,
    clearAll,
    handleFilter,
  };

  return (
    <>
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
                Find Your Next Dream Job
               {" "}
              </h1>
              <p style={{ color:"#c7d2fe", fontSize:14, marginTop:8, fontWeight:400 }}>{timeFilteredJobs.length} positions available across top companies</p>
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
                  ⚙️ Filters
                  {activeFiltersCount > 0 && <span style={{ background:"#fff", color:"#4f46e5", borderRadius:999, fontSize:11, fontWeight:700, padding:"1px 7px" }}>{activeFiltersCount}</span>}
                </button>

                {/* Row 1 on mobile: Results badge */}
                <div className="ajp-results-badge">
                  <span style={{ fontSize:18, fontWeight:800, color:"#4f46e5", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{timeFilteredJobs.length}</span>
                  <span style={{ fontSize:13, color:"#64748b" }}>jobs found</span>
                </div>

                {/* Row 1 on mobile: View toggle */}
                <div className="ajp-view-toggle">
                  {[{mode:"grid",icon:<FaTh/>},{mode:"list",icon:<FaList/>}].map(({mode,icon}) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      style={{ padding:"10px 14px", border:"none", background:viewMode===mode?"linear-gradient(135deg,#4f46e5,#6366f1)":"transparent", color:viewMode===mode?"#fff":"#94a3b8", cursor:"pointer", fontSize:14, transition:"all 0.2s", display:"flex", alignItems:"center" }}>
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
                  <motion.div variants={containerVariants} initial="hidden" animate="visible"
                    className={viewMode==="grid"?"ajp-jobs-grid":""}
                    style={viewMode==="list"?{display:"flex",flexDirection:"column",gap:12}:{}}>
                    {timeFilteredJobs.map((job) => (
                      <motion.div key={job._id} variants={itemVariants} className="job-card-wrap">
                        <JobCard job={job} layout={viewMode} />
                      </motion.div>
                    ))}
                  </motion.div>
                  {totalPages > 1 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="ajp-pagination">
                      <button className="page-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}
                        style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", background:currentPage===1?"#f8fafc":"#fff", color:currentPage===1?"#cbd5e1":"#4f46e5", fontWeight:600, fontSize:14, cursor:currentPage===1?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        ← Prev
                      </button>
                      {[...Array(totalPages)].map((_,i) => {
                        const page=i+1, isActive=currentPage===page;
                        return (
                          <button key={i} data-num={page} className="page-btn" onClick={()=>setCurrentPage(page)}
                            style={{ width:38, height:38, borderRadius:10, cursor:"pointer", border:isActive?"none":"1.5px solid #e2e8f0", background:isActive?"linear-gradient(135deg,#4f46e5,#6366f1)":"#fff", color:isActive?"#fff":"#475569", fontWeight:isActive?700:500, fontSize:14, boxShadow:isActive?"0 4px 12px rgba(99,102,241,0.3)":"none", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                            {page}
                          </button>
                        );
                      })}
                      <button className="page-btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}
                        style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", background:currentPage===totalPages?"#f8fafc":"#fff", color:currentPage===totalPages?"#cbd5e1":"#4f46e5", fontWeight:600, fontSize:14, cursor:currentPage===totalPages?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        Next →
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:260, padding:"40px 20px", background:"#fff", borderRadius:16, border:"1.5px solid #e2e8f0", gap:12, textAlign:"center" }}>
                  <div style={{ fontSize:48 }}>🔍</div>
                  <h2 style={{ fontSize:20, fontWeight:700, color:"#1e293b", margin:0 }}>No jobs found</h2>
                  <p style={{ fontSize:14, color:"#94a3b8", margin:0 }}>Try adjusting your filters or search term</p>
                  <button onClick={()=>{clearAll();clearSearchTerm();}}
                    style={{ marginTop:4, padding:"8px 20px", background:"#eef2ff", color:"#4f46e5", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Reset all filters
                  </button>
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