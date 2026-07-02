/** Build a tel: href for click-to-call (mobile dialer / desktop calling apps). */
export function buildTelHref(phone, countryCode = "") {
  if (!phone) return null;

  const cleanedPhone = String(phone).replace(/[^\d+]/g, "");
  if (!cleanedPhone) return null;

  if (cleanedPhone.startsWith("+")) {
    return `tel:${cleanedPhone}`;
  }

  const cleanedCode = String(countryCode || "").replace(/[^\d+]/g, "");
  if (cleanedCode) {
    const prefix = cleanedCode.startsWith("+") ? cleanedCode : `+${cleanedCode}`;
    return `tel:${prefix}${cleanedPhone}`;
  }

  return `tel:${cleanedPhone}`;
}

export function formatPhoneDisplay(phone, countryCode = "") {
  if (!phone) return "";
  const code = String(countryCode || "").trim();
  return code ? `${code} ${phone}`.trim() : String(phone).trim();
}
