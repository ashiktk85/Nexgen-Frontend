import React from "react";
import { MdPlace } from "react-icons/md";
import { formatSalary } from "@/utils/formatSalary";
import { IoBriefcase } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EyeInvisibleOutlined, DeleteOutlined, EyeOutlined, TeamOutlined } from "@ant-design/icons";
import moment from "moment";

/* ─── Inject styles once ─── */
if (!document.getElementById("ejc-styles")) {
  const s = document.createElement("style");
  s.id = "ejc-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .ejc-root { font-family:'DM Sans',sans-serif; }
    .ejc-root h2,.ejc-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    .ejc-card {
      background:#fff;
      border:1.5px solid #e8edf5;
      border-radius:14px;
      transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease;
      overflow:hidden;
      width:100%;
      width:100%;
      min-height:280px;
      height:auto;
      display:flex;
      flex-direction:column;
    }
    .ejc-card:hover {
      box-shadow:0 8px 28px rgba(79,70,229,.09);
      transform:translateY(-2px);
      border-color:#c7d2fe;
    }
    .ejc-accent { height:3px; background:linear-gradient(90deg,#6366f1,#a5b4fc); opacity:0; transition:opacity .2s; }
    .ejc-card:hover .ejc-accent { opacity:1; }

    .ejc-badge {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 9px; border-radius:999px;
      font-size:11.5px; font-weight:600;
      font-family:'Plus Jakarta Sans',sans-serif;
      white-space:nowrap;
    }

    .ejc-action-btn {
      display:inline-flex; align-items:center; gap:5px;
      padding:8px 10px; border-radius:8px; border:1.5px solid #e2e8f0;
      font-size:11.5px; font-weight:600; cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;
      background:#fff; color:#475569;
      transition:all .18s ease; white-space:nowrap;
      flex:1 1 calc(50% - 4px);
      justify-content:center;
      min-width:0;
    }
    @media (min-width:480px) {
      .ejc-action-btn { flex:0 1 auto; padding:6px 12px; font-size:12px; }
    }
    .ejc-action-btn:hover { background:#f8fafc; border-color:#c7d2fe; color:#4f46e5; }
    .ejc-action-btn.danger:hover { background:#fef2f2; border-color:#fecaca; color:#ef4444; }
    .ejc-action-btn.primary { background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; border-color:transparent; box-shadow:0 3px 8px rgba(99,102,241,.25); }
    .ejc-action-btn.primary:hover { opacity:.9; transform:translateY(-1px); }

    .ejc-meta { display:inline-flex; align-items:center; gap:5px; font-size:12px; color:#64748b; white-space:nowrap; }

    .ejc-card-body {
      flex:1;
      display:flex;
      flex-direction:column;
      min-height:0;
      padding:16px 18px;
    }
    @media (min-width:640px) {
      .ejc-card-body { padding:22px 24px; }
    }
    .ejc-card-header { flex-shrink:0; margin-bottom:12px; }
    .ejc-card-meta {
      flex-shrink:0;
      display:flex;
      flex-direction:column;
      gap:6px;
    }
    .ejc-meta-row {
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:6px;
      min-height:18px;
    }
    .ejc-card-spacer { flex:1; min-height:12px; }
    .ejc-card-bottom { flex-shrink:0; }
    .ejc-card-applicants { width:100%; margin-bottom:12px; }
    .ejc-title {
      font-size:14.5px;
      font-weight:700;
      color:#0f172a;
      margin:0;
      letter-spacing:-0.01em;
      line-height:1.35;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-height:2.7em;
    }
  `;
  document.head.appendChild(s);
}

/* ─── Avatar gradient ─── */
const getGrad = (ch = "A") => {
  const gs = ["linear-gradient(135deg,#6366f1,#818cf8)","linear-gradient(135deg,#0ea5e9,#38bdf8)","linear-gradient(135deg,#f59e0b,#fbbf24)","linear-gradient(135deg,#10b981,#34d399)","linear-gradient(135deg,#ec4899,#f472b6)"];
  return gs[((ch.toUpperCase().charCodeAt(0)-65)%gs.length+gs.length)%gs.length];
};

const JobCard = ({ job, handleEdit, handleDelete, handleStatus, handleView }) => {
  const navigate = useNavigate();
  const initial = job.jobTitle?.charAt(0) || "J";
  const isOpen = job?.status === "open";

  return (
    <article className="ejc-root ejc-card" aria-label="Job listing card">
      <div className="ejc-accent" />
      <div className="ejc-card-body">

        {/* ── Top Row ── */}
        <div className="ejc-card-header" style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          {/* Avatar */}
          <div style={{
            width:42, height:42, borderRadius:11, flexShrink:0,
            background:getGrad(initial), display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:17, fontWeight:800,
            color:"#fff", fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:"0 3px 10px rgba(99,102,241,.2)"
          }}>
            {initial}
          </div>

          {/* Title + date */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
              <h2 className="ejc-title" title={job.jobTitle}>
                {job.jobTitle}
              </h2>
              {/* Status pill */}
              <span className="ejc-badge" style={{ ...isOpen
                ? { background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" }
                : { background:"#f8fafc", color:"#94a3b8", border:"1px solid #e2e8f0" },
                flexShrink:0
              }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background: isOpen ? "#22c55e" : "#94a3b8" }} />
                {isOpen ? "Active" : "Closed"}
              </span>
            </div>
            <p style={{ fontSize:11.5, color:"#94a3b8", margin:"3px 0 0", fontWeight:500 }}>
              Posted {moment(job?.createdAt).format("MMM D, YYYY")}
            </p>
          </div>
        </div>

        {/* ── Meta chips ── */}
        <div className="ejc-card-meta">
          <div className="ejc-meta-row">
            <span className="ejc-meta"><IoBriefcase style={{ color:"#6366f1", fontSize:12 }} />{job.experienceRequired[0]}–{job.experienceRequired[job.experienceRequired.length-1]} yrs</span>
            <span style={{ color:"#e2e8f0" }}>·</span>
            <span className="ejc-meta"><MdPlace style={{ color:"#ec4899", fontSize:13 }} />{job.city}, {job.country}</span>
          </div>
          <div className="ejc-meta-row">
            <span className="ejc-meta">{formatSalary(job)}</span>
          </div>
        </div>

        <div className="ejc-card-spacer" />

        {/* ── Bottom: applicants + actions ── */}
        <div className="ejc-card-bottom">
          <button
            className="ejc-action-btn primary ejc-card-applicants"
            style={{ fontSize:12, justifyContent:"center" }}
            onClick={() => navigate(`/employer/applicants/${job?._id}`)}
          >
            <TeamOutlined style={{ fontSize:12 }} />
            {job?.applicantsCount ?? 0} Applicant{(job?.applicantsCount ?? 0) !== 1 ? "s" : ""}
          </button>

          <div style={{ height:1, background:"#f1f5f9", margin:"0 0 12px" }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {handleView && (
              <button className="ejc-action-btn" onClick={() => handleView(job)}>
                <EyeOutlined style={{ fontSize:11 }} /> View
              </button>
            )}
            <button className="ejc-action-btn" onClick={() => handleEdit(job)}>
              <EditOutlined style={{ fontSize:11 }} /> Edit
            </button>
            <button className="ejc-action-btn" onClick={() => handleStatus(job)}>
              {isOpen ? <EyeInvisibleOutlined style={{ fontSize:11 }} /> : <EyeOutlined style={{ fontSize:11 }} />}
              {isOpen ? "Close" : "Reopen"}
            </button>
            <button className="ejc-action-btn danger" onClick={() => handleDelete(job)}>
              <DeleteOutlined style={{ fontSize:11 }} /> Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default JobCard;