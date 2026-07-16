/**
 * Format experienceRequired / experience array for display.
 * Single value (incl. 0) → "0 yrs"; range → "2–5 yrs".
 */
export function formatExperience(job) {
  const arr = job?.experienceRequired || job?.experience || [];
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const min = Number(arr[0]);
  const max = Number(arr[arr.length - 1]);
  if (Number.isNaN(min)) return null;

  if (Number.isNaN(max) || max === min) {
    return `${min} yr${min === 1 ? "" : "s"}`;
  }
  return `${min}–${max} yrs`;
}

/** True when the job is fresher-only (0 / 0–0 years). */
export function isFresherJob(job) {
  const arr = job?.experienceRequired || job?.experience || [];
  if (!Array.isArray(arr) || arr.length === 0) return false;
  const min = Number(arr[0]);
  const max = Number(arr[arr.length - 1] ?? arr[0]);
  return min === 0 && (Number.isNaN(max) || max === 0);
}

/** Parse stored experience into form from/to fields (to empty = single value). */
export function parseExperienceFromJob(job) {
  if (!job?.experienceRequired?.length && !job?.experience?.length) {
    return { from: 0, to: "" };
  }
  const arr = job.experienceRequired || job.experience;
  const min = Number(arr[0] ?? 0);
  const max = Number(arr[arr.length - 1] ?? min);
  if (Number.isNaN(min)) return { from: 0, to: "" };
  if (Number.isNaN(max) || max === min) return { from: min, to: "" };
  return { from: min, to: max };
}

/** Build [min, max] for API from optional from/to form values. */
export function buildExperienceRequired(from, to) {
  const min = Math.max(0, Math.min(10, Number(from) || 0));
  const hasTo = to !== "" && to != null && !Number.isNaN(Number(to));
  const max = hasTo ? Math.max(min, Math.min(10, Number(to))) : min;
  return [min, max];
}
