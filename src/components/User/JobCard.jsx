import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdPlace } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { formatJobLocation } from "@/utils/formatLocation";
import { formatSalary } from "@/utils/formatSalary";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";
import JobShareButton from "@/components/common/JobShareButton";
import { buildWhatsAppHref } from "@/utils/phone";
import { buildTechPathEnquiryMessage } from "@/utils/techpathMessaging";

const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

    .ujc-root { font-family: 'DM Sans', sans-serif; }
    .ujc-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      cursor: pointer;
      position: relative;
      transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }
    .ujc-card:hover {
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.1);
      border-color: #d1d5db;
      transform: translateY(-2px);
    }

    .ujc-share {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 2;
    }

    .ujc-body {
      padding: 16px 48px 14px 16px;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
    }

    .ujc-header-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
      padding-right: 4px;
    }

    .ujc-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-width: 0;
      flex-wrap: wrap;
    }

    .ujc-id-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      padding: 4px 10px;
      border-radius: 999px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #475569;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: 0.01em;
      flex-shrink: 1;
      min-width: 0;
    }

    .ujc-id-pill-label {
      color: #94a3b8;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      flex-shrink: 0;
    }

    .ujc-id-pill-value {
      color: #0058be;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .ujc-posted {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      line-height: 1.3;
      text-align: right;
      white-space: nowrap;
      flex-shrink: 0;
      margin-left: auto;
    }

    .ujc-title {
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #111827;
      line-height: 1.35;
      letter-spacing: -0.02em;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .ujc-shop {
      margin: 5px 0 0;
      font-size: 12.5px;
      font-weight: 600;
      color: #374151;
      line-height: 1.3;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .ujc-location {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      margin-top: 6px;
      font-size: 12.5px;
      color: #6b7280;
      font-weight: 500;
      line-height: 1.35;
    }
    .ujc-location svg { flex-shrink: 0; margin-top: 1px; color: #ef4444; }

    .ujc-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 2px 0 0;
    }

    .ujc-rows {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      align-self: stretch;
      gap: 8px;
      margin-left: -16px;
      margin-right: -48px;
      padding: 6px 16px 0 42px;
      box-sizing: border-box;
    }
    .ujc-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    }
    .ujc-detail {
      display: grid;
      grid-template-columns: 7.6rem auto minmax(0, 1fr);
      align-items: baseline;
      width: 100%;
      font-size: 12.5px;
      font-weight: 700;
      color: #111827;
      line-height: 1.4;
    }
    .ujc-detail-label {
      text-align: left;
      justify-self: start;
      padding-right: 18px;
    }
    .ujc-detail-colon {
      text-align: center;
    }
    .ujc-detail-value {
      text-align: left;
      padding-left: 18px;
      font-weight: 500;
      color: #6b7280;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .ujc-footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: auto;
      background: #1e3a5f;
    }
    .ujc-footer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 12px 10px;
      border: none;
      background: transparent;
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: background 0.15s ease;
    }
    .ujc-footer-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
    .ujc-footer-btn:disabled { opacity: 0.65; cursor: not-allowed; }
    .ujc-footer-btn + .ujc-footer-btn { border-left: 1px solid rgba(255,255,255,0.35); }

    .ujc-row--acco {
      position: relative;
    }
    .ujc-row--acco .ujc-detail-value {
      padding-right: 36px;
    }
    .ujc-wa-link {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #25D366;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 1px 4px rgba(37,211,102,0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .ujc-wa-link:hover { transform: translateY(-50%) scale(1.05); }
    .ujc-body--wa {
      padding-bottom: 14px;
    }

    @media (max-width: 380px) {
      .ujc-rows { margin-right: -44px; padding-right: 12px; padding-left: 28px; }
      .ujc-footer { grid-template-columns: 1fr; }
      .ujc-footer-btn + .ujc-footer-btn { border-left: none; border-top: 1px solid rgba(255,255,255,0.35); }
      .ujc-id-pill-value { max-width: 110px; }
      .ujc-body { padding-right: 44px; }
    }
  `;

  let tag = document.getElementById("ujc-styles");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "ujc-styles";
    document.head.appendChild(tag);
  }
  tag.textContent = css;
};

injectStyles();

function yesNo(value) {
  const v = String(value || "").trim();
  if (/^yes$/i.test(v)) return "Yes";
  if (/^no$/i.test(v)) return "No";
  return v || "No";
}

function displayJobId(job) {
  if (job?.jobCode) return job.jobCode;
  if (job?._id) return String(job._id).slice(-7).toUpperCase();
  return "—";
}

function formatPostedAgo(job) {
  const date = job?.createdAt || job?.postedAt;
  if (!date) return null;
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return null;
  }
}

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.seekerInfo);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  const locationText = formatJobLocation(job) || "Location not specified";
  const foodText = yesNo(job?.foodAvailable);
  const accommodationText = yesNo(job?.roomAvailable);
  const jobId = displayJobId(job);
  const postedAgo = formatPostedAgo(job);
  const salaryText = formatSalary(job) || "Not disclosed";
  const expText = formatExperience(job);
  const fresher = isFresherJob(job);
  const experienceText = [expText, fresher ? "Fresher" : null].filter(Boolean).join(" · ") || "—";

  const waText = buildTechPathEnquiryMessage({
    jobTitle: job.jobTitle,
    companyName: job.companyName,
    jobId,
    jobDetailsId: job._id,
  });

  const waHref = job.phone ? buildWhatsAppHref(job.phone, job.countryCode, { text: waText }) : null;

  const goToDetails = () => navigate(`/job-details/${job._id}`);
  const handleApply = (e) => {
    e?.stopPropagation?.();
    if (job.alreadyApplied) return;
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
        userName,
      },
    });
  };
  const stop = (e) => e.stopPropagation();

  return (
    <article
      className="ujc-root ujc-card"
      role="link"
      tabIndex={0}
      aria-label={`${job.jobTitle} job listing`}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
    >
      <div className="ujc-share" onClick={stop} onKeyDown={stop}>
        <JobShareButton job={job} compact iconOnly />
      </div>

      <div className={`ujc-body${waHref ? " ujc-body--wa" : ""}`}>
        <div className="ujc-header-block">
          <h2 className="ujc-title">{job.jobTitle}</h2>
          {job.companyName ? <p className="ujc-shop">{job.companyName}</p> : null}
          <div className="ujc-location">
            <MdPlace size={15} />
            <span>{locationText}</span>
          </div>
          <div className="ujc-meta-row">
            {jobId !== "—" ? (
              <span className="ujc-id-pill" title={`Job ID: ${jobId}`}>
                <span className="ujc-id-pill-label">ID</span>
                <span className="ujc-id-pill-value">{jobId}</span>
              </span>
            ) : (
              <span />
            )}
            {postedAgo && (
              <span className="ujc-posted">Posted {postedAgo}</span>
            )}
          </div>
        </div>

        <div className="ujc-divider" />

        <div className="ujc-rows">
          <div className="ujc-row">
            <span className="ujc-detail">
              <span className="ujc-detail-label">Salary</span>
              <span className="ujc-detail-colon">:</span>
              <span className="ujc-detail-value">{salaryText}</span>
            </span>
          </div>
          <div className="ujc-row">
            <span className="ujc-detail">
              <span className="ujc-detail-label">Experience</span>
              <span className="ujc-detail-colon">:</span>
              <span className="ujc-detail-value">{experienceText}</span>
            </span>
          </div>
          <div className="ujc-row">
            <span className="ujc-detail">
              <span className="ujc-detail-label">Food</span>
              <span className="ujc-detail-colon">:</span>
              <span className="ujc-detail-value">{foodText}</span>
            </span>
          </div>
          <div className={`ujc-row${waHref ? " ujc-row--acco" : ""}`}>
            <span className="ujc-detail">
              <span className="ujc-detail-label">Accommodation</span>
              <span className="ujc-detail-colon">:</span>
              <span className="ujc-detail-value">{accommodationText}</span>
            </span>
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ujc-wa-link"
                title="Chat on WhatsApp"
                aria-label="Chat with employer on WhatsApp"
                onClick={stop}
                onKeyDown={stop}
              >
                <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="ujc-footer" onClick={stop} onKeyDown={stop}>
        <button
          type="button"
          className="ujc-footer-btn"
          disabled={job.alreadyApplied}
          onClick={handleApply}
          aria-label={job.alreadyApplied ? "Already applied" : "Apply now"}
        >
          {job.alreadyApplied ? "Applied" : "Apply Now"}
        </button>
        <button type="button" className="ujc-footer-btn" onClick={goToDetails} aria-label="View job details">
          Job Details
        </button>
      </div>
    </article>
  );
};

export default JobCard;
