import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Mail, Phone, Info, MapPin,
  Linkedin, Twitter, Facebook, Pencil, ExternalLink, Building2
} from "lucide-react";

/* ─── Inject styles once ─── */
if (!document.getElementById("cp-styles")) {
  const s = document.createElement("style");
  s.id = "cp-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .cp-root { font-family:'DM Sans',sans-serif; }
    .cp-root h1,.cp-root h2,.cp-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    .cp-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:18px;
      overflow:hidden; transition:box-shadow .22s,border-color .22s,transform .22s;
      margin-bottom:18px;
    }
    .cp-card:hover { box-shadow:0 10px 36px rgba(79,70,229,.09); border-color:#c7d2fe; transform:translateY(-2px); }

    .cp-edit-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:7px 14px; border-radius:9px; border:1.5px solid #e2e8f0;
      background:#fff; color:#475569; font-size:12px; font-weight:600;
      cursor:pointer; transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
    }
    .cp-edit-btn:hover { background:#eef2ff; border-color:#c7d2fe; color:#4f46e5; }

    .cp-info-row {
      display:flex; align-items:flex-start; gap:10px;
      padding:10px 0; border-bottom:1px solid #f8fafc;
    }
    .cp-info-row:last-child { border-bottom:none; }
    .cp-info-icon {
      width:30px; height:30px; border-radius:8px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center; margin-top:1px;
    }

    .cp-social-btn {
      display:inline-flex; align-items:center; justify-content:center;
      width:36px; height:36px; border-radius:10px; border:1.5px solid #e2e8f0;
      background:#fff; transition:all .18s; text-decoration:none; cursor:pointer;
    }

    .cp-avatar {
      width:72px; height:72px; border-radius:16px; object-fit:cover;
      border:2px solid #e0e7ff; box-shadow:0 4px 14px rgba(99,102,241,.18); flex-shrink:0;
    }
    .cp-avatar-fallback {
      width:72px; height:72px; border-radius:16px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:26px; font-weight:800; color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 4px 14px rgba(99,102,241,.22);
    }
    .cp-about {
      font-size:13px; color:#475569; line-height:1.65;
      display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .cp-empty {
      text-align:center; padding:60px 24px;
      border:2px dashed #e2e8f0; border-radius:16px; background:#fafbff;
    }
  `;
  document.head.appendChild(s);
}

/* ─── Avatar gradients ─── */
const getGrad = (ch = "C") => {
  const gs = ["linear-gradient(135deg,#6366f1,#818cf8)", "linear-gradient(135deg,#0ea5e9,#38bdf8)", "linear-gradient(135deg,#f59e0b,#fbbf24)", "linear-gradient(135deg,#10b981,#34d399)", "linear-gradient(135deg,#ec4899,#f472b6)", "linear-gradient(135deg,#8b5cf6,#a78bfa)"];
  return gs[((ch.toUpperCase().charCodeAt(0) - 65) % gs.length + gs.length) % gs.length];
};

/* ─── Animation variants ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: .4, delay: i * .1 } }),
  exit: { opacity: 0, y: 12, transition: { duration: .25 } },
};

/* ─── Info row helper ─── */
const InfoRow = ({ icon, iconBg, iconColor, label, value, isLink }) => (
  <div className="cp-info-row">
    <div className="cp-info-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: ".07em", textTransform: "uppercase", margin: "0 0 2px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        {label}
      </p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13.5, fontWeight: 500, color: "#6366f1", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, wordBreak: "break-all" }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        >
          {value} <ExternalLink size={11} style={{ flexShrink: 0 }} />
        </a>
      ) : (
        <p style={{ fontSize: 13.5, fontWeight: 500, color: value ? "#1e293b" : "#94a3b8", margin: 0, wordBreak: "break-word", lineHeight: 1.5 }}>
          {value || "Not specified"}
        </p>
      )}
    </div>
  </div>
);

/* ─── Social button ─── */
const SocialBtn = ({ href, icon, hoverBg, hoverColor, hoverBorder, label }) => {
  if (!href) return null;
  return (
    <motion.a
      href={href} target="_blank" rel="noopener noreferrer"
      className="cp-social-btn"
      title={label}
      initial={{ opacity: 0, scale: .8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: .93 }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = hoverBorder; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = ""; }}
    >
      {icon}
    </motion.a>
  );
};

/* ════════════════════════════════════════ */
const CompanyProfile = ({ companies, openModal, closeModal, modalState, selectedComp, setSelectedComp }) => {
  const navigate = useNavigate();

  const handleEditClick = (company) => {
    navigate(`/employer/addCompany/${company._id}`, { state: { company } });
  };

  if (!companies || companies.length === 0) {
    return (
      <div className="cp-root">
        <div className="cp-empty">
          <Building2 size={44} style={{ color: "#c7d2fe", margin: "0 auto 12px", display: "block" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No companies added</h3>
          <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Add your shop profile to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-root">
      <AnimatePresence>
        {companies.map((company, index) => {
          const initial = company.companyName?.charAt(0) || "C";
          return (
            <motion.div
              key={company._id}
              className="cp-card"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* ── Top accent bar ── */}
              <div style={{ height: 3, background: "linear-gradient(90deg,#6366f1,#a5b4fc)" }} />

              <div style={{ padding: "22px 24px" }}>

                {/* ── Header row ── */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  {/* Avatar: first letter of shop */}
                  <div className="cp-avatar-fallback" style={{ background: getGrad(initial) }}>
                    {initial}
                  </div>

                  {/* Name + actions */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                          {company.companyName}
                        </h2>
                        {company.address && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                            <MapPin size={12} style={{ color: "#ec4899" }} />{company.address}
                          </span>
                        )}
                      </div>
                      <motion.button
                        className="cp-edit-btn"
                        onClick={() => handleEditClick(company)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                      >
                        <Pencil size={12} /> Edit
                      </motion.button>
                    </div>

                    {/* About blurb */}
                    {company.about && (
                      <p className="cp-about" style={{ marginTop: 10 }}>
                        {company.about}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Divider ── */}
                <div style={{ height: "1.5px", background: "linear-gradient(90deg,#e0e7ff,transparent)", marginBottom: 16 }} />

                {/* ── Info grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "0 32px" }}>
                  <div>
                    <InfoRow
                      icon={<Globe size={14} style={{ color: "#6366f1" }} />}
                      iconBg="#eef2ff" label="Website" value={company.webSite} isLink
                    />
                    <InfoRow
                      icon={<Mail size={14} style={{ color: "#0ea5e9" }} />}
                      iconBg="#f0f9ff" label="Email" value={company.email}
                    />
                    <InfoRow
                      icon={<Phone size={14} style={{ color: "#16a34a" }} />}
                      iconBg="#f0fdf4" label="Phone" value={company.phone}
                    />
                  </div>
                  <div>
                    <InfoRow
                      icon={<MapPin size={14} style={{ color: "#ec4899" }} />}
                      iconBg="#fdf4ff" label="Address" value={company.address}
                    />
                    <InfoRow
                      icon={<Info size={14} style={{ color: "#f59e0b" }} />}
                      iconBg="#fffbeb" label="About" value={company.about}
                    />
                  </div>
                </div>

                {/* ── Social links ── */}
                {(company.socialLinks?.linkedin || company.socialLinks?.twitter || company.socialLinks?.facebook) && (
                  <>
                    <div style={{ height: "1.5px", background: "linear-gradient(90deg,#e0e7ff,transparent)", margin: "16px 0 14px" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".07em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans',sans-serif", marginRight: 4 }}>
                        Socials
                      </span>
                      <SocialBtn
                        href={company.socialLinks?.linkedin}
                        label="LinkedIn"
                        icon={<Linkedin size={16} />}
                        hoverBg="#eff6ff" hoverColor="#2563eb" hoverBorder="#bfdbfe"
                      />
                      <SocialBtn
                        href={company.socialLinks?.twitter}
                        label="Twitter / X"
                        icon={<Twitter size={16} />}
                        hoverBg="#eff6ff" hoverColor="#0ea5e9" hoverBorder="#bae6fd"
                      />
                      <SocialBtn
                        href={company.socialLinks?.facebook}
                        label="Facebook"
                        icon={<Facebook size={16} />}
                        hoverBg="#eff6ff" hoverColor="#1d4ed8" hoverBorder="#bfdbfe"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CompanyProfile;