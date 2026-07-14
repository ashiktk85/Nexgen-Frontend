import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Link2, Check } from "lucide-react";
import { toast } from "sonner";

/* ── Platform SVG logos ── */
function IconWhatsApp({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconLinkedIn({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconFacebook({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconTelegram({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.788.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function IconX({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.451L1.254 2.25H8.08l4.257 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconInstagram({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const PLATFORMS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    Icon: IconWhatsApp,
    buildUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    Icon: IconLinkedIn,
    buildUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    Icon: IconFacebook,
    buildUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#26A5E4",
    Icon: IconTelegram,
    buildUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "twitter",
    label: "X",
    color: "#000000",
    Icon: IconX,
    buildUrl: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    Icon: IconInstagram,
    copyThenOpen: "instagram://app",
  },
  {
    id: "copy",
    label: "Copy Link",
    color: "#6366f1",
    Icon: Link2,
    copyOnly: true,
  },
];

function buildShareContent(job) {
  const title = job?.jobTitle || job?.name || "Job opportunity";
  const company = job?.companyName || "";
  const location = [job?.city, job?.state].filter(Boolean).join(", ");
  const parts = [title];
  if (company) parts.push(`at ${company}`);
  if (location) parts.push(`in ${location}`);
  return parts.join(" ");
}

function isMobileLike() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const narrow = window.matchMedia?.("(max-width: 768px)")?.matches;
  const ua =
    /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ""
    );
  return Boolean(coarse || narrow || ua);
}

function canUseNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export default function JobShareButton({
  job,
  jobId,
  className = "",
  buttonClassName = "",
  label = "Share",
  compact = false,
  iconOnly = false,
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 240 });
  const [isNarrow, setIsNarrow] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const id = jobId || job?._id;

  const updateMenuPosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const narrow = window.innerWidth < 640;
    setIsNarrow(narrow);

    if (narrow) return;

    const menuWidth = 240;
    const gap = 8;
    let left = rect.right - menuWidth;
    left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));

    // Prefer opening below the button; flip above if not enough space
    const estimatedHeight = 420;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const openBelow = spaceBelow >= Math.min(estimatedHeight, 280) || spaceBelow >= rect.top;

    const top = openBelow
      ? rect.bottom + gap
      : Math.max(12, rect.top - gap - Math.min(estimatedHeight, spaceBelow > 120 ? estimatedHeight : rect.top - 24));

    setMenuPos({ top, left, width: menuWidth, openBelow });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const copyLink = useCallback(async (url, toastMsg) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(toastMsg || "Link copied to clipboard!");
      setTimeout(() => setCopied(false), 1600);
      return true;
    } catch {
      toast.error("Could not copy link");
      return false;
    }
  }, []);

  if (!id) return null;

  const url = `${window.location.origin}/job-details/${id}`;
  const text = buildShareContent(job);
  const shareTitle = job?.jobTitle || job?.name || "Job opportunity";
  const preferNative = canUseNativeShare() && isMobileLike();

  const openPlatformUrl = (shareUrl) => {
    const a = document.createElement("a");
    a.href = shareUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleNativeShare = async () => {
    const payload = { title: shareTitle, text, url };
    try {
      if (navigator.canShare && !navigator.canShare(payload)) {
        setOpen(true);
        return;
      }
      await navigator.share(payload);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setOpen(true);
    }
  };

  const handleShareClick = () => {
    if (preferNative) {
      handleNativeShare();
      return;
    }
    setOpen((v) => !v);
  };

  const handlePlatform = async (platform) => {
    if (platform.copyOnly) {
      await copyLink(url);
      setOpen(false);
      return;
    }

    if (platform.copyThenOpen) {
      await copyLink(
        url,
        "Link copied — paste it in Instagram (Story, DM, or bio)."
      );
      try {
        window.location.href = platform.copyThenOpen;
      } catch {
        /* ignore */
      }
      setOpen(false);
      return;
    }

    openPlatformUrl(platform.buildUrl(url, text));
    setOpen(false);
  };

  const defaultBtnClass = compact
    ? "inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
    : "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors";

  const iconSize = compact || iconOnly ? 14 : 16;

  const menu = open
    ? createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/40 sm:bg-transparent"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            ref={menuRef}
            role="menu"
            className={
              "z-[9999] bg-white overflow-hidden shadow-2xl border border-slate-200 " +
              (isNarrow
                ? "fixed inset-x-0 bottom-0 rounded-t-2xl pb-[max(12px,env(safe-area-inset-bottom))]"
                : "fixed rounded-xl")
            }
            style={
              isNarrow
                ? undefined
                : {
                    top: menuPos.top,
                    left: menuPos.left,
                    width: menuPos.width,
                    maxHeight: "min(70vh, 440px)",
                  }
            }
          >
            {isNarrow && (
              <div className="flex justify-center pt-2.5 pb-1">
                <span className="block w-10 h-1 rounded-full bg-slate-300" aria-hidden />
              </div>
            )}

            <p className="px-4 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Share job
            </p>

            {canUseNativeShare() && (
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors text-left border-b border-slate-100"
                onClick={() => {
                  setOpen(false);
                  handleNativeShare();
                }}
              >
                <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Share2 size={18} />
                </span>
                Share via device…
              </button>
            )}

            <div className="py-1.5 max-h-[55vh] overflow-y-auto">
              {PLATFORMS.map((platform) => {
                const Icon = platform.Icon;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    onClick={() => handlePlatform(platform)}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ background: platform.color }}
                      aria-hidden
                    >
                      {platform.id === "copy" && copied ? (
                        <Check size={18} color="#fff" />
                      ) : (
                        <Icon size={18} />
                      )}
                    </span>
                    <span className="font-medium text-slate-800">
                      {platform.id === "copy" && copied ? "Copied!" : platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        ref={btnRef}
        type="button"
        className={buttonClassName || defaultBtnClass}
        onClick={handleShareClick}
        aria-label="Share job"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Share2 size={iconSize} />
        {!iconOnly && label}
      </button>
      {menu}
    </div>
  );
}
