import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useRequestUser from "@/hooks/useRequestUser";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Briefcase, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

/* ─── Styles ─── */
const styleTag = document.getElementById("jah-styles");
if (!styleTag) {
  const s = document.createElement("style");
  s.id = "jah-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .jah-root { font-family: 'DM Sans', sans-serif; }
    .jah-root h1, .jah-root h2, .jah-root h3 { font-family: 'Plus Jakarta Sans', sans-serif; }

    .jah-tab-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px !important;
      border-radius: 9px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      cursor: pointer;
      transition: all 0.18s ease !important;
      color: #64748b !important;
      background: transparent !important;
      border: none !important;
    }
    .jah-tab-trigger[data-state="active"] {
      background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
      color: #fff !important;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
    }
    .jah-tab-trigger:hover:not([data-state="active"]) {
      background: #f1f5f9 !important;
      color: #4f46e5 !important;
    }

    .jah-card {
      background: #fff;
      border: 1.5px solid #e8edf5;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .jah-card:hover {
      box-shadow: 0 8px 32px rgba(79,70,229,0.09);
      transform: translateY(-2px);
      border-color: #c7d2fe;
    }
    .jah-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      border-radius: 3px 0 0 3px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .jah-card:hover::before { opacity: 1; }
    .jah-card.status-shortlisted::before { background: #22c55e; }
    .jah-card.status-pending::before { background: #f59e0b; }
    .jah-card.status-rejected::before { background: #ef4444; }
    .jah-card.status-closed::before { background: #94a3b8; }

    .jah-logo {
      border-radius: 12px;
      object-fit: cover;
      flex-shrink: 0;
      border: 1.5px solid #e8edf5;
      background: #f8fafc;
    }
    .jah-logo-fallback {
      border-radius: 12px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #fff;
      font-size: 18px;
    }

    .jah-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .jah-meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;
    }

    .jah-spinner {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 3px solid #e0e7ff;
      border-top-color: #6366f1;
      animation: jah-spin 0.75s linear infinite;
    }
    @keyframes jah-spin { to { transform: rotate(360deg); } }

    /* ─── Responsive tweaks ─── */
    @media (max-width: 640px) {
      .jah-card {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
      }
      .jah-logo-fallback {
        width: 46px;
        height: 46px;
        margin-bottom: 4px;
      }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Avatar gradients ─── */
const gradients = [
  "linear-gradient(135deg,#6366f1,#818cf8)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#ec4899,#f472b6)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
];
const getGradient = (name = "J") => {
  const idx = (name.charCodeAt(0) - 65) % gradients.length;
  return gradients[Math.max(0, idx)];
};

/* ─── Status config ─── */
const statusConfig = {
  Shortlisted: { label: "Shortlisted", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", icon: <CheckCircle2 size={12} /> },
  Pending: { label: "In Review", bg: "#fffbeb", color: "#d97706", border: "#fde68a", icon: <Loader2 size={12} /> },
  Rejected: { label: "Rejected", bg: "#fef2f2", color: "#dc2626", border: "#fecaca", icon: <XCircle size={12} /> },
};

/* ─── Animation variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/* ─── Tabs config ─── */
const TABS = [
  { value: "recent", label: "All Applications", count: null },
  { value: "Shortlisted", label: "Shortlisted", count: null },
  { value: "in-progress", label: "In Progress", count: null },
  { value: "rejected", label: "Rejected", count: null },
];

/* ═══════════════════════════════════════════
   Main Component
═══════════════════════════════════════════ */
export default function JobApplicationHistory() {
  const { loading, sendRequest } = useRequestUser();
  const userData = useSelector((state) => state.user.seekerInfo);
  const [allJobs, setAllJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("recent");

  // Pagination and count states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown date";
    return format(new Date(isoDate), "d MMM yyyy, h:mm a");
  };

  const handleTab = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // Map tabs to backend statuses
  const getStatusFromTab = (tab) => {
    const map = {
      recent: "all",
      Shortlisted: "Shortlisted",
      "in-progress": "Pending",
      rejected: "Rejected",
    };
    return map[tab] || "all";
  };

  useEffect(() => {
    if (userData) {
      const statusParam = getStatusFromTab(activeTab);
      sendRequest({
        url: `/job-applications/${userData.userId}?page=${currentPage}&limit=6&status=${statusParam}`,
        method: "GET",
        onSuccess: (data) => {
          setAllJobs(data.allApplicationsOfAUser);
          setTotalPages(data.totalPages || 1);
          setTotalApplications(data.totalApplications || 0);
        },
        onError: (err) => console.error("Error fetching job applications:", err),
      });
    } else {
      toast.error("User data not found.");
    }
  }, [userData, activeTab, currentPage]);

  const statusClass = (job) => {
    if (job.jobStatus !== "open") return "status-closed";
    const map = { Shortlisted: "status-shortlisted", Pending: "status-pending", Rejected: "status-rejected" };
    return map[job.applicationStatus] || "";
  };

  return (
    <div className="jah-root" style={{ background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ── Header Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          padding: "110px 24px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(99,102,241,0.2)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -20, left: "40%", width: 120, height: 120, borderRadius: "50%", background: "rgba(167,139,250,0.15)", filter: "blur(30px)" }} />
        <div style={{ maxWidth: 1260, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Your career journey
            </p>
            <h1 style={{ color: "#fff", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              My Applications
            </h1>
            <p style={{ color: "#c7d2fe", fontSize: 13.5, marginTop: 6, fontWeight: 400 }}>
              {totalApplications} application{totalApplications !== 1 ? "s" : ""} tracked
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div style={{ maxWidth: 1260, margin: "-32px auto 48px", padding: "0 16px", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
            border: "1.5px solid #e8edf5",
            overflow: "hidden",
          }}
        >
          {/* Tab Bar */}
          <div
            style={{
              padding: "18px 20px 0",
              borderBottom: "1.5px solid #f1f5f9",
              background: "#fafbff",
            }}
          >
            <Tabs defaultValue="recent" onValueChange={handleTab}>
              <TabsList
                style={{
                  display: "flex",
                  gap: 4,
                  background: "#f1f5f9",
                  borderRadius: 12,
                  padding: 4,
                  width: "100%",
                  marginBottom: 18,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {TABS.map(({ value, label }) => (
                  <TabsTrigger key={value} value={value} className="jah-tab-trigger">
                    {label}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 20,
                        height: 18,
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "0 5px",
                        background: activeTab === value ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                        color: activeTab === value ? "#fff" : "#64748b",
                      }}
                    >
                      {activeTab === value ? totalApplications : "-"}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div style={{ padding: "20px" }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 14 }}>
                <div className="jah-spinner" />
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Loading your applications…</p>
              </div>
            ) : allJobs.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {allJobs.map((job, index) => {
                    const status = statusConfig[job.applicationStatus];
                    const initial = job?.companyName?.charAt(0) || "J";
                    const isOpen = job.jobStatus === "open";

                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`jah-card ${statusClass(job)}`}
                      >
                        {/* Logo / Avatar: first letter of shop */}
                        <div
                          className="jah-logo-fallback"
                          style={{
                            width: 52,
                            height: 52,
                            background: getGradient(initial),
                            boxShadow: "0 4px 12px rgba(99,102,241,0.18)",
                          }}
                        >
                          {initial}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Title row */}
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <div>
                              <h3
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  margin: 0,
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {job?.jobTitle}
                              </h3>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "#6366f1",
                                  margin: "2px 0 0",
                                  letterSpacing: "0.04em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {job?.companyName}
                              </p>
                            </div>

                            {/* Status badge */}
                            {isOpen && status ? (
                              <span
                                className="jah-status-badge"
                                style={{
                                  background: status.bg,
                                  color: status.color,
                                  border: `1px solid ${status.border}`,
                                  flexShrink: 0,
                                }}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            ) : !isOpen ? (
                              <span
                                className="jah-status-badge"
                                style={{ background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", flexShrink: 0 }}
                              >
                                <AlertCircle size={12} />
                                Closed
                              </span>
                            ) : null}
                          </div>

                          {/* Meta chips */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                            <span className="jah-meta-chip">
                              <MapPin size={12} style={{ color: "#6366f1" }} />
                              {job?.city}, {job?.country}
                            </span>
                            <span className="jah-meta-chip">
                              <Calendar size={12} style={{ color: "#16a34a" }} />
                              Applied {formatDate(job?.appliedAt)}
                            </span>
                            {isOpen && (
                              <span className="jah-meta-chip">
                                <Clock size={12} style={{ color: "#f59e0b" }} />
                                Updated {formatDate(job?.updatedAt)}
                              </span>
                            )}
                            {!isOpen && (
                              <span className="jah-meta-chip" style={{ color: "#94a3b8" }}>
                                <Briefcase size={12} />
                                No longer accepting applications
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ marginTop: 28 }}
                    >
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        prevLabel="← Prev"
                        nextLabel="Next →"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "60px 20px",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 4 }}>📋</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                  No applications yet
                </h3>
                <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0, textAlign: "center" }}>
                  Applications you submit will appear here
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}