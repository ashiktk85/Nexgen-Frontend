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
import { Plus, Briefcase, AlertTriangle, TrendingUp, CheckCircle2, XCircle, Users, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CreateJobForm from "@/components/Employer/CreateJobForm";



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
const getStats = (jobs) => [
  {
    label: "Total Jobs",
    value: jobs.length,
    icon: <TrendingUp size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)",
    shadow: "0 8px 24px rgba(99,102,241,.35)",
  },
  {
    label: "Active",
    value: jobs.filter(j => j.status === "open").length,
    icon: <CheckCircle2 size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)",
    shadow: "0 8px 24px rgba(16,185,129,.32)",
  },
  {
    label: "Closed",
    value: jobs.filter(j => j.status !== "open").length,
    icon: <XCircle size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#38bdf8 100%)",
    shadow: "0 8px 24px rgba(14,165,233,.3)",
  },
  {
    label: "Total Applicants",
    value: jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0),
    icon: <Users size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#b45309 0%,#f59e0b 55%,#fbbf24 100%)",
    shadow: "0 8px 24px rgba(217,119,6,.28)",
  },
];

/* ════════════════════════════════════════════ */
function JobList() {
  const employer = useSelector((state) => state.employer.employer);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusJob, setStatusJob] = useState(null);
  const navigate = useNavigate();

  const [editingJob, setEditingJob] = useState(null);

  const handleEdit = (job) => job && setEditingJob(job);
  const handleDelete = (job) => { if (job) { setSelectedJob(job); setIsDialogOpen(true); } };

  const handleStatus = (job) => {
    if (job) { setStatusJob(job); setIsStatusDialogOpen(true); }
  };

  const handleStatusDecision = async () => {
    if (!statusJob) return;
    try {
      const data = { status: statusJob?.status === "open" ? "close" : "open" };
      const res = await employerJobStatusChange(statusJob._id, data);
      if (res) {
        setJobs((prev) => prev.map((j) => (j._id === res.data.updatedJob._id ? res.data.updatedJob : j)));
        toast.success(`Job ${data.status === "open" ? "reopened" : "closed"}.`);
      } else toast.error("Error updating status");
    } catch (err) { toast.error(err.response?.data?.message || "Unexpected error"); }
    finally { setIsStatusDialogOpen(false); setStatusJob(null); }
  };

  const handleDeleteDecision = async () => {
    if (!selectedJob) return;
    try {
      const res = await employerJobDelete(selectedJob._id, employer?.employerId);
      if (res) { setJobs((prev) => prev.filter((j) => j._id !== selectedJob._id)); toast.success("Job deleted."); }
      else toast.error("Error deleting job");
    } catch (err) { toast.error(err.response?.data?.message || "Unexpected error"); }
    finally { setIsDialogOpen(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await employerAxiosInstance.get(`/job-list/${employer?.employerId}`);
        setJobs(res.data.jobPosts);
        setCurrentPage(1);
      } catch (err) { toast.warning(err?.response?.data?.message || "An error occurred"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [employer?.employerId]);

  const columns = [
    {
      id: "jobTitle",
      header: "Job Title",
      cell: (row) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{row.jobTitle}</span>
      ),
      sortable: true,
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
      cell: (row) => <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>₹{row.salaryRange?.join(" - ")}</span>
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
      sortable: true,
      accessor: "status",
    },
  ];

  // ─── Search & Pagination helpers ───
  const JOBS_PER_PAGE = 6;

  const filteredJobs = jobs.filter((job) => {
    // text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (
        !(
          job.jobTitle?.toLowerCase().includes(term) ||
          job.city?.toLowerCase().includes(term) ||
          job.country?.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
    }

    // status filter
    if (statusFilter === "open" && job.status !== "open") return false;
    if (statusFilter === "closed" && job.status === "open") return false;

    // location filter (separate from main search)
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase();
      if (
        !(
          job.city?.toLowerCase().includes(loc) ||
          job.country?.toLowerCase().includes(loc)
        )
      ) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIdx, startIdx + JOBS_PER_PAGE);

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
            <button className="ejl-add-btn" onClick={() => navigate("/employer/create_job")}>
              <Plus size={14} /> Post New Job
            </button>
          </motion.div>

          {/* ── Gradient stat cards ── */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {getStats(jobs).map(({ label, value, icon, gradient, shadow }) => (
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
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#94a3b8", marginLeft: 7 }}>({filteredJobs.length})</span>
            </h2>
            <div
              style={{
                display: "flex",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                overflow: "hidden",
                marginLeft: "auto",
              }}
            >
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
                minWidth: 220,
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "12px 10px",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              }}
            >
              <FaTh style={{ color: "#94a3b8", fontSize: 14, marginRight: 8 }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search by title, city or country…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13.5,
                  color: "#0f172a",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              />
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
                onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
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
          ) : filteredJobs.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div
                variants={containerVariants}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: 14,
                }}
              >
                <AnimatePresence>
                  {paginatedJobs.map((job, index) => (
                    <motion.div key={job._id} custom={index} variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                      <JobCard job={job} layout={viewMode} handleEdit={handleEdit} handleStatus={handleStatus} handleDelete={handleDelete} />
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
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <div style={{ minWidth: 640 }}>
                    <DataTable
                      columns={columns}
                      data={filteredJobs}
                      selectable={false}
                      showActions={true}
                      compact={false}
                      showSno={true}
                      onEdit={handleEdit}
                      onBlock={handleStatus}
                      onDelete={handleDelete}
                      blockLabel={<AlertTriangle size={14} />}
                    />
                  </div>
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

          {/* ── Pagination (grid view only) ── */}
          {!loading && filteredJobs.length > JOBS_PER_PAGE && viewMode === "grid" && (
            <motion.div
              variants={itemVariants}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                marginTop: 22,
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1.5px solid #e2e8f0",
                  background: safePage === 1 ? "#f8fafc" : "#fff",
                  color: safePage === 1 ? "#cbd5e1" : "#4f46e5",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: safePage === 1 ? "not-allowed" : "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                const isActive = page === safePage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: isActive ? "none" : "1.5px solid #e2e8f0",
                      background: isActive ? "linear-gradient(135deg,#4f46e5,#6366f1)" : "#fff",
                      color: isActive ? "#fff" : "#475569",
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      boxShadow: isActive ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1.5px solid #e2e8f0",
                  background: safePage === totalPages ? "#f8fafc" : "#fff",
                  color: safePage === totalPages ? "#cbd5e1" : "#4f46e5",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: safePage === totalPages ? "not-allowed" : "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                Next
              </button>
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