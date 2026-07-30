const CURRENCY_META = {
  INR: { symbol: "₹", locale: "en-IN" },
  AED: { symbol: "AED ", locale: "en-AE" },
  SAR: { symbol: "SAR ", locale: "en-SA" },
  QAR: { symbol: "QAR ", locale: "en-QA" },
  KWD: { symbol: "KWD ", locale: "en-KW" },
  OMR: { symbol: "OMR ", locale: "en-OM" },
  BHD: { symbol: "BHD ", locale: "en-BH" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "en-IE" },
  GBP: { symbol: "£", locale: "en-GB" },
  MYR: { symbol: "RM ", locale: "en-MY" },
  SGD: { symbol: "S$", locale: "en-SG" },
};

export const SALARY_CURRENCY_OPTIONS = Object.keys(CURRENCY_META).map((code) => ({
  code,
  label: `${code} (${CURRENCY_META[code].symbol.trim()})`,
  symbol: CURRENCY_META[code].symbol,
}));

function getCurrencyMeta(code) {
  const key = String(code || "INR").toUpperCase();
  return CURRENCY_META[key] || { symbol: `${key} `, locale: "en" };
}

function formatAmountPart(part, locale = "en-IN") {
  const trimmed = String(part ?? "").trim();
  if (!trimmed) return "";
  if (/[a-zA-Z]/.test(trimmed)) return trimmed;
  const num = Number(trimmed.replace(/,/g, ""));
  if (!Number.isNaN(num)) return num.toLocaleString(locale);
  return trimmed;
}

function stripKnownPrefixes(value) {
  return String(value || "")
    .replace(/^(₹|AED|SAR|QAR|KWD|OMR|BHD|USD|EUR|GBP|MYR|SGD|RM|S\$|\$|€|£)\s*/i, "")
    .trim();
}

function formatDisplayText(display, currency = "INR") {
  const meta = getCurrencyMeta(currency);
  const raw = String(display || "").trim();
  if (!raw) return "";

  // Already includes a currency marker — keep as-is
  if (/^(₹|AED|SAR|QAR|KWD|OMR|BHD|USD|EUR|GBP|MYR|SGD|RM|S\$|\$|€|£)/i.test(raw)) {
    return raw;
  }

  const parts = raw.split(/\s*[–-]\s*/);
  if (parts.length === 1) {
    const formatted = formatAmountPart(parts[0], meta.locale);
    return formatted ? `${meta.symbol}${formatted}` : "";
  }

  const from = formatAmountPart(parts[0], meta.locale);
  const to = formatAmountPart(parts[1], meta.locale);
  if (from && to) return `${meta.symbol}${from} – ${meta.symbol}${to}`;
  if (from) return `${meta.symbol}${from}`;
  if (to) return `${meta.symbol}${to}`;
  return "";
}

function formatRange(range, currency = "INR") {
  const meta = getCurrencyMeta(currency);
  const [min, max] = range || [0, 0];
  if ((min === 0 || min == null) && (max === 0 || max == null)) return "";
  if (!max || max === 0 || max === min) {
    return `${meta.symbol}${Number(min).toLocaleString(meta.locale)}`;
  }
  return `${meta.symbol}${Number(min).toLocaleString(meta.locale)} – ${meta.symbol}${Number(max).toLocaleString(meta.locale)}`;
}

/**
 * Display salary in local/primary currency.
 * Pass { includeInr: true } to also append Indian rupees (job details).
 */
export function formatSalary(job, { includeInr = false } = {}) {
  const currency = String(job?.salaryCurrency || "INR").toUpperCase();
  const display = typeof job?.salaryDisplay === "string" ? job.salaryDisplay.trim() : job?.salaryDisplay;

  let localText = "";
  if (display) {
    localText = formatDisplayText(display, currency);
  } else {
    const range = job?.salaryRange || job?.salary || [0, 0];
    localText = formatRange(range, currency);
  }

  if (!localText) return "Not disclosed";

  if (!includeInr || currency === "INR") return localText;

  const inrDisplay =
    typeof job?.salaryInrDisplay === "string" ? job.salaryInrDisplay.trim() : job?.salaryInrDisplay;
  let inrText = "";
  if (inrDisplay) {
    inrText = formatDisplayText(inrDisplay, "INR");
  } else if (Array.isArray(job?.salaryInrRange)) {
    inrText = formatRange(job.salaryInrRange, "INR");
  }

  if (inrText) return `${localText} (≈ ${inrText})`;
  return localText;
}

export function parseSalaryFromJob(job) {
  if (!job) {
    return {
      from: "",
      to: "",
      currency: "INR",
      inrFrom: "",
      inrTo: "",
    };
  }

  const currency = String(job.salaryCurrency || "INR").toUpperCase();
  let from = "";
  let to = "";

  if (job.salaryDisplay) {
    const parts = job.salaryDisplay.split(/\s*[–-]\s*/).map((s) => stripKnownPrefixes(s));
    from = parts[0] || "";
    to = parts[1] || "";
  } else {
    const [min, max] = job.salaryRange || [0, 0];
    from = min && min !== 0 ? String(min) : "";
    to = max && max !== 0 && max !== min ? String(max) : "";
  }

  let inrFrom = "";
  let inrTo = "";
  if (job.salaryInrDisplay) {
    const parts = job.salaryInrDisplay.split(/\s*[–-]\s*/).map((s) => stripKnownPrefixes(s));
    inrFrom = parts[0] || "";
    inrTo = parts[1] || "";
  } else {
    const [min, max] = job.salaryInrRange || [0, 0];
    inrFrom = min && min !== 0 ? String(min) : "";
    inrTo = max && max !== 0 && max !== min ? String(max) : "";
  }

  return { from, to, currency, inrFrom, inrTo };
}
