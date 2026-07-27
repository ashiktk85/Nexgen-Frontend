import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdPlace } from "react-icons/md";
import { formatJobLocation } from "@/utils/formatLocation";
import { formatSalary } from "@/utils/formatSalary";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";
import JobShareButton from "@/components/common/JobShareButton";
import { buildWhatsAppHref } from "@/utils/phone";

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
      padding: 18px 48px 14px 18px;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ujc-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .ujc-header-main { flex: 1; min-width: 0; }
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

    .ujc-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }
    .ujc-job-id {
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 700;
      color: #0058be;
      line-height: 1.3;
      text-align: right;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .ujc-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 2px 0 0;
    }

    .ujc-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 2px;
    }
    .ujc-row {
      display: grid;
      grid-template-columns: minmax(88px, 38%) 1fr;
      gap: 10px;
      align-items: baseline;
    }
    .ujc-label {
      font-size: 12.5px;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0.01em;
    }
    .ujc-value {
      font-size: 12.5px;
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
      min-height: 46px;
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
    .ujc-footer-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
    .ujc-footer-btn + .ujc-footer-btn {
      border-left: 1px solid rgba(255,255,255,0.35);
    }

    .ujc-wa-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-top: -2px;
    }
    .ujc-wa-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #25D366;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 1px 4px rgba(37,211,102,0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .ujc-wa-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(37,211,102,0.4);
    }

    @media (max-width: 380px) {
      .ujc-row { grid-template-columns: 1fr; gap: 2px; }
      .ujc-footer-btn { font-size: 11px; letter-spacing: 0.05em; }
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

function formatFoodAcco(job) {
  const food = String(job?.foodAvailable || "").trim();
  const room = String(job?.roomAvailable || "").trim();
  const foodYes = /^yes$/i.test(food);
  const roomYes = /^yes$/i.test(room);

  if (foodYes || roomYes) {
    const parts = [];
    if (foodYes) parts.push("Food");
    if (roomYes) parts.push("Acco");
    return parts.join(" + ");
  }

  if (!food && !room) return "NO";
  if (/^no$/i.test(food) && (!room || /^no$/i.test(room))) return "NO";
  if (/^no$/i.test(room) && (!food || /^no$/i.test(food))) return "NO";

  const bits = [];
  if (food) bits.push(food);
  if (room && room !== food) bits.push(room);
  return bits.join(" / ") || "NO";
}

function displayJobId(job) {
  if (job?.jobCode) return job.jobCode;
  if (job?._id) return String(job._id).slice(-7).toUpperCase();
  return "—";
}

/**
 * User-facing job card — title, location, job ID badge,
 * salary / experience / food & acco rows, Apply / Job Details footer.
 */
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.seekerInfo);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  const locationText = formatJobLocation(job) || "Location not specified";
  const foodAcco = formatFoodAcco(job);
  const jobId = displayJobId(job);
  const salaryText = formatSalary(job) || "Not disclosed";
  const expText = formatExperience(job);
  const fresher = isFresherJob(job);
  const experienceText = [expText, fresher ? "Fresher" : null].filter(Boolean).join(" · ") || "—";

  const waText = [
    "Hi,",
    job.jobTitle ? `I'm interested in the ${job.jobTitle} role` : "I'm interested in this job",
    job.companyName ? `at ${job.companyName}` : null,
    jobId !== "—" ? `(Job ID: ${jobId}).` : ".",
    "Could you share more details?",
  ].filter(Boolean).join(" ");

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

      <div className="ujc-body">
        <div className="ujc-header">
          <div className="ujc-header-main">
            <h2 className="ujc-title">{job.jobTitle}</h2>
            <div className="ujc-location">
              <MdPlace size={15} />
              <span>{locationText}</span>
            </div>
          </div>
        </div>

        <div className="ujc-divider" />

        <div className="ujc-rows">
          <div className="ujc-row">
            <span className="ujc-label">Salary</span>
            <div className="ujc-value-row">
              <span className="ujc-value">{salaryText}</span>
              <span className="ujc-job-id" title={`Job ID: ${jobId}`}>
                {jobId}
              </span>
            </div>
          </div>
          <div className="ujc-row">
            <span className="ujc-label">Experience</span>
            <span className="ujc-value">{experienceText}</span>
          </div>
          <div className="ujc-row">
            <span className="ujc-label">Food &amp; Acco</span>
            <span className="ujc-value">{foodAcco}</span>
          </div>
        </div>

        {waHref && (
          <div className="ujc-wa-row" onClick={stop} onKeyDown={stop}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ujc-wa-link"
              title="Chat on WhatsApp"
              aria-label="Chat with employer on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        )}
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
        <button
          type="button"
          className="ujc-footer-btn"
          onClick={goToDetails}
          aria-label="View job details"
        >
          Job Details
        </button>
      </div>
    </article>
  );
};

export default JobCard;
