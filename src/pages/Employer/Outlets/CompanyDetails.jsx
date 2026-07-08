import { useEffect, useRef, useState } from "react";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EditProfileModal from "@/components/Employer/EditProfileModal";
import { updateEmployer } from "@/redux/actions/EmployerAction";
import CompanyProfile from "@/components/Employer/CompanyProfile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Plus, ShieldCheck, ShieldAlert,
  Mail, Phone, MapPin, FileText, Linkedin,
  Twitter, Facebook, Briefcase, Building2, ExternalLink
} from "lucide-react";

/* ─── Inject styles once ─── */
if (!document.getElementById("cd-styles")) {
  const s = document.createElement("style");
  s.id = "cd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .cd-root { font-family:'DM Sans',sans-serif; }
    .cd-root h1,.cd-root h2,.cd-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    .cd-section {
      background:#fff; border:1.5px solid #e8edf5; border-radius:18px;
      overflow:hidden; margin-bottom:20px;
      transition:box-shadow .2s, border-color .2s;
    }
    .cd-section:hover { box-shadow:0 8px 28px rgba(79,70,229,.07); border-color:#c7d2fe; }

    .cd-section-header {
      display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;
      padding:14px 16px; border-bottom:1.5px solid #f1f5f9;
    }
    @media (min-width:640px) {
      .cd-section-header { padding:18px 24px; }
    }
    .cd-section-title {
      display:flex; align-items:center; gap:9px; margin:0;
      font-size:15px; font-weight:700; color:#0f172a;
    }
    .cd-section-icon {
      width:30px; height:30px; border-radius:8px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
    }

    /* Info rows */
    .cd-info-row {
      display:flex; align-items:flex-start; gap:10px;
      padding:10px 0; border-bottom:1px solid #f8fafc;
    }
    .cd-info-row:last-child { border-bottom:none; padding-bottom:0; }
    .cd-info-icon {
      width:30px; height:30px; border-radius:8px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center; margin-top:1px;
    }
    .cd-info-label {
      font-size:10px; font-weight:700; color:#94a3b8;
      letter-spacing:.07em; text-transform:uppercase; margin:0 0 2px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .cd-info-value { font-size:13.5px; font-weight:500; color:#1e293b; margin:0; line-height:1.5; word-break:break-word; }
    .cd-info-empty { font-size:13.5px; color:#94a3b8; margin:0; font-style:italic; }

    /* Edit button */
    .cd-edit-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:7px 14px; border-radius:9px; border:1.5px solid #e2e8f0;
      background:#fff; color:#475569; font-size:12px; font-weight:600;
      cursor:pointer; transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
    }
    .cd-edit-btn:hover { background:#eef2ff; border-color:#c7d2fe; color:#4f46e5; }

    /* CTA buttons */
    .cd-primary-btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 18px; border-radius:10px; border:none; cursor:pointer;
      font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff;
      box-shadow:0 4px 12px rgba(99,102,241,.3); transition:all .18s;
      text-decoration:none;
    }
    .cd-primary-btn:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(99,102,241,.38); }

    /* Status badge */
    .cd-status-badge {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 10px; border-radius:999px;
      font-size:11.5px; font-weight:600;
      font-family:'Plus Jakarta Sans',sans-serif;
    }

    /* Social button */
    .cd-social-btn {
      display:inline-flex; align-items:center; justify-content:center;
      width:34px; height:34px; border-radius:9px; border:1.5px solid #e2e8f0;
      background:#fff; transition:all .18s; text-decoration:none; cursor:pointer; color:#64748b;
    }

    /* Job mini card */
    .cd-job-card {
      background:#f8fafc; border:1.5px solid #e8edf5; border-radius:12px;
      padding:14px 16px; transition:all .18s ease;
    }
    .cd-job-card:hover { border-color:#c7d2fe; background:#fff; box-shadow:0 4px 14px rgba(99,102,241,.09); }

    /* Avatar */
    .cd-avatar {
      width:64px; height:64px; border-radius:14px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:24px; font-weight:800; color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 4px 14px rgba(99,102,241,.22);
    }
  `;
  document.head.appendChild(s);
}

/* ─── Gradient for avatar ─── */
const getGrad = (ch = "E") => {
  const gs = ["linear-gradient(135deg,#6366f1,#818cf8)", "linear-gradient(135deg,#0ea5e9,#38bdf8)", "linear-gradient(135deg,#f59e0b,#fbbf24)", "linear-gradient(135deg,#10b981,#34d399)", "linear-gradient(135deg,#ec4899,#f472b6)"];
  return gs[((ch.toUpperCase().charCodeAt(0) - 65) % gs.length + gs.length) % gs.length];
};

/* ─── Variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .1 } } };
const sectionVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: .38, ease: "easeOut" } } };
const cardVariants = {
  hidden: { opacity: 0, scale: .97 },
  visible: (i) => ({ opacity: 1, scale: 1, transition: { duration: .3, delay: i * .06 } }),
  exit: { opacity: 0, scale: .95, transition: { duration: .2 } },
};

/* ─── Helpers ─── */
const IR = ({ icon, iconBg, label, value, isLink }) => (
  <div className="cd-info-row">
    <div className="cd-info-icon" style={{ background: iconBg }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p className="cd-info-label">{label}</p>
      {isLink && value
        ? <a href={value} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13.5, color: "#6366f1", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, wordBreak: "break-all" }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        >{value} <ExternalLink size={11} /></a>
        : <p className={value ? "cd-info-value" : "cd-info-empty"}>{value || "Not specified"}</p>
      }
    </div>
  </div>
);

const SocialBtn = ({ href, icon, hoverBg, hoverColor, hoverBorder, title }) => {
  if (!href) return null;
  return (
    <motion.a
      href={href} target="_blank" rel="noopener noreferrer"
      className="cd-social-btn" title={title}
      initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: .93 }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = hoverBorder; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
    >
      {icon}
    </motion.a>
  );
};

/* ════════════════════════════════════════════ */
export default function CompanyDetails() {
  const jobsRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalState, setModalState] = useState({ editProfile: false, editCompany: false });
  const [selectedComp, setSelectedComp] = useState(null);
  const employer = useSelector((state) => state.employer.employer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await employerAxiosInstance.get(`/job-list/${employer?.employerId}`); setJobs(data.jobPosts); }
      catch (e) { console.error(e); }
    };
    fetch();
  }, [employer?.employerId]);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await employerAxiosInstance.get(`/company-list/${employer?.employerId}`); setCompanies(data); }
      catch (e) { console.error(e); }
    };
    fetch();
  }, [employer?.employerId]);

  const openModal = (t) => setModalState(p => ({ ...p, [t]: true }));
  const closeModal = (t) => setModalState(p => ({ ...p, [t]: false }));

  const handleSaveProfile = async (updatedEmp) => {
    try {
      const result = await dispatch(updateEmployer(updatedEmp));
      if (updateEmployer.fulfilled.match(result)) closeModal("editProfile");
    } catch (e) { console.error(e); }
  };

  const initial = employer?.name?.charAt(0) || "E";

  return (
    <div className="cd-root" style={{ background: "#f1f5f9", minHeight: "100vh", padding: "16px 12px 40px" }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Page heading ── */}
        <motion.div variants={sectionVariants} style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Employer Dashboard
          </p>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
            Profile &amp; Shops
          </h1>
        </motion.div>

        {/* ══ Employer Profile Section ══ */}
        <motion.div variants={sectionVariants} className="cd-section">
          {/* Header */}
          <div className="cd-section-header">
            <h3 className="cd-section-title">
              <div className="cd-section-icon" style={{ background: "#eef2ff" }}>
                <Briefcase size={15} style={{ color: "#6366f1" }} />
              </div>
              Employer Profile
            </h3>
            <motion.button className="cd-edit-btn" onClick={() => openModal("editProfile")} whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}>
              <Pencil size={12} /> Edit Profile
            </motion.button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              {/* Avatar */}
              <div className="cd-avatar" style={{ background: getGrad(initial) }}>{initial}</div>

              {/* Name + status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 5 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                    {employer?.name?.toUpperCase()}
                  </h2>

                  {(() => {
                    const hasVerificationDocs =
                      !!employer?.ownerName ||
                      !!employer?.ownerAddress ||
                      !!employer?.aadharFront ||
                      !!employer?.aadharBack ||
                      !!employer?.certificate;
                    const verificationStatus =
                      employer?.isVerified ||
                      (hasVerificationDocs ? "Requested" : "NotVerified");

                    return (
                      <>
                  {/* Verified / Pending / Rejected / Unverified badge */}
                  {verificationStatus === "Verified" ? (
                    <motion.span
                      className="cd-status-badge"
                      style={{ background: "#eff8ff", color: "#0ea5e9", border: "1px solid #bae6fd" }}
                      title="Verified Employer"
                      whileHover={{ scale: 1.06 }}
                    >
                      <ShieldCheck size={12} /> Verified
                    </motion.span>
                  ) : verificationStatus === "Requested" ? (
                    <motion.span
                      className="cd-status-badge"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                      title="Verification pending"
                      whileHover={{ scale: 1.06 }}
                    >
                      <ShieldCheck size={12} /> Pending
                    </motion.span>
                  ) : verificationStatus === "Rejected" ? (
                    <Link to="/employer/account" style={{ textDecoration: "none" }}>
                      <motion.span
                        className="cd-status-badge"
                        style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer" }}
                        title="Verification rejected — resubmit"
                        whileHover={{ scale: 1.06 }}
                      >
                        <ShieldAlert size={12} /> Rejected
                      </motion.span>
                    </Link>
                  ) : (
                    <Link to="/employer/account" style={{ textDecoration: "none" }}>
                      <motion.span
                        className="cd-status-badge"
                        style={{ background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", cursor: "pointer" }}
                        title="Complete verification"
                        whileHover={{ scale: 1.06 }}
                      >
                        <ShieldAlert size={12} /> Unverified
                      </motion.span>
                    </Link>
                  )}
                      </>
                    );
                  })()}

                  {/* Active / Blocked */}
                  <span className="cd-status-badge" style={employer.isBlocked
                    ? { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }
                    : { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                  }>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: employer.isBlocked ? "#dc2626" : "#22c55e" }} />
                    {employer.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* About blurb */}
                {employer.about && (
                  <p style={{ fontSize: 13.5, color: "#475569", margin: 0, lineHeight: 1.6 }}>{employer.about}</p>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: "0 24px", marginBottom: 16 }}>
              <div>
                <IR icon={<Mail size={14} style={{ color: "#0ea5e9" }} />} iconBg="#f0f9ff" label="Email" value={employer.email} />
                <IR icon={<Phone size={14} style={{ color: "#16a34a" }} />} iconBg="#f0fdf4" label="Phone" value={employer.phone} />
              </div>
              <div>
                <IR icon={<MapPin size={14} style={{ color: "#ec4899" }} />} iconBg="#fdf4ff" label="Location" value={employer.location} />
                <IR icon={<FileText size={14} style={{ color: "#f59e0b" }} />} iconBg="#fffbeb" label="About" value={employer.about} />
              </div>
            </div>

            {/* Social links */}
            {(employer.socialLinks?.linkedin || employer.socialLinks?.twitter || employer.socialLinks?.facebook) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1.5px solid #f1f5f9" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".07em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans',sans-serif", marginRight: 4 }}>Socials</span>
                <SocialBtn href={employer.socialLinks?.linkedin} title="LinkedIn" icon={<Linkedin size={15} />} hoverBg="#eff6ff" hoverColor="#2563eb" hoverBorder="#bfdbfe" />
                <SocialBtn href={employer.socialLinks?.twitter} title="Twitter" icon={<Twitter size={15} />} hoverBg="#f0f9ff" hoverColor="#0ea5e9" hoverBorder="#bae6fd" />
                <SocialBtn href={employer.socialLinks?.facebook} title="Facebook" icon={<Facebook size={15} />} hoverBg="#eff6ff" hoverColor="#1d4ed8" hoverBorder="#bfdbfe" />
              </div>
            )}
          </div>
        </motion.div>

        {/* ══ Company Section ══ */}
        <motion.div variants={sectionVariants} className="cd-section">
          <div className="cd-section-header">
            <h3 className="cd-section-title">
              <div className="cd-section-icon" style={{ background: "#fdf4ff" }}>
                <Building2 size={15} style={{ color: "#a855f7" }} />
              </div>
              {companies.length > 0 ? "Shop Details" : "Add Your Shop"}
            </h3>
            {companies.length > 0 && (
              <Link to="/employer/addCompany" style={{ textDecoration: "none" }}>
                <motion.span className="cd-edit-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Plus size={12} /> Add Another
                </motion.span>
              </Link>
            )}
          </div>

          <div style={{ padding: "20px 24px" }}>
            {companies.length > 0 ? (
              <CompanyProfile
                companies={companies}
                openModal={openModal}
                closeModal={closeModal}
                modalState={modalState}
                selectedComp={selectedComp}
                setSelectedComp={setSelectedComp}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "36px 24px", border: "2px dashed #e2e8f0", borderRadius: 14, background: "#fafbff" }}
              >
                <Building2 size={40} style={{ color: "#c7d2fe", margin: "0 auto 10px", display: "block" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No shop added yet</h3>
                <p style={{ fontSize: 13.5, color: "#94a3b8", margin: "0 0 18px" }}>Add your shop profile to start attracting top candidates</p>
                <Link to="/employer/addCompany" className="cd-primary-btn">
                  <Plus size={13} /> Add Shop
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ══ Jobs Section ══ */}
        <motion.div variants={sectionVariants} className="cd-section" ref={jobsRef}>
          <div className="cd-section-header">
            <h3 className="cd-section-title">
              <div className="cd-section-icon" style={{ background: "#f0fdf4" }}>
                <Briefcase size={15} style={{ color: "#16a34a" }} />
              </div>
              Jobs
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#94a3b8", marginLeft: 6 }}>({jobs.length})</span>
            </h3>
            <Link to="/employer/create_job" className="cd-primary-btn" style={{ fontSize: 12, padding: "7px 14px" }}>
              <Plus size={13} /> Post Job
            </Link>
          </div>

          <div style={{ padding: "20px 24px" }}>
            {jobs.length > 0 ? (
              <motion.div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: 12 }}
                variants={containerVariants} initial="hidden" animate="visible"
              >
                <AnimatePresence>
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      className="cd-job-card"
                      custom={index}
                      variants={cardVariants}
                      initial="hidden" animate="visible" exit="exit"
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Briefcase size={15} style={{ color: "#6366f1" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            {job.jobTitle}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <MapPin size={11} style={{ color: "#ec4899", flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.city}</span>
                            <span style={{ color: "#e2e8f0" }}>·</span>
                            <span className="cd-status-badge" style={job.status === "open"
                              ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "1px 7px", fontSize: 11 }
                              : { background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", padding: "1px 7px", fontSize: 11 }
                            }>
                              {job.status === "open" ? "Active" : "Closed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: 13.5 }}>
                No jobs posted yet
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>

      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {modalState.editProfile && (
          <EditProfileModal
            employer={employer}
            open={modalState.editProfile}
            close={() => closeModal("editProfile")}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}