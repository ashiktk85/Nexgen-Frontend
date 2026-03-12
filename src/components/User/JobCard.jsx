import React from "react";
import { useNavigate } from "react-router-dom";
import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { calculateTimeAgo } from "@/utils/dateFormation";

/* ─── Inline styles injected once ─── */
const styleTag = document.getElementById("jobcard-styles");
if (!styleTag) {
  const s = document.createElement("style");
  s.id = "jobcard-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .jc-root { font-family: 'DM Sans', sans-serif; }
    .jc-root h2 { font-family: 'Plus Jakarta Sans', sans-serif; }

    .jc-card {
      background: #ffffff;
      border: 1.5px solid #e8edf5;
      border-radius: 16px;
      transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
      cursor: default;
      overflow: hidden;
    }
    .jc-card:hover {
      box-shadow: 0 12px 40px rgba(79,70,229,0.1);
      transform: translateY(-3px);
      border-color: #c7d2fe;
    }

    .jc-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #fff;
      border-radius: 12px;
      flex-shrink: 0;
      user-select: none;
    }

    .jc-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 4px 9px;
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }

    .jc-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 8px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s ease;
      border: 1.5px solid transparent;
      font-family: 'Plus Jakarta Sans', sans-serif;
      white-space: nowrap;
    }
    .jc-btn-apply {
      background: linear-gradient(135deg, #16a34a, #22c55e);
      color: #fff;
      box-shadow: 0 3px 10px rgba(34,197,94,0.28);
    }
    .jc-btn-apply:hover {
      background: #fff;
      color: #16a34a;
      border-color: #22c55e;
      box-shadow: none;
    }
    .jc-btn-applied {
      background: #f1f5f9;
      color: #94a3b8;
      cursor: not-allowed;
      border-color: #e2e8f0;
    }

    /* List layout specific */
    .jc-list-layout {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      flex: 1;
    }
    .jc-grid-layout {
      display: flex;
      flex-direction: column;
      padding: 24px 24px 28px;
      flex: 1;
    }

    /* Accent top bar */
    .jc-accent-bar {
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #a5b4fc);
      opacity: 0;
      transition: opacity 0.22s;
    }
    .jc-card:hover .jc-accent-bar { opacity: 1; }
  `;
  document.head.appendChild(s);
}

/* ─── Avatar color palette based on first letter ─── */
const avatarGradients = [
  "linear-gradient(135deg, #6366f1, #818cf8)",
  "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  "linear-gradient(135deg, #f59e0b, #fbbf24)",
  "linear-gradient(135deg, #10b981, #34d399)",
  "linear-gradient(135deg, #ec4899, #f472b6)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #ef4444, #f87171)",
  "linear-gradient(135deg, #14b8a6, #2dd4bf)",
];
const getAvatarGradient = (letter = "J") => {
  const idx = (letter.toUpperCase().charCodeAt(0) - 65) % avatarGradients.length;
  return avatarGradients[Math.max(0, idx)];
};

/* ═══════════════════════════════════════════
   JobCard
═══════════════════════════════════════════ */
const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();
  const isList = layout === "list";
  // First letter of shop/company for avatar (like job cards)
  const initial = (job.companyName || job.jobTitle)?.charAt(0)?.toUpperCase() || "J";

  const jobDetailNavigation = () => navigate(`/job-details/${job._id}`);
  const handleApplyJob = () =>
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
      },
    });

  return (
    <article className="jc-root jc-card" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }} aria-label="Job listing card">
      {/* Animated accent bar */}
      <div className="jc-accent-bar" style={{ flexShrink: 0 }} />

      <div className={isList ? "jc-list-layout" : "jc-grid-layout"} >

        {/* ── Avatar ── */}
        <div
          className="jc-avatar"
          style={{
            width: isList ? 52 : 48,
            height: isList ? 52 : 48,
            fontSize: isList ? 20 : 18,
            background: getAvatarGradient(initial),
            marginBottom: isList ? 0 : 14,
            boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
          }}
        >
          {initial}
        </div>

        {/* ── Main Info ── */}
        <div style={{ flex: 1, minWidth: 0, marginBottom: isList ? 0 : 14 }}>
          {/* Title + company */}
          <div style={{ marginBottom: 8 }}>
            <h2
              style={{
                fontSize: isList ? 15 : 16,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.jobTitle}
            </h2>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6366f1",
                margin: "3px 0 0",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {job.companyName}
            </p>
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <span className="jc-badge">
              <MdPlace style={{ color: "#6366f1", fontSize: 13 }} />
              {job.city}, {job.country}
            </span>
            <span className="jc-badge">
              <FaIndianRupeeSign style={{ color: "#16a34a", fontSize: 11 }} />
              {job.salaryRange?.join(" – ")}
            </span>
            <span className="jc-badge">
              <IoBriefcase style={{ color: "#f59e0b", fontSize: 12 }} />
              {job.experienceRequired[0]}–{job.experienceRequired[job.experienceRequired.length - 1]} yrs
            </span>
          </div>
        </div>

        {/* ── Footer: time + buttons ── */}
        <div
          style={{
            display: "flex",
            flexDirection: isList ? "column" : "row",
            alignItems: isList ? "flex-end" : "center",
            justifyContent: isList ? "center" : "space-between",
            gap: 12,
            marginTop: isList ? 0 : 16,
            flexShrink: 0,
          }}
        >
          {/* Time ago pill */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#94a3b8",
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderRadius: 6,
              padding: "3px 8px",
              whiteSpace: "nowrap",
              alignSelf: isList ? "flex-end" : "auto",
            }}
          >
            🕐 {calculateTimeAgo(job.createdAt)}
          </span>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 7,
              flexDirection: isList ? "column" : "row",
              width: isList ? "100%" : "auto",
            }}
          >
            <button
              className={`jc-btn ${job.alreadyApplied ? "jc-btn-applied" : "jc-btn-apply"}`}
              disabled={job.alreadyApplied}
              aria-label={job.alreadyApplied ? "Already applied" : "Apply to job"}
              onClick={!job.alreadyApplied ? handleApplyJob : undefined}
              style={{ flex: isList ? 1 : "none" }}
            >
              {job.alreadyApplied ? "✓ Applied" : "Apply Now"}
            </button>

            <button
              className={
                "jc-btn jc-btn-details " +
                "bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 " +
                "text-white border border-indigo-900/60 shadow-md " +
                "hover:bg-gradient-to-r hover:from-indigo-600 hover:via-indigo-500 hover:to-indigo-400 " +
                "hover:shadow-lg hover:-translate-y-0.5 " +
                "transition-all duration-150"
              }
              aria-label="View job details"
              onClick={jobDetailNavigation}
              style={{ flex: isList ? 1 : "none" }}
            >
              Details →
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};

export default JobCard;