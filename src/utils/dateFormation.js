import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

/** Short relative time for job cards, e.g. "Just now", "5 m", "2 h", "3 d" */
export const calculateTimeAgo = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const minutes = differenceInMinutes(now, date);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} m`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} h`;

  const days = differenceInDays(now, date);
  if (days < 30) return `${days} d`;

  const months = differenceInMonths(now, date);
  if (months < 12) return `${months} mo`;

  const years = differenceInYears(now, date);
  return `${years} y`;
};
