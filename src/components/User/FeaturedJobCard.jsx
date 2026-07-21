import { useNavigate } from "react-router-dom";
import { LocationOn, Payments, ArrowForward } from "@mui/icons-material";
import { getJobCategory } from "@/constants/options";
import { calculateTimeAgo } from "@/utils/dateFormation";
import { formatSalary } from "@/utils/formatSalary";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";
import { formatJobLocation } from "@/utils/formatLocation";
import JobShareButton from "@/components/common/JobShareButton";
import JobWhatsAppButton from "@/components/common/JobWhatsAppButton";

/** Tile card — compact grid layout (Home + All Jobs grid view) */
const FeaturedJobCard = ({ job, index = 0, compact = true }) => {
  const navigate = useNavigate();
  const category = getJobCategory(job.jobTitle);
  const salaryText = formatSalary(job);
  const locationText = formatJobLocation(job);
  const expText = formatExperience(job);
  const fresher = isFresherJob(job);
  const experienceMeta = [expText, fresher ? "Fresher" : null].filter(Boolean).join(" · ");
  const postedText = job.createdAt ? calculateTimeAgo(job.createdAt) : null;

  const goToDetails = () => navigate(`/job-details/${job._id}`);
  const handleApply = (e) => {
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
  const onCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetails();
    }
  };

  if (!compact) {
    return (
      <article
        className="bg-white p-5 sm:p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow h-full flex flex-col min-w-0 w-full cursor-pointer"
        role="link"
        tabIndex={0}
        onClick={goToDetails}
        onKeyDown={onCardKeyDown}
        aria-label={`${job.jobTitle} job details`}
      >
        <div className="flex justify-between items-start gap-2 mb-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {job.jobCode ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4f46e5] bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 font-mono">
                <span className="font-semibold text-indigo-500 font-sans">ID:</span>
                {job.jobCode}
              </span>
            ) : null}
            {category ? (
              <span className="bg-[#0058be]/10 text-[#0058be] px-2 py-0.5 rounded-full text-xs font-bold max-w-full truncate">
                {category}
              </span>
            ) : null}
          </div>
          <div onClick={stopCardClick} onKeyDown={stopCardClick}>
            <JobShareButton job={job} compact iconOnly />
          </div>
        </div>
        <h3 className="text-xl font-extrabold text-[#141b2b] mb-1 break-words leading-snug">{job.jobTitle}</h3>
        <p className="text-sm font-bold text-[#0058be] uppercase tracking-wide break-words mb-3">{job.companyName}</p>
        <div className="flex flex-col gap-1 text-sm text-[#424752] mb-4 overflow-hidden shrink-0">
          {locationText ? (
            <MetaLine icon={<LocationOn sx={{ fontSize: 15 }} />} text={locationText} bold />
          ) : null}
          <MetaLine icon={<Payments sx={{ fontSize: 15 }} />} text={salaryText || "Not disclosed"} bold accent="salary" />
          {experienceMeta ? (
            <MetaLine label="Experience" text={experienceMeta} bold accent="exp" />
          ) : null}
        </div>
        <div onClick={stopCardClick} onKeyDown={stopCardClick}>
          <CardActions
            job={job}
            onApply={handleApply}
            onDetails={goToDetails}
            postedText={postedText}
            large
          />
        </div>
      </article>
    );
  }

  return (
    <article
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow min-w-0 w-full flex flex-col p-3 sm:p-3.5 overflow-visible h-full cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={onCardKeyDown}
      aria-label={`${job.jobTitle} job details`}
    >
      <div className="flex justify-between items-start gap-1.5 mb-1.5 shrink-0">
        <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
          {job.jobCode ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#4f46e5] bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 font-mono leading-none">
              <span className="font-semibold text-indigo-500 font-sans">ID:</span>
              {job.jobCode}
            </span>
          ) : null}
          {category ? (
            <span className="bg-[#0058be]/10 text-[#0058be] px-2 py-0.5 rounded-full text-[10px] font-bold max-w-[55%] truncate leading-none">
              {category}
            </span>
          ) : null}
        </div>
        <div onClick={stopCardClick} onKeyDown={stopCardClick}>
          <JobShareButton job={job} compact iconOnly />
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-extrabold text-[#141b2b] line-clamp-2 leading-snug mb-0.5 shrink-0 break-words">
        {job.jobTitle}
      </h3>
      <p className="text-[11px] font-bold text-[#0058be] uppercase tracking-wide line-clamp-1 mb-2 shrink-0">
        {job.companyName || "Private Employer"}
      </p>

      <div className="flex flex-col gap-0.5 text-[11px] sm:text-xs text-[#424752] mb-2.5 overflow-hidden shrink-0 min-w-0">
        <MetaLine
          icon={<LocationOn sx={{ fontSize: 13 }} />}
          text={locationText || "Location not specified"}
          bold
        />
        <MetaLine
          icon={<Payments sx={{ fontSize: 13 }} />}
          text={salaryText || "Not disclosed"}
          bold
          accent="salary"
        />
        {experienceMeta ? (
          <MetaLine label="Experience" text={experienceMeta} bold accent="exp" />
        ) : null}
      </div>

      <div onClick={stopCardClick} onKeyDown={stopCardClick}>
        <CardActions
          job={job}
          onApply={handleApply}
          onDetails={goToDetails}
          postedText={postedText}
        />
      </div>
    </article>
  );
};

function MetaLine({ icon, label, text, bold = false, accent }) {
  const color =
    accent === "salary"
      ? "text-emerald-800"
      : accent === "exp"
        ? "text-amber-800"
        : "text-[#141b2b]";
  return (
    <div className="flex items-center gap-1 min-h-[16px] min-w-0">
      {label ? (
        <span className="shrink-0 text-[10px] font-semibold text-[#64748b] uppercase tracking-wide">
          {label}
        </span>
      ) : icon ? (
        <span className="shrink-0 flex items-center text-[#64748b]">{icon}</span>
      ) : null}
      <span className={`truncate ${bold ? `font-bold ${color}` : ""}`}>{text || "\u00A0"}</span>
    </div>
  );
}

function CardActions({ job, onApply, onDetails, large = false, postedText }) {
  const btnHeight = large ? "h-10 text-sm" : "h-9 text-xs";
  const iconSize = large ? 36 : 34;

  return (
    <div className="mt-auto shrink-0 w-full min-w-0 flex flex-col gap-1">
      {postedText && (
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium leading-none">
            Posted {postedText}
          </span>
        </div>
      )}
      <div className="flex gap-1.5 items-center w-full min-w-0">
        <button
          type="button"
          onClick={!job.alreadyApplied ? onApply : undefined}
          disabled={job.alreadyApplied}
          className={`flex-1 min-w-0 bg-[#0058be] text-white rounded-lg font-semibold hover:bg-[#2170e4] transition-colors disabled:bg-slate-200 disabled:text-slate-500 ${btnHeight}`}
        >
          {job.alreadyApplied ? "Applied" : "Apply Now"}
        </button>

        <JobWhatsAppButton
          phone={job.phone}
          countryCode={job.countryCode}
          jobTitle={job.jobTitle}
          companyName={job.companyName}
          size={iconSize}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDetails();
          }}
          aria-label="View job details"
          title="View job details"
          className={`shrink-0 flex items-center justify-center gap-1 border border-[#c2c6d4] rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] transition-colors font-semibold ${btnHeight} ${
            large ? "px-3" : "px-2"
          }`}
        >
          {large ? "Details" : <ArrowForward sx={{ fontSize: 15 }} />}
        </button>
      </div>
    </div>
  );
}

export default FeaturedJobCard;
