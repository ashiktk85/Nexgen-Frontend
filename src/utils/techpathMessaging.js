const BRAND_NAME = "TechPath";

export function buildTechPathShareText(job) {
  const title = job?.jobTitle || job?.name || "Job opportunity";
  const company = job?.companyName || "";
  const location = [job?.city, job?.state].filter(Boolean).join(", ");
  const parts = [title];
  if (company) parts.push(`at ${company}`);
  if (location) parts.push(`in ${location}`);
  return `${parts.join(" ")} — Apply on ${BRAND_NAME}`;
}

export function buildTechPathShareUrl(jobId) {
  if (typeof window === "undefined" || !jobId) return "";
  const url = new URL(`/job-details/${jobId}`, window.location.origin);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", "social");
  return url.toString();
}

export function buildTechPathEnquiryMessage({ jobTitle, companyName, jobId, jobDetailsId } = {}) {
  const idPart = jobId && jobId !== "—" ? ` (Job ID: ${jobId})` : "";
  const roleLine = [
    jobTitle ? `I'm interested in the ${jobTitle} role` : "I'm interested in this job",
    companyName ? `at ${companyName}` : null,
    idPart || null,
  ]
    .filter(Boolean)
    .join(" ");

  const jobUrl = jobDetailsId ? buildTechPathShareUrl(jobDetailsId) : "";

  const lines = [
    "Hi,",
    "",
    `${roleLine}.`,
    "",
    "Could you share more details?",
    "",
    `— Enquiry via ${BRAND_NAME}`,
    "Kerala's mobile repair job platform",
    `Find & apply for jobs on ${BRAND_NAME}`,
  ];

  if (jobUrl) {
    lines.push(jobUrl);
  }

  return lines.join("\n");
}

export { BRAND_NAME };
