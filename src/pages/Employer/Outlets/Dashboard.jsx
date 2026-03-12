import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Briefcase, Users, CheckCircle2, CloudAlert,
  ChevronDown, Plus, LayoutList, TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { useSelector } from "react-redux";
import { employerAnalyticsData } from "@/apiServices/employerApi";
import { toast } from "sonner";
import moment from "moment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ─── Inject styles once ─── */
if (!document.getElementById("edb-styles")) {
  const s = document.createElement("style");
  s.id = "edb-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .edb-root { font-family:'DM Sans',sans-serif; }
    .edb-root h1,.edb-root h2,.edb-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    /* Chart card */
    .edb-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:18px;
      overflow:hidden; transition:box-shadow .2s,border-color .2s;
    }
    .edb-card:hover { box-shadow:0 8px 28px rgba(79,70,229,.07); border-color:#c7d2fe; }
    .edb-card-header { padding:20px 24px 0; }
    .edb-card-body   { padding:20px 24px 24px; }

    /* Chart title */
    .edb-chart-title { font-size:15px; font-weight:700; color:#0f172a; margin:0 0 3px; }
    .edb-chart-sub   { font-size:12.5px; color:#94a3b8; margin:0 0 16px; }

    /* Table status badges */
    .edb-badge {
      display:inline-flex; align-items:center; gap:4px;
      padding:3px 9px; border-radius:999px;
      font-size:11px; font-weight:700;
      font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap;
    }

    /* CTA buttons */
    .edb-btn-primary {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 18px; border-radius:10px; border:none; cursor:pointer;
      font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff;
      box-shadow:0 4px 12px rgba(99,102,241,.3); transition:all .18s;
      text-decoration:none;
    }
    .edb-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(99,102,241,.38); }
    .edb-btn-outline {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 18px; border-radius:10px; border:1.5px solid #e2e8f0;
      background:#fff; color:#475569; cursor:pointer;
      font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .18s; text-decoration:none;
    }
    .edb-btn-outline:hover { border-color:#c7d2fe; color:#4f46e5; background:#f5f3ff; }

    /* Custom chart tooltip */
    .edb-tooltip {
      background:#1e293b; border:none; border-radius:10px;
      padding:10px 14px; font-family:'DM Sans',sans-serif;
      box-shadow:0 8px 24px rgba(0,0,0,.18);
    }
    .edb-tooltip-label { font-size:11px; font-weight:700; color:#94a3b8; margin:0 0 6px; letter-spacing:.06em; text-transform:uppercase; }
    .edb-tooltip-row   { display:flex; align-items:center; gap:8px; font-size:12.5px; color:#fff; margin:2px 0; }
    .edb-tooltip-dot   { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

    /* Table wrapper */
    .edb-table-wrap { overflow:auto; border-radius:12px; border:1.5px solid #f1f5f9; }

    /* Legend dots */
    .edb-legend { display:flex; flex-wrap:wrap; gap:14px; margin-top:14px; }
    .edb-legend-item { display:flex; align-items:center; gap:6px; font-size:12px; color:#64748b; font-weight:600; }
    .edb-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  `;
  document.head.appendChild(s);
}

/* ─── Status badge config ─── */
const statusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "shortlisted" || s === "hired") return { bg: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
  if (s === "pending" || s === "review") return { bg: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" };
  if (s === "rejected") return { bg: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
  return { bg: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" };
};

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const colors = { applications: "#6366f1", jobs: "#10b981", shortlist: "#f59e0b" };
  return (
    <div className="edb-tooltip">
      <p className="edb-tooltip-label">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="edb-tooltip-row">
          <div className="edb-tooltip-dot" style={{ background: colors[p.dataKey] || p.stroke }} />
          <span style={{ color: "#94a3b8", marginRight: 4, textTransform: "capitalize" }}>{p.dataKey}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─── Variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .09 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .35, ease: "easeOut" } } };

/* ════════════════════════════════════════════ */
export default function Dashboard() {
  const [overallData, setOverallData] = useState(null);
  const [applicationData, setApplicationData] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const Employer = useSelector((state) => state.employer.employer);

  const fetchData = async () => {
    try {
      const response = await employerAnalyticsData(Employer?.employerId);
      if (response?.data) {
        const data = response.data;
        setOverallData(data.overallData);
        setRecentApplications(data.recentApplications);

        const chartD = data.chartData;
        const dataMap = new Map(chartD.map(item => {
          const key = `${item.year}-${item.month.toString().padStart(2, "0")}`;
          return [key, item];
        }));
        const last12 = Array.from({ length: 12 }, (_, i) => {
          const date = moment().subtract(i, "months");
          const key = date.format("YYYY-MM");
          const label = date.format("MMM");
          return dataMap.has(key)
            ? { ...dataMap.get(key), month: label }
            : { month: label, applications: 0, jobs: 0, shortlist: 0 };
        }).reverse();
        setApplicationData(last12);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    {
      id: "candidate",
      header: "Candidate",
      cell: (row) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{row.name}</span>
      ),
    },
    { id: "position", header: "Position", accessor: "jobTitle", sortable: true },
    {
      id: "date", header: "Date",
      accessor: (row) => moment(row.createdAt).format("MMM D, YYYY"),
      sortable: true,
    },
    {
      id: "status", header: "Status",
      cell: (row) => {
        const st = statusStyle(row.status);
        return (
          <span className="edb-badge" style={{ background: st.bg, color: st.color, border: st.border }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: st.color }} />
            {row.status}
          </span>
        );
      },
      sortable: true,
    },
  ];

  const chartColors = { applications: "#6366f1", jobs: "#10b981", shortlist: "#f59e0b" };

  return (
    <div className="edb-root" style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px 24px 56px" }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">

        {/* ── Page heading ── */}
        <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Employer Dashboard
            </p>
            <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Recruitment Analytics
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/employer/job_list" className="edb-btn-outline">
              <LayoutList size={14} /> View Jobs
            </Link>
            <Link to="/employer/create_job" className="edb-btn-primary">
              <Plus size={14} /> Post a Job
            </Link>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard
            icon={<Briefcase size={20} color="#fff" />}
            label="Total Applications"
            value={overallData?.totalApplications ?? "0"}
            gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
            shadow="0 8px 24px rgba(99,102,241,.35)"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#fff" />}
            label="Active Jobs"
            value={overallData?.totalJobs ?? "0"}
            gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
            shadow="0 8px 24px rgba(16,185,129,.32)"
          />
          <StatCard
            icon={<Users size={20} color="#fff" />}
            label="Hiring Rate"
            value={overallData?.totalApplication ? `${overallData.totalApplication}%` : "0%"}
            gradient="linear-gradient(135deg,#b45309 0%,#f59e0b 55%,#fbbf24 100%)"
            shadow="0 8px 24px rgba(217,119,6,.28)"
          />
          <StatCard
            icon={<TrendingUp size={20} color="#fff" />}
            label="Shortlisted"
            value={overallData?.totalShortlisted ?? "—"}
            gradient="linear-gradient(135deg,#7c3aed 0%,#8b5cf6 55%,#a78bfa 100%)"
            shadow="0 8px 24px rgba(139,92,246,.3)"
          />
        </motion.div>

        {/* ── Chart ── */}
        <motion.div variants={itemVariants} className="edb-card" style={{ marginBottom: 24 }}>
          <div className="edb-card-header">
            <p className="edb-chart-title">Application Trends</p>
            <p className="edb-chart-sub">Monthly breakdown of applications, job posts, and shortlists over the past 12 months</p>
          </div>
          <div className="edb-card-body">
            {!applicationData || applicationData.length < 1 ? (
              <div style={{ height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#94a3b8" }}>
                <CloudAlert size={48} style={{ color: "#c7d2fe" }} />
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={applicationData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11.5, fill: "#94a3b8", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11.5, fill: "#94a3b8", fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="applications" stroke={chartColors.applications} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: chartColors.applications, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="jobs" stroke={chartColors.jobs} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: chartColors.jobs, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="shortlist" stroke={chartColors.shortlist} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: chartColors.shortlist, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Custom legend */}
                <div className="edb-legend">
                  {Object.entries(chartColors).map(([key, color]) => (
                    <div key={key} className="edb-legend-item">
                      <div className="edb-legend-dot" style={{ background: color }} />
                      <span style={{ textTransform: "capitalize" }}>{key}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Recent Applications table ── */}
        <motion.div variants={itemVariants} className="edb-card">
          <div className="edb-card-header" style={{ paddingBottom: 16, borderBottom: "1.5px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p className="edb-chart-title">Recent Applications</p>
                <p className="edb-chart-sub" style={{ marginBottom: 0 }}>Latest candidate applications across all your job listings</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 12px", borderRadius: 999, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {recentApplications.length} total
              </span>
            </div>
          </div>
          <div className="edb-card-body" style={{ paddingTop: 16 }}>
            <div className="edb-table-wrap">
              <DataTable
                columns={columns}
                data={recentApplications}
                selectable={false}
                showActions={true}
                compact={false}
                showSno={true}
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
                onViewDetails={() => { }}
                onOthers={() => { }}
              />
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}