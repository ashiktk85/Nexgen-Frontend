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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

    .jc-root { font-family: 'DM Sans', sans-serif; }
    .jc-root h2 { font-family: 'Plus Jakarta Sans', sans-serif; }

    .jc-card {
      background: #ffffff;
      border: 1.5px solid #e8edf5;
      border-radius: 14px;
      transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
      cursor: pointer;
      overflow: visible;
    }
    .jc-card:hover {
      box-shadow: 0 8px 28px rgba(79,70,229,0.1);
      transform: translateY(-2px);
      border-color: #c7d2fe;
    }

    .jc-job-id {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      color: #4f46e5;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin: 0 0 4px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 5px;
      padding: 2px 6px;
      line-height: 1.2;
    }
    .jc-job-id-label {
      font-weight: 600;
      color: #6366f1;
      font-family: 'DM Sans', sans-serif;
    }

    .jc-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 11px;
      color: #475569;
      max-width: 100%;
      white-space: normal;
      word-break: break-word;
    }
    .jc-badge-strong {
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .jc-badge-salary {
      font-weight: 700;
      color: #065f46;
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .jc-badge-exp {
      font-weight: 700;
      color: #92400e;
      background: #fffbeb;
      border-color: #fde68a;
    }

    .jc-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 12px;
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
      box-shadow: 0 2px 8px rgba(34,197,94,0.25);
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
      gap: 12px;
      padding: 12px 14px;
      flex: 1;
      min-width: 0;
    }
    .jc-grid-layout {
      display: flex;
      flex-direction: column;
      padding: 14px 14px 12px;
      flex: 1;
      min-width: 0;
    }

    .jc-grid-footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
      margin-top: 10px;
      flex-shrink: 0;
      width: 100%;
      min-width: 0;
    }

    .jc-list-footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
      flex-shrink: 0;
      min-width: 0;
      width: 100%;
    }

    @media (min-width: 640px) {
      .jc-list-footer {
        flex-direction: row;
        align-items: flex-end;
        width: 300px;
      }
      .jc-list-footer .jc-btn-apply {
        flex: 1;
      }
    }

    .jc-details-col {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 4px;
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
      padding: 7px 8px !important;
      font-size: 12px !important;
    }

    .jc-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      line-height: 1.3;
      letter-spacing: -0.01em;
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
    }
    .jc-title.list { font-size: 14px; }

    .jc-company {
      font-size: 11px;
      font-weight: 700;
      color: #4f46e5;
      margin: 2px 0 0;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .jc-meta-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
      align-items: center;
    }

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
        gap: 10px;
        padding: 12px;
      }
      .jc-grid-layout {
        padding: 12px;
      }
      .jc-action-row { gap: 6px; }
      .jc-btn { padding: 8px 12px; font-size: 12px; min-height: 36px; }
      .jc-btn-details { min-height: 36px !important; }
    }

    .jc-accent-bar {
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #a5b4fc);
      opacity: 0;
      transition: opacity 0.22s;
      flex-shrink: 0;
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

const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();
  const isList = layout === "list";
  const category = getJobCategory(job.jobTitle);
  const salaryText = formatSalary(job);
  const locationText = formatJobLocation(job);
  const expText = formatExperience(job);
  const fresher = isFresherJob(job);

  const jobDetailNavigation = () => navigate(`/job-details/${job._id}`);
  const handleApplyJob = (e) => {
    e?.stopPropagation?.();
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
      },
    });
  };
  const stopCardClick = (e) => e.stopPropagation();

  return (
    <article
      className="jc-root jc-card"
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
      aria-label="Job listing card"
      role="link"
      tabIndex={0}
      onClick={jobDetailNavigation}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          jobDetailNavigation();
        }
      }}
    >
      <div className="jc-accent-bar" />

      <div className={isList ? "jc-list-layout" : "jc-grid-layout"}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {job.jobCode ? (
            <p className="jc-job-id">
              <span className="jc-job-id-label">Job ID:</span>
              {job.jobCode}
            </p>
          ) : null}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className={`jc-title${isList ? " list" : ""}`}>{job.jobTitle}</h2>
              <p className="jc-company">{job.companyName}</p>
            </div>
            <div style={{ flexShrink: 0 }} onClick={stopCardClick} onKeyDown={stopCardClick}>
              <JobShareButton job={job} compact iconOnly />
            </div>
          </div>

          <div className="jc-meta-stack">
            {category && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700"}`}>
                {category}
              </span>
            )}
            {locationText && (
              <span className="jc-badge jc-badge-strong">
                <MdPlace style={{ color: "#6366f1", fontSize: 12 }} />
                {locationText}
              </span>
            )}
            <span className="jc-badge jc-badge-salary">{salaryText}</span>
            {expText && (
              <span className="jc-badge jc-badge-exp">
                <IoBriefcase style={{ color: "#d97706", fontSize: 11 }} />
                {expText}
              </span>
            )}
            {fresher && (
              <span className="jc-badge" style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", fontWeight: 700 }}>
                Fresher
              </span>
            )}
          </div>
        </div>

        <div className={isList ? "jc-list-footer" : "jc-grid-footer"} onClick={stopCardClick} onKeyDown={stopCardClick}>
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
            <span className="jc-posted-time">Posted {calculateTimeAgo(job.createdAt)}</span>
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
