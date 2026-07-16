import React, { useEffect, useState } from "react";
import JobCard from "@/components/Employer/JobCard";
import StatCard from "@/components/ui/StatCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useNavigate } from "react-router-dom";
import { FaTh, FaList } from "react-icons/fa";
import { employerJobDelete, employerJobStatusChange } from "@/apiServices/userApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Briefcase, AlertTriangle, TrendingUp, CheckCircle2, XCircle, Users, ChevronDown, Pencil, Trash2, MapPin, ExternalLink } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import { formatSalary } from "@/utils/formatSalary";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";
import Pagination from "@/components/ui/Pagination";
import { JOB_GRID_PAGE_SIZE } from "@/constants/pagination";
import { getSafePage } from "@/utils/pagination";
/* ─── Inject styles once ─── */
if (!document.getElementById("ejl-styles")) {
  const s = document.createElement("style");
  s.id = "ejl-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .ejl-root h1,.ejl-root h2,.ejl-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    .ejl-view-btn {
      display:flex; align-items:center; justify-content:center;
      width:36px; height:36px; border:none; cursor:pointer; transition:all .18s;
    }
    .ejl-view-btn.active  { background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; }
    .ejl-view-btn.inactive { background:transparent; color:#94a3b8; }
    .ejl-view-btn:first-child { border-radius:9px 0 0 9px; }
    .ejl-view-btn:last-child  { border-radius:0 9px 9px 0; }
    .ejl-view-btn.inactive:hover { background:#f1f5f9; color:#4f46e5; }

    .ejl-filter-row {
      display:flex;
      flex-wrap:nowrap;
      gap:8px;
      margin-top:8px;
      overflow-x:auto;
      -webkit-overflow-scrolling:touch;
    }
    .ejl-filter-input {
      flex:0 0 auto;
      min-width:140px;
      padding:8px 10px;
      border-radius:10px;
      border:1.5px solid #e2e8f0;
      background:#fff;
      font-size:12.5px;
      color:#0f172a;
      font-family:'DM Sans',sans-serif;
    }

    .ejl-search-filters {
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    @media (max-width: 640px) {
      .ejl-search-filters {
        flex-direction:column;
        align-items:stretch;
      }
      .ejl-filter-row {
        width:100%;
      }
    }

    .ejl-add-btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 18px; border-radius:10px; border:none; cursor:pointer;
      font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff;
      box-shadow:0 4px 12px rgba(99,102,241,.3); transition:all .18s;
    }
    .ejl-add-btn:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(99,102,241,.38); }

    .ejl-spinner { width:36px; height:36px; border-radius:50%; border:3px solid #e0e7ff; border-top-color:#6366f1; animation:ejl-spin .75s linear infinite; }
    @keyframes ejl-spin { to { transform:rotate(360deg); } }

    .ejl-del-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:9px 20px; border-radius:10px; border:none; cursor:pointer;
      font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; transition:all .18s;
    }
    .ejl-del-confirm { background:linear-gradient(135deg,#dc2626,#ef4444); color:#fff; box-shadow:0 4px 12px rgba(239,68,68,.28); }
    .ejl-del-confirm:hover { opacity:.9; transform:translateY(-1px); }
    .ejl-del-cancel  { background:#f1f5f9; color:#475569; }
    .ejl-del-cancel:hover { background:#e2e8f0; }

    .ejl-jobs-grid {
      display:grid;
      grid-template-columns:repeat(1, minmax(0, 1fr));
      gap:14px;
      align-items:stretch;
    }
    @media (min-width:640px) {
      .ejl-jobs-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width:960px) {
      .ejl-jobs-grid { grid-template-columns:repeat(3, minmax(0, 1fr)); }
    }

    .ejl-view-toggle { display:none; }
    @media (min-width:768px) {
      .ejl-view-toggle { display:flex; }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Animation variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .08 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .35, ease: "easeOut" } } };
const cardVariants = {
  hidden: { opacity: 0, scale: .97 },
  visible: (i) => ({ opacity: 1, scale: 1, transition: { duration: .3, delay: i * .055 } }),
  exit: { opacity: 0, scale: .97, transition: { duration: .18 } },
};

/* ─── Stat card definitions ─── */
const getStats = (stats) => [
  {
    label: "Total Jobs",
    value: stats.total ?? 0,
    icon: <TrendingUp size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)",
    shadow: "0 8px 24px rgba(99,102,241,.35)",
  },
  {
    label: "Active",
    value: stats.active ?? 0,
    icon: <CheckCircle2 size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)",
    shadow: "0 8px 24px rgba(16,185,129,.32)",
  },
  {
    label: "Closed",
    value: stats.closed ?? 0,
    icon: <XCircle size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#38bdf8 100%)",
    shadow: "0 8px 24px rgba(14,165,233,.3)",
  },
  {
    label: "Total Applicants",
    value: stats.totalApplicants ?? 0,
    icon: <Users size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#b45309 0%,#f59e0b 55%,#fbbf24 100%)",
    shadow: "0 8px 24px rgba(217,119,6,.28)",
  },
];

/* ════════════════════════════════════════════ */
function JobList() {
  const employer = useSelector((state) => state.employer.employer);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusJob, setStatusJob] = useState(null);
  const navigate = useNavigate();

  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const JOBS_PER_PAGE = JOB_GRID_PAGE_SIZE;

  const handleEdit = (job) => job && setEditingJob(job);
  const handleView = (job) => job && setViewingJob(job);
  const handleDelete = (job) => { if (job) { setSelectedJob(job); setIsDialogOpen(true); } };

  const handleStatus = (job) => {
    if (job) { setStatusJob(job); setIsStatusDialogOpen(true); }
  };

  const fetchJobs = async ({
    page = currentPage,
    search = appliedSearch,
    status = statusFilter,
    location = appliedLocation,
  } = {}) => {
    if (!employer?.employerId) return;
    setLoading(true);
    try {
      const res = await employerAxiosInstance.get(`/job-list/${employer.employerId}`, {
        params: {
          page,
          limit: JOBS_PER_PAGE,
          search: search?.trim() || undefined,
          status: status !== "all" ? status : undefined,
          location: location?.trim() || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });
      setJobs(res.data.jobPosts || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount ?? (res.data.jobPosts || []).length);
      if (res.data.stats) setStats(res.data.stats);
    } catch (err) {
      toast.warning(err?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusDecision = async () => {
    if (!statusJob) return;
    try {
      const data = { status: statusJob?.status === "open" ? "close" : "open" };
      const res = await employerJobStatusChange(statusJob._id, data);
      if (res) {
        toast.success(`Job ${data.status === "open" ? "reopened" : "closed"}.`);
        fetchJobs();
      } else toast.error("Error updating status");
    } catch (err) { toast.error(err.response?.data?.message || "Unexpected error"); }
    finally { setIsStatusDialogOpen(false); setStatusJob(null); }
  };

  const handleDeleteDecision = async () => {
    if (!selectedJob) return;
    try {
      const res = await employerJobDelete(selectedJob._id, employer?.employerId);
      if (res) {
        toast.success("Job deleted.");
        fetchJobs();
      } else toast.error("Error deleting job");
    } catch (err) { toast.error(err.response?.data?.message || "Unexpected error"); }
    finally { setIsDialogOpen(false); }
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => { if (e.matches) setViewMode("grid"); };
    mq.addEventListener("change", onChange);
    if (mq.matches) setViewMode("grid");
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    fetchJobs({ page: currentPage });
  }, [employer?.employerId, currentPage, statusFilter, appliedSearch, appliedLocation]);

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedLocation(locationFilter);
    setCurrentPage(1);
  };
  const columns = [
    {
      id: "jobCode",
      header: "Job ID",
      cell: (row) => (
        <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", fontFamily: "ui-monospace, monospace" }}>
          {row.jobCode || "—"}
        </span>
      ),
      accessor: "jobCode",
    },
    {
      id: "jobTitle",
      header: "Job Title",
      cell: (row) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{row.jobTitle}</span>
      ),
      sortable: false,
      accessor: "jobTitle",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => <span style={{ fontSize: 13, color: "#475569" }}>{row.city}, {row.country}</span>
    },
    {
      id: "salary",
      header: "Salary",
      cell: (row) => <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>{formatSalary(row)}</span>
    },
    {
      id: "applicants",
      header: "Applicants",
      cell: (row) => (
        <button
          onClick={() => navigate(`/employer/applicants/${row._id}`)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff",
            fontSize: 12, fontWeight: 600, color: "#4f46e5", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif",
            transition: "all .2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "#f4f6f8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
        >
          View ({row.applicantsCount || 0})
        </button>
      )
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const isOpen = row.status === "open";
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999,
            fontSize: 11, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: "nowrap",
            background: isOpen ? "#f0fdf4" : "#f1f5f9",
            color: isOpen ? "#16a34a" : "#64748b",
            border: isOpen ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: isOpen ? "#22c55e" : "#94a3b8" }} />
            {isOpen ? "Active" : "Closed"}
          </span>
        );
      },
      accessor: "status",
    },
  ];

  const safePage = getSafePage(currentPage, totalPages);

  return (
    <>
      <div
        className="ejl-root"
        style={{
          background: "#f1f5f9",
          minHeight: "100vh",
          padding: "20px 12px 32px",
        }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* ── Page heading ── */}
          <motion.div
            variants={itemVariants}
            className="employer-page-header"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Overview
              </p>
              <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                Job Listing
              </h1>
            </div>
            <button className="ejl-add-btn ejl-add-btn-mobile" onClick={() => navigate("/employer/create_job")}>
              <Plus size={14} /> Post New Job
            </button>
          </motion.div>

          {/* ── Gradient stat cards ── */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,140px),1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {getStats(stats).map(({ label, value, icon, gradient, shadow }) => (
              <StatCard
                key={label}
                icon={icon}
                value={value}
                label={label}
                gradient={gradient}
                shadow={shadow}
              />
            ))}
          </motion.div>

          {/* ── Section header ── */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1e293b",
                margin: 0,
                flexShrink: 0,
              }}
            >
              All Listings
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#94a3b8", marginLeft: 7 }}>({totalCount})</span>
            </h2>
            <div className="ejl-view-toggle" style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginLeft: "auto" }}>
              <button className={`ejl-view-btn ${viewMode === "grid" ? "active" : "inactive"}`} onClick={() => setViewMode("grid")}><FaTh /></button>
              <button className={`ejl-view-btn ${viewMode === "list" ? "active" : "inactive"}`} onClick={() => setViewMode("list")}><FaList /></button>
            </div>
          </motion.div>

          {/* ── Search + Filters ── */}
          <motion.div
            variants={itemVariants}
            className="ejl-search-filters"
            style={{
              marginBottom: 18,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "8px 10px",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                gap: 8,
              }}
            >
              <FaTh style={{ color: "#94a3b8", fontSize: 14, flexShrink: 0 }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                placeholder="Search by job ID, title, city or country…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13.5,
                  color: "#0f172a",
                  fontFamily: "'DM Sans',sans-serif",
                  minWidth: 0,
                }}
              />
              <button
                type="button"
                className="ejl-add-btn"
                style={{ padding: "7px 12px", boxShadow: "none", flexShrink: 0 }}
                onClick={runSearch}
              >
                Search
              </button>
            </div>
            {/* Mobile-friendly filter row below search */}
            <div className="ejl-filter-row">
              <select
                className="ejl-filter-input"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All statuses</option>
                <option value="open">Active only</option>
                <option value="closed">Closed only</option>
              </select>
              <input
                type="text"
                className="ejl-filter-input"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                placeholder="Filter by location…"
              />
            </div>
          </motion.div>

          {/* ── Job grid / list ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", gap: 14 }}>
              <div className="ejl-spinner" />
              <p style={{ color: "#64748b", fontSize: 13.5, margin: 0 }}>Loading your jobs…</p>
            </div>
          ) : jobs.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div
                variants={containerVariants}
                className="ejl-jobs-grid"
              >
                <AnimatePresence>
                  {jobs.map((job, index) => (
                    <motion.div key={job._id} custom={index} variants={cardVariants} initial="hidden" animate="visible" exit="exit" style={{ height: "100%" }}>
                      <JobCard job={job} handleEdit={handleEdit} handleStatus={handleStatus} handleDelete={handleDelete} handleView={handleView} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e8edf5",
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                    <DataTable
                      columns={columns}
                      data={jobs}
                      selectable={false}
                      showActions={true}
                      compact={false}
                      showSno={true}
                      responsiveCards
                      onView={handleView}
                      onEdit={handleEdit}
                      onBlock={handleStatus}
                      onDelete={handleDelete}
                      blockLabel={<AlertTriangle size={14} />}
                      currentPage={safePage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={JOBS_PER_PAGE}
                    />
                </div>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", gap: 10 }}
            >
              <Briefcase size={42} style={{ color: "#c7d2fe", marginBottom: 4 }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: 0 }}>No jobs posted yet</h2>
              <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Create your first listing to start receiving applicants</p>
              <button className="ejl-add-btn" style={{ marginTop: 8 }} onClick={() => navigate("/employer/create_job")}>
                <Plus size={13} /> Post a Job
              </button>
            </motion.div>
          )}

          {/* ── Pagination (grid view) ── */}
          {!loading && totalCount > JOBS_PER_PAGE && viewMode === "grid" && (
            <motion.div variants={itemVariants} style={{ marginTop: 22 }}>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* ── Delete dialog ── */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent style={{ borderRadius: 18, border: "1.5px solid #fecaca", padding: 0, overflow: "hidden", maxWidth: 420, fontFamily: "'DM Sans',sans-serif" }}>
              <div style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)", padding: "20px 24px" }}>
                <DialogTitle style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={17} /> Confirm Deletion
                </DialogTitle>
              </div>
              <div style={{ padding: "22px 24px" }}>
                {selectedJob && (
                  <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>{selectedJob.jobTitle}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{selectedJob.city}, {selectedJob.country}</p>
                  </div>
                )}
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 22px" }}>
                  This will permanently remove the job listing and all associated data.{" "}
                  <strong style={{ color: "#dc2626" }}>This action cannot be undone.</strong>
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="ejl-del-btn ejl-del-cancel" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                  <button className="ejl-del-btn ejl-del-confirm" onClick={handleDeleteDecision}>Delete Job</button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── Status dialog ── */}
      <AnimatePresence>
        {isStatusDialogOpen && (
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogContent style={{ borderRadius: 18, border: "1.5px solid #e2e8f0", padding: 0, overflow: "hidden", maxWidth: 420, fontFamily: "'DM Sans',sans-serif" }}>
              <div style={{ background: statusJob?.status === "open" ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#10b981,#059669)", padding: "20px 24px" }}>
                <DialogTitle style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={17} /> Confirm Status Change
                </DialogTitle>
              </div>
              <div style={{ padding: "22px 24px" }}>
                {statusJob && (
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>{statusJob.jobTitle}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{statusJob.city}, {statusJob.country}</p>
                  </div>
                )}
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 22px" }}>
                  Are you sure you want to {statusJob?.status === "open" ? "close" : "reopen"} this job listing?
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="ejl-del-btn ejl-del-cancel" onClick={() => setIsStatusDialogOpen(false)}>Cancel</button>
                  <button
                    className="ejl-del-btn"
                    style={{ background: statusJob?.status === "open" ? "linear-gradient(135deg,#d97706,#b45309)" : "linear-gradient(135deg,#059669,#047857)", color: "#fff" }}
                    onClick={handleStatusDecision}
                  >
                    Yes, {statusJob?.status === "open" ? "Close Job" : "Reopen Job"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── View job sheet ── */}
      <Sheet open={!!viewingJob} onOpenChange={(open) => { if (!open) setViewingJob(null); }}>
        <SheetContent className="sm:max-w-md" style={{ overflowY: "auto" }}>
          {viewingJob && (
            <>
              <SheetHeader>
                <SheetTitle style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18 }}>
                  {viewingJob.jobTitle}
                </SheetTitle>
                {viewingJob.jobCode && (
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#4f46e5", margin: "4px 0 0", fontFamily: "ui-monospace, monospace" }}>
                    {viewingJob.jobCode}
                  </p>
                )}
              </SheetHeader>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
                  <MapPin size={14} color="#6366f1" />
                  {viewingJob.city}, {viewingJob.state}, {viewingJob.country}
                </div>
                <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                  Salary: {formatSalary(viewingJob)}
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  Experience: {formatExperience(viewingJob) || "—"}
                  {isFresherJob(viewingJob) ? " · Fresher" : ""}
                </div>
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                    background: viewingJob.status === "open" ? "#f0fdf4" : "#f1f5f9",
                    color: viewingJob.status === "open" ? "#16a34a" : "#64748b",
                  }}>
                    {viewingJob.status === "open" ? "Active" : "Closed"}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 6px" }}>Description</p>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{viewingJob.description}</p>
                </div>
                {viewingJob.requirements?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 6px" }}>Requirements</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#475569" }}>
                      {viewingJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <button
                    className="ejl-add-btn"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => navigate(`/employer/applicants/${viewingJob._id}`)}
                  >
                    <Users size={14} /> View Applicants ({viewingJob.applicantsCount || 0})
                  </button>
                  <button
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff",
                      fontSize: 13, fontWeight: 600, color: "#4f46e5", cursor: "pointer",
                    }}
                    onClick={() => window.open(`/job-details/${viewingJob._id}`, "_blank")}
                  >
                    <ExternalLink size={14} /> Preview Public Page
                  </button>
                  <button
                    className="ejc-action-btn"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => { setViewingJob(null); handleEdit(viewingJob); }}
                  >
                    <Pencil size={14} /> Edit Job
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Edit job sheet ── */}
      <Sheet open={!!editingJob} onOpenChange={(open) => { if (!open) setEditingJob(null); }}>
        <SheetContent className="sm:max-w-none" style={{ width: "95vw", maxWidth: "900px", padding: 0, overflowY: "auto", background: "#f1f5f9" }} side="right">
          {editingJob && (
            <CreateJobForm selectedData={editingJob} page="update" onClose={() => setEditingJob(null)} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default JobList;