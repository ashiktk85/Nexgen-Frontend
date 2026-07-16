import React from "react";
import { useNavigate } from "react-router-dom";
import { MdPlace } from "react-icons/md";
import { IoBriefcase } from "react-icons/io5";
import { calculateTimeAgo } from "@/utils/dateFormation";
import { CATEGORY_COLORS, getJobCategory } from "@/constants/options";
import { formatSalary } from "@/utils/formatSalary";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";
import { formatJobLocation } from "@/utils/formatLocation";
import JobShareButton from "@/components/common/JobShareButton";
import JobWhatsAppButton from "@/components/common/JobWhatsAppButton";

/* ─── Inline styles injected once ─── */
const injectJobCardStyles = () => {
  const css = `
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
      max-width: 100%;
      white-space: normal;
      word-break: break-word;
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

    .jc-list-layout {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      flex: 1;
      min-width: 0;
    }
    .jc-grid-layout {
      display: flex;
      flex-direction: column;
      padding: 24px 24px 28px;
      flex: 1;
      min-width: 0;
    }

    .jc-grid-footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      margin-top: 16px;
      flex-shrink: 0;
      width: 100%;
      min-width: 0;
    }

    .jc-list-footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      flex-shrink: 0;
      min-width: 0;
      width: 100%;
    }

    @media (min-width: 640px) {
      .jc-list-footer {
        flex-direction: row;
        align-items: flex-end;
        width: 360px;
      }
      .jc-list-footer .jc-btn-apply {
        flex: 1;
      }
    }

    .jc-details-col {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
      flex: 1;
      min-width: 0;
      width: 100%;
    }

    .jc-action-row {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      min-width: 0;
    }

    .jc-btn-details {
      flex: 1;
      min-width: 0;
      padding: 8px 10px !important;
      font-size: 12px !important;
    }

    .jc-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.35;
      letter-spacing: -0.01em;
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
    }
    .jc-title.list { font-size: 15px; }

    .jc-posted-time {
      font-size: 10px;
      font-weight: 500;
      color: #94a3b8;
      white-space: nowrap;
      line-height: 1;
      text-align: right;
    }

    @media (max-width: 639px) {
      .jc-list-layout {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 12px;
        padding: 14px 14px;
      }
      .jc-grid-layout {
        padding: 16px 14px 18px;
      }
    }

    .jc-accent-bar {
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #a5b4fc);
      opacity: 0;
      transition: opacity 0.22s;
    }
    .jc-card:hover .jc-accent-bar { opacity: 1; }
  `;

  let styleTag = document.getElementById("jobcard-styles");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "jobcard-styles";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;
};

injectJobCardStyles();

/* ═══════════════════════════════════════════
   JobCard
═══════════════════════════════════════════ */
const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();
  const isList = layout === "list";
  const category = getJobCategory(job.jobTitle);
  const salaryText = formatSalary(job);
  const locationText = formatJobLocation(job);
  const expText = formatExperience(job);
  const fresher = isFresherJob(job);

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

        {/* ── Main Info ── */}
        <div style={{ flex: 1, minWidth: 0, marginBottom: isList ? 0 : 14 }}>
          {/* Title + share */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className={`jc-title${isList ? " list" : ""}`}>
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
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {job.companyName}
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <JobShareButton job={job} compact iconOnly />
            </div>
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {category && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700"}`}>
                {category}
              </span>
            )}
            {locationText && (
              <span className="jc-badge">
                <MdPlace style={{ color: "#6366f1", fontSize: 13 }} />
                {locationText}
              </span>
            )}
            <span className="jc-badge">
              {salaryText}
            </span>
            {expText && (
              <span className="jc-badge">
                <IoBriefcase style={{ color: "#f59e0b", fontSize: 12 }} />
                {expText}
              </span>
            )}
            {fresher && (
              <span className="jc-badge" style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>
                Fresher
              </span>
            )}
          </div>
        </div>

        {/* ── Footer: Apply + WhatsApp + Details ── */}
        <div className={isList ? "jc-list-footer" : "jc-grid-footer"}>
          <button
            className={`jc-btn ${job.alreadyApplied ? "jc-btn-applied" : "jc-btn-apply"}`}
            disabled={job.alreadyApplied}
            aria-label={job.alreadyApplied ? "Already applied" : "Apply to job"}
            onClick={!job.alreadyApplied ? handleApplyJob : undefined}
            style={{ width: "100%" }}
          >
            {job.alreadyApplied ? "✓ Applied" : "Apply Now"}
          </button>

          <div className="jc-details-col">
            <span className="jc-posted-time">
              Posted {calculateTimeAgo(job.createdAt)}
            </span>
            <div className="jc-action-row">
              <JobWhatsAppButton
                phone={job.phone}
                countryCode={job.countryCode}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                size={34}
              />
              <button
                type="button"
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
              >
                Details →
              </button>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};

export default JobCard;
