function formatAmountPart(part) {
  const trimmed = String(part ?? "").trim();
  if (!trimmed) return "";
  if (/[a-zA-Z]/.test(trimmed)) return trimmed;
  const num = Number(trimmed.replace(/,/g, ""));
  if (!Number.isNaN(num)) return num.toLocaleString("en-IN");
  return trimmed;
}

/**
 * Display salary as entered by the employer.
 * Supports salaryDisplay (raw text) and legacy salaryRange [min, max].
 */
export function formatSalary(job) {
  const display = typeof job?.salaryDisplay === "string" ? job.salaryDisplay.trim() : job?.salaryDisplay;
  if (display) {
    if (display.startsWith("₹")) return display;
    const parts = display.split(/\s*[–-]\s*/);
    if (parts.length === 1) {
      const formatted = formatAmountPart(parts[0]);
      return formatted ? `₹${formatted}` : "Not disclosed";
    }
    const from = formatAmountPart(parts[0]);
    const to = formatAmountPart(parts[1]);
    if (from && to) return `₹${from} – ₹${to}`;
    if (from) return `₹${from}`;
    if (to) return `₹${to}`;
    return "Not disclosed";
  }

  const range = job?.salaryRange || job?.salary || [0, 0];
  const [min, max] = range;
  if ((min === 0 || min == null) && (max === 0 || max == null)) return "Not disclosed";
  if (!max || max === 0 || max === min) {
    return `₹${Number(min).toLocaleString("en-IN")}`;
  }
  return `₹${Number(min).toLocaleString("en-IN")} – ₹${Number(max).toLocaleString("en-IN")}`;
}

export function parseSalaryFromJob(job) {
  if (!job) return { from: "", to: "" };
  if (job.salaryDisplay) {
    const parts = job.salaryDisplay.split(/\s*[–-]\s*/).map((s) => s.replace(/^₹/, "").trim());
    return { from: parts[0] || "", to: parts[1] || "" };
  }
  const [min, max] = job.salaryRange || [0, 0];
  const from = min && min !== 0 ? String(min) : "";
  const to = max && max !== 0 && max !== min ? String(max) : "";
  return { from, to };
}
