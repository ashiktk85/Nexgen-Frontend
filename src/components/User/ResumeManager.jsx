import { FileText, ExternalLink, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

function getFileNameFromUrl(url = "") {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() || "resume.pdf";
    return decodeURIComponent(last);
  } catch {
    return url?.split("/").pop() || "resume.pdf";
  }
}

export default function ResumeManager({
  resumes = [],
  maxResumes = 3,
  onUploadClick,
  onOpen,
  onRemove,
}) {
  const list = Array.isArray(resumes) ? resumes.filter(Boolean) : resumes ? [resumes] : [];
  const items = list
    .map((r) => {
      if (!r) return null;
      if (typeof r === "string") return { url: r, name: null };
      if (typeof r === "object" && r.url) return { url: r.url, name: r.name || null };
      return null;
    })
    .filter(Boolean);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Your resumes</p>
          <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#94a3b8" }}>
            Up to {maxResumes} resumes. Choose one when applying.
          </p>
        </div>
        <button
          className="pp-btn pp-btn-primary"
          style={{ fontSize: 12 }}
          onClick={onUploadClick}
          disabled={list.length >= maxResumes}
          title={list.length >= maxResumes ? `Max ${maxResumes} resumes` : "Upload resume"}
        >
          Upload PDF
        </button>
      </div>

      {items.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, idx) => (
            <motion.div
              key={`${item.url}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pp-resume-card"
              style={{ cursor: "default" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={20} style={{ color: "#6366f1" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name || getFileNameFromUrl(item.url)}
                </p>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "3px 0 0" }}>PDF Document</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="pp-btn pp-btn-outline"
                  style={{ fontSize: 11, padding: "7px 10px" }}
                  onClick={() => onOpen?.(item.url)}
                  title="Open resume"
                >
                  <ExternalLink size={14} /> Open
                </button>
                <button className="pp-btn-ghost-red" onClick={() => onRemove?.(item.url)} title="Remove resume">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="pp-empty">
          <FileText size={40} style={{ color: "#c7d2fe", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No resumes uploaded</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px" }}>
            Upload a PDF resume to reuse when applying for jobs.
          </p>
          <button className="pp-btn pp-btn-primary" onClick={onUploadClick}>
            Upload Resume
          </button>
        </div>
      )}
    </div>
  );
}

