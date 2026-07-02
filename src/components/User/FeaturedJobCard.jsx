import { useNavigate } from "react-router-dom";
import { LocationOn, Payments } from "@mui/icons-material";
import { getJobCategory } from "@/constants/options";
import { calculateTimeAgo } from "@/utils/dateFormation";

const FEATURED_AVATAR_STYLES = [
  { bg: "bg-[#003f87]/10", text: "text-[#003f87]" },
  { bg: "bg-[#722b00]/10", text: "text-[#722b00]" },
  { bg: "bg-[#0058be]/10", text: "text-[#0058be]" },
];

const COMPACT_CARD_HEIGHT = "h-[272px]";

/** Tile card — fixed-size grid layout (Home + All Jobs grid view) */
const FeaturedJobCard = ({ job, index = 0, compact = true }) => {
  const navigate = useNavigate();
  const initial = (job.companyName || job.jobTitle)?.charAt(0)?.toUpperCase() || "J";
  const avatarStyle = FEATURED_AVATAR_STYLES[index % FEATURED_AVATAR_STYLES.length];
  const category = getJobCategory(job.jobTitle);

  const salaryText =
    job.salaryRange?.length >= 2
      ? `₹${job.salaryRange[0]}–${job.salaryRange[job.salaryRange.length - 1]}`
      : null;
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
        <div className="flex justify-between items-start mb-6 shrink-0 h-12">
          <div className={`w-12 h-12 ${avatarStyle.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <span className={`${avatarStyle.text} font-bold text-xl`}>{initial}</span>
          </div>
          {category && (
            <span className="bg-[#0058be]/10 text-[#0058be] px-2.5 py-0.5 rounded-full text-xs font-bold max-w-[50%] truncate">
              {category}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-semibold text-[#141b2b] mb-2 line-clamp-2 min-h-[3.25rem]">{job.jobTitle}</h3>
        <p className="text-sm font-semibold text-[#0058be] uppercase tracking-wide line-clamp-1 h-5 mb-4">{job.companyName}</p>
        <div className="flex flex-col gap-1.5 text-sm text-[#424752] h-12 mb-6 overflow-hidden shrink-0">
          <MetaLine icon={<LocationOn sx={{ fontSize: 16 }} />} text={[job.city, job.country].filter(Boolean).join(", ")} />
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
      <div className="flex justify-between items-start mb-3 shrink-0 h-10">
        <div className={`w-10 h-10 ${avatarStyle.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className={`${avatarStyle.text} font-bold text-base`}>{initial}</span>
        </div>
        {category ? (
          <span className="bg-[#0058be]/10 text-[#0058be] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold max-w-[48%] truncate leading-5">
            {category}
          </span>
        ) : (
          <span className="h-5 w-5 shrink-0" aria-hidden />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-[#141b2b] line-clamp-2 min-h-[2.75rem] leading-snug mb-1 shrink-0">
        {job.jobTitle}
      </h3>
      <p className="text-xs font-semibold text-[#0058be] uppercase tracking-wide line-clamp-1 h-4 mb-3 shrink-0">
        {job.companyName || "\u00A0"}
      </p>

      <div className="flex flex-col gap-1 text-xs text-[#424752] h-9 mb-3 overflow-hidden shrink-0">
        <MetaLine icon={<LocationOn sx={{ fontSize: 14 }} />} text={[job.city, job.country].filter(Boolean).join(", ")} />
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
  const detailsWidth = large ? "w-[88px]" : "w-[76px]";
  const btnHeight = large ? "h-11 text-sm" : "h-9 text-xs sm:text-sm";

  return (
    <div className={`flex gap-2 mt-auto shrink-0 items-end ${large ? "sm:gap-3" : ""}`}>
      <button
        type="button"
        onClick={!job.alreadyApplied ? onApply : undefined}
        disabled={job.alreadyApplied}
        className={`flex-1 min-w-0 bg-[#0058be] text-white rounded-lg font-semibold hover:bg-[#2170e4] transition-colors disabled:bg-slate-200 disabled:text-slate-500 ${btnHeight}`}
      >
        {job.alreadyApplied ? "Applied" : "Apply Now"}
      </button>
      <div className={`flex flex-col gap-1 shrink-0 ${detailsWidth}`}>
        {postedText && (
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium text-center truncate leading-none">
            Posted {postedText}
          </span>
        )}
        <button
          type="button"
          onClick={onDetails}
          className={`w-full border border-[#c2c6d4] rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] transition-colors font-semibold ${btnHeight}`}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default FeaturedJobCard;
