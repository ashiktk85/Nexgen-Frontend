import { useNavigate } from "react-router-dom";
import { LocationOn, Payments, ArrowForward } from "@mui/icons-material";
import { getJobCategory } from "@/constants/options";
import { calculateTimeAgo } from "@/utils/dateFormation";
import { formatSalary } from "@/utils/formatSalary";
import { formatJobLocation } from "@/utils/formatLocation";
import JobShareButton from "@/components/common/JobShareButton";
import JobWhatsAppButton from "@/components/common/JobWhatsAppButton";

const COMPACT_CARD_HEIGHT = "h-[272px]";

/** Tile card — fixed-size grid layout (Home + All Jobs grid view) */
const FeaturedJobCard = ({ job, index = 0, compact = true }) => {
  const navigate = useNavigate();
  const category = getJobCategory(job.jobTitle);
  const salaryText = formatSalary(job);
  const locationText = formatJobLocation(job);
  const expText =
    job.experienceRequired?.length >= 1
      ? `${job.experienceRequired[0]}–${job.experienceRequired[job.experienceRequired.length - 1]} yrs`
      : null;
  const postedText = job.createdAt ? calculateTimeAgo(job.createdAt) : null;

  const handleApply = () =>
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
      },
    });

  if (!compact) {
    return (
      <article className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow h-full min-h-[320px] flex flex-col min-w-0 w-full">
        <div className="flex justify-between items-start mb-4 shrink-0">
          {category ? (
            <span className="bg-[#0058be]/10 text-[#0058be] px-2.5 py-0.5 rounded-full text-xs font-bold max-w-full truncate">
              {category}
            </span>
          ) : (
            <span className="h-5" aria-hidden />
          )}
        </div>
        <h3 className="text-2xl font-semibold text-[#141b2b] mb-2 line-clamp-2 min-h-[3.25rem]">{job.jobTitle}</h3>
        <p className="text-sm font-semibold text-[#0058be] uppercase tracking-wide line-clamp-1 h-5 mb-4">{job.companyName}</p>
        <div className="flex flex-col gap-1.5 text-sm text-[#424752] h-12 mb-6 overflow-hidden shrink-0">
          <MetaLine icon={<LocationOn sx={{ fontSize: 16 }} />} text={locationText} />
          <MetaLine
            icon={<Payments sx={{ fontSize: 16 }} />}
            text={[salaryText, expText].filter(Boolean).join(" · ")}
          />
        </div>
        <CardActions
          job={job}
          onApply={handleApply}
          onDetails={() => navigate(`/job-details/${job._id}`)}
          postedText={postedText}
          large
        />
      </article>
    );
  }

  return (
    <article
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow min-w-0 w-full flex flex-col p-4 sm:p-5 ${COMPACT_CARD_HEIGHT}`}
    >
      <div className="flex justify-end items-start mb-2 shrink-0 h-6">
        {category ? (
          <span className="bg-[#0058be]/10 text-[#0058be] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold max-w-full truncate leading-5">
            {category}
          </span>
        ) : null}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-[#141b2b] line-clamp-2 min-h-[2.75rem] leading-snug mb-1 shrink-0">
        {job.jobTitle}
      </h3>
      <p className="text-xs font-semibold text-[#0058be] uppercase tracking-wide line-clamp-1 h-4 mb-3 shrink-0">
        {job.companyName || "\u00A0"}
      </p>

      <div className="flex flex-col gap-1 text-xs text-[#424752] h-9 mb-3 overflow-hidden shrink-0">
        <MetaLine icon={<LocationOn sx={{ fontSize: 14 }} />} text={locationText} />
        <MetaLine
          icon={<Payments sx={{ fontSize: 14 }} />}
          text={[salaryText, expText].filter(Boolean).join(" · ")}
        />
      </div>

      <CardActions
        job={job}
        onApply={handleApply}
        onDetails={() => navigate(`/job-details/${job._id}`)}
        postedText={postedText}
      />
    </article>
  );
};

function MetaLine({ icon, text }) {
  return (
    <div className="flex items-center gap-1 min-h-[18px] min-w-0">
      <span className="shrink-0 flex items-center">{icon}</span>
      <span className="truncate">{text || "\u00A0"}</span>
    </div>
  );
}

function CardActions({ job, onApply, onDetails, large = false, postedText }) {
  const btnHeight = large ? "h-11 text-sm" : "h-9 text-xs sm:text-sm";
  const iconSize = large ? 36 : 28;

  return (
    <div className="mt-auto shrink-0">
      {postedText && (
        <div className="text-right mb-1">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none">
            Posted {postedText}
          </span>
        </div>
      )}
      <div className={`flex gap-1.5 items-center ${large ? "sm:gap-2" : ""}`}>
        <button
          type="button"
          onClick={!job.alreadyApplied ? onApply : undefined}
          disabled={job.alreadyApplied}
          className={`flex-1 min-w-0 bg-[#0058be] text-white rounded-lg font-semibold hover:bg-[#2170e4] transition-colors disabled:bg-slate-200 disabled:text-slate-500 ${btnHeight}`}
        >
          {job.alreadyApplied ? "Applied" : "Apply Now"}
        </button>

        <div className="flex gap-1 items-center shrink-0">
          <JobWhatsAppButton
            phone={job.phone}
            countryCode={job.countryCode}
            jobTitle={job.jobTitle}
            companyName={job.companyName}
            size={iconSize}
          />
          <JobShareButton job={job} compact iconOnly />
        </div>

        <button
          type="button"
          onClick={onDetails}
          aria-label="View job details"
          title="View job details"
          className={`shrink-0 flex items-center justify-center gap-1 border border-[#c2c6d4] rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] transition-colors font-semibold ${btnHeight} ${
            large ? "px-3" : "px-2.5"
          }`}
        >
          {large ? "Details" : <ArrowForward sx={{ fontSize: 16 }} />}
        </button>
      </div>
    </div>
  );
}

export default FeaturedJobCard;