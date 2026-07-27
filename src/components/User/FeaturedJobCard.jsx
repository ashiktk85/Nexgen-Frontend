import JobCard from "@/components/User/JobCard";

/**
 * Home / All Jobs grid card — same UI as JobCard.
 * Kept as a named export so existing imports keep working.
 */
const FeaturedJobCard = ({ job }) => <JobCard job={job} />;

export default FeaturedJobCard;
