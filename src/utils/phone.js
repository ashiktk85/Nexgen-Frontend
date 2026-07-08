/** Digits-only international number for WhatsApp / dialer (no leading +). */
export function toWhatsAppDigits(phone, countryCode = "+91") {
  if (!phone) return null;

  const cleanedPhone = String(phone).replace(/[^\d+]/g, "");
  if (!cleanedPhone) return null;

  if (cleanedPhone.startsWith("+")) {
    return cleanedPhone.replace(/\D/g, "") || null;
  }

  const codeDigits = String(countryCode || "+91").replace(/\D/g, "") || "91";
  const local = cleanedPhone.replace(/\D/g, "");
  if (!local) return null;

  // Avoid double-prefixing if phone already includes country code
  if (local.startsWith(codeDigits) && local.length > 10) return local;
  return `${codeDigits}${local}`;
}

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

/** Open WhatsApp chat with shop owner. Optional prefilled message. */
export function buildWhatsAppHref(phone, countryCode = "+91", { text = "" } = {}) {
  const digits = toWhatsAppDigits(phone, countryCode);
  if (!digits) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function formatPhoneDisplay(phone, countryCode = "") {
  if (!phone) return "";
  const code = String(countryCode || "").trim();
  return code ? `${code} ${phone}`.trim() : String(phone).trim();
}
