import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBuilding } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Countries_Dataset from "../../../data/Countries_Dataset.json";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, FileText, Upload,
  PenLine, Send, CheckCircle2, X, Building2, ArrowLeft
} from "lucide-react";

/* ─── Kerala districts ─── */
const KeralaDistricts = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
  "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
  "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

/* ─── Inject styles ─── */
if (!document.getElementById("ja-styles")) {
  const s = document.createElement("style");
  s.id = "ja-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .ja-root { font-family:'DM Sans',sans-serif; }
    .ja-root h1,.ja-root h2,.ja-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    .ja-input {
      width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; box-sizing:border-box;
    }
    .ja-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }
    .ja-input.error { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,.1); }
    .ja-input:disabled { opacity:.55; cursor:not-allowed; }

    .ja-textarea {
      width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; resize:vertical;
      min-height:140px; box-sizing:border-box; line-height:1.6;
    }
    .ja-textarea:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }

    .ja-label {
      display:block; font-size:11px; font-weight:700; color:#64748b;
      letter-spacing:.07em; text-transform:uppercase; margin-bottom:7px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .ja-error { font-size:11.5px; color:#ef4444; margin-top:5px; display:flex; align-items:center; gap:4px; }

    .ja-drop-zone {
      border:2px dashed #c7d2fe; border-radius:12px; padding:22px 16px;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:8px; cursor:pointer; transition:all .2s; background:#fafbff;
    }
    .ja-drop-zone:hover { border-color:#6366f1; background:#eef2ff; }

    .ja-file-chip {
      display:flex; align-items:center; gap:10px; background:#eef2ff;
      border:1.5px solid #c7d2fe; border-radius:10px; padding:10px 14px;
    }

    .ja-submit-btn {
      width:100%; padding:14px; border:none; border-radius:12px; cursor:pointer;
      font-size:15px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#4f46e5,#6366f1);
      color:#fff; box-shadow:0 6px 20px rgba(99,102,241,.35);
      display:flex; align-items:center; justify-content:center; gap:8px;
      transition:all .2s ease;
    }
    .ja-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,.4); }
    .ja-submit-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

    .ja-section-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:16px; padding:24px;
    }

    .ja-section-title {
      display:flex; align-items:center; gap:9px; margin:0 0 20px;
    }
    .ja-section-icon {
      width:32px; height:32px; border-radius:9px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }

    /* MUI override to match design system */
    .ja-root .MuiOutlinedInput-root { border-radius:10px !important; font-family:'DM Sans',sans-serif !important; font-size:13.5px !important; background:#f8fafc; }
    .ja-root .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color:#c7d2fe !important; }
    .ja-root .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color:#6366f1 !important; border-width:1.5px !important; }
    .ja-root .MuiInputLabel-root.Mui-focused { color:#6366f1 !important; }
    .ja-root .MuiInputBase-input { padding:11px 14px !important; }

    .ja-step-dot {
      width:28px; height:28px; border-radius:50%; display:flex; align-items:center;
      justify-content:center; font-size:12px; font-weight:700;
      font-family:'Plus Jakarta Sans',sans-serif; flex-shrink:0;
    }

    .ja-spinner { width:20px; height:20px; border-radius:50%; border:2.5px solid rgba(255,255,255,.4); border-top-color:#fff; animation:ja-spin .65s linear infinite; }
    @keyframes ja-spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(s);
}

/* ─── Variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .1 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .38, ease: 'easeOut' } } };

/* ─── FieldLabel ─── */
const FL = ({ children, required }) => (
  <label className="ja-label">{children}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}</label>
);

/* ═══════════════════════════════════════ */
const JobApplication = () => {
  const { id: jobId } = useParams();
  const location = useLocation();
  const { jobTitle, companyName, phone, companyLocation, employerId } = location.state || {};
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.seekerInfo || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);

  React.useEffect(() => {
    const loadResumes = async () => {
      try {
        if (!userData?.userId) return;
        const res = await userAxiosInstance.get(`/user-profile/${userData.userId}`);
        const r = res?.data?.userData?.resume;
        const list = Array.isArray(r) ? r.filter(Boolean) : r ? [r] : [];
        const items = list
          .map((x) => {
            if (!x) return null;
            if (typeof x === "string") return { url: x, name: null };
            if (typeof x === "object" && x.url) return { url: x.url, name: x.name || null };
            return null;
          })
          .filter(Boolean);
        setSavedResumes(items.slice(0, 3));
      } catch {
        setSavedResumes([]);
      }
    };
    loadResumes();
  }, [userData?.userId]);

  React.useEffect(() => {
    const applyCheck = async () => {
      if (userData?.userId && jobId) {
        try {
          const { data } = await userAxiosInstance.get(`/job-details/${jobId}`, {
            params: { userId: userData.userId }
          });
          if (data?.jobDetails?.applied) {
            toast.info("You have already applied for this job.");
            navigate(`/job-details/${jobId}`, { replace: true });
          }
        } catch (error) {
          console.error("Error checking job application status", error);
        }
      }
    };
    applyCheck();
  }, [jobId, userData?.userId, navigate]);

  const formik = useFormik({
    initialValues: {
      name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      email: userData.email || "",
      phone: userData.phone || "",
      countryCode: "+91",
      state: "Kerala",
      district: "",
      resume: null,
      resumeUrl: "",
      additionalDoc: null,
      coverLetter: "",
      employerId,
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email format";
      if (!values.phone) errors.phone = "Phone number is required";
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          job_id: jobId,
          user_id: userData?.userId,
          name: values.name,
          email: values.email,
          location: values.district,
          phone: values.phone,
          resume: values.resume,
          resumeUrl: values.resumeUrl || "",
          coverLetter: values.coverLetter,
          employerId: values.employerId,
        };
        const { data } = await userAxiosInstance.post("/submit-application", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.status) {
          toast.success("Application submitted successfully!");
          navigate("/application-submitted");
        }
      } catch (error) {
        toast.warning(error?.response?.data?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleResumeUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      formik.setFieldValue("resumeUrl", "");
      formik.setFieldValue("resume", f);
    }
  };
  const handleAdditionalDocs = (e) => { const f = e.target.files[0]; if (f) formik.setFieldValue("additionalDoc", f); };

  return (
    <div className="ja-root" style={{ background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)", padding: "110px 0 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(99,102,241,.2)", filter: "blur(55px)" }} />
        <div style={{ position: "absolute", bottom: -30, left: "35%", width: 160, height: 160, borderRadius: "50%", background: "rgba(167,139,250,.15)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.2)", color: "#e2e8f0", padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 18, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={16} color="#a5b4fc" />
              </div>
              <span style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>{companyName}</span>
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              {jobTitle}
            </h1>
            <p style={{ color: "#c7d2fe", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={13} /> {companyLocation}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div style={{ maxWidth: 1060, margin: "-44px auto 48px", padding: "0 16px", position: "relative", zIndex: 2 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Progress indicator */}
          <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20, background: "#fff", borderRadius: 14, border: "1.5px solid #e8edf5", padding: "14px 20px", overflow: "hidden" }}>
            {[
              { n: 1, label: "Personal Info" },
              { n: 2, label: "Location" },
              { n: 3, label: "Documents" },
              { n: 4, label: "Cover Letter" },
            ].map(({ n, label }, i) => (
              <React.Fragment key={n}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="ja-step-dot" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "#fff" }}>{n}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5", fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: "nowrap" }}>{label}</span>
                </div>
                {i < 3 && <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,#c7d2fe,#e0e7ff)", margin: "0 8px", borderRadius: 2 }} />}
              </React.Fragment>
            ))}
          </motion.div>

          <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Section 1: Personal Info ── */}
            <motion.div variants={itemVariants} className="ja-section-card">
              <div className="ja-section-title">
                <div className="ja-section-icon" style={{ background: "#eef2ff" }}><User size={16} style={{ color: "#6366f1" }} /></div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Personal Information</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                {/* Name */}
                <div>
                  <FL required>Full Name</FL>
                  <input
                    name="name" type="text" value={formik.values.name}
                    onChange={formik.handleChange}
                    className={`ja-input ${formik.errors.name ? "error" : ""}`}
                    placeholder="Your full name"
                  />
                  {formik.errors.name && <p className="ja-error"><X size={11} />{formik.errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <FL required>Email Address</FL>
                  <input
                    name="email" type="email" value={formik.values.email}
                    onChange={formik.handleChange}
                    className={`ja-input ${formik.errors.email ? "error" : ""}`}
                    placeholder="you@example.com"
                  />
                  {formik.errors.email && <p className="ja-error"><X size={11} />{formik.errors.email}</p>}
                </div>
              </div>

              {/* Phone row */}
              <div style={{ marginTop: 16 }}>
                <FL required>Phone Number</FL>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 170, flexShrink: 0 }}>
                    <Autocomplete
                      options={Countries_Dataset} autoHighlight
                      value={Countries_Dataset.find(o => o.dial_code === formik.values.countryCode) || null}
                      onChange={(_, v) => formik.setFieldValue("countryCode", v ? v.dial_code : "+91")}
                      getOptionLabel={(o) => `${o.dial_code} (${o.name})`}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ "& > img": { mr: 1.5, flexShrink: 0 } }} {...props}>
                          <img loading="lazy" width="18" src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt={option.name} />
                          {option.dial_code}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} label="Code" variant="outlined" size="small" />}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      name="phone" type="tel" value={formik.values.phone}
                      onChange={formik.handleChange}
                      className={`ja-input ${formik.errors.phone ? "error" : ""}`}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                {formik.errors.phone && <p className="ja-error"><X size={11} />{formik.errors.phone}</p>}
              </div>
            </motion.div>

            {/* ── Section 2: Location ── */}
            <motion.div variants={itemVariants} className="ja-section-card">
              <div className="ja-section-title">
                <div className="ja-section-icon" style={{ background: "#f0fdf4" }}><MapPin size={16} style={{ color: "#16a34a" }} /></div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Location</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                <div>
                  <FL>State</FL>
                  <input value="Kerala" disabled className="ja-input" />
                </div>
                <div>
                  <FL>District</FL>
                  <Autocomplete
                    options={KeralaDistricts} value={selectedDistrict}
                    onChange={(_, v) => { setSelectedDistrict(v); formik.setFieldValue("district", v); }}
                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select district" size="small" />}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── Section 3: Documents ── */}
            <motion.div variants={itemVariants} className="ja-section-card">
              <div className="ja-section-title">
                <div className="ja-section-icon" style={{ background: "#fffbeb" }}><FileText size={16} style={{ color: "#d97706" }} /></div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Documents</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {/* Resume */}
                <div>
                  <FL>Resume <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#94a3b8", fontSize: 10 }}>(PDF, DOC — optional)</span></FL>
                  {savedResumes?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                        Use a saved resume (from Profile)
                      </div>
                      <select
                        value={formik.values.resumeUrl || ""}
                        onChange={(e) => {
                          formik.setFieldValue("resume", null);
                          formik.setFieldValue("resumeUrl", e.target.value);
                        }}
                        className="ja-input"
                        style={{ height: 42 }}
                      >
                        <option value="">— Select resume —</option>
                        {savedResumes.map((r, i) => (
                          <option key={`${r.url}-${i}`} value={(r.url || "").trim()}>
                            {r.name || `Resume ${i + 1}`}
                          </option>
                        ))}
                      </select>
                      {formik.values.resumeUrl && (
                        <div style={{ marginTop: 6 }}>
                          <button
                            type="button"
                            onClick={() => {
                              const u = (formik.values.resumeUrl || "").trim();
                              if (!u) return;
                              const base = import.meta.env.VITE_BACKEND_URL || "https://api.techpath.in";
                              const proxyUrl = `${base}/resume/view?userId=${encodeURIComponent(userData?.userId || "")}&resumeUrl=${encodeURIComponent(u)}&disposition=inline`;
                              window.open(proxyUrl, "_blank", "noopener,noreferrer");
                            }}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#4f46e5", fontSize: 12, fontWeight: 700 }}
                          >
                            Open selected resume
                          </button>
                        </div>
                      )}
                      <div style={{ height: 1, background: "#eef2ff", marginTop: 12 }} />
                    </div>
                  )}
                  <AnimatePresence mode="wait">
                    {formik.values.resume ? (
                      <motion.div key="resume-chip" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="ja-file-chip">
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={16} style={{ color: "#6366f1" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formik.values.resume.name}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Resume</p>
                        </div>
                        <button type="button" onClick={() => formik.setFieldValue("resume", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center", borderRadius: 6 }}
                          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                          <X size={14} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.label key="resume-drop" htmlFor="resume" className="ja-drop-zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Upload size={17} style={{ color: "#6366f1" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>Upload a new resume</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>PDF, DOC, DOCX</span>
                      </motion.label>
                    )}
                  </AnimatePresence>
                  <input type="file" id="resume" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: "none" }} />
                </div>

                {/* Additional doc */}
                <div>
                  <FL>Additional File <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#94a3b8", fontSize: 10 }}>(optional)</span></FL>
                  <AnimatePresence mode="wait">
                    {formik.values.additionalDoc ? (
                      <motion.div key="doc-chip" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="ja-file-chip">
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={16} style={{ color: "#d97706" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formik.values.additionalDoc.name}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Document</p>
                        </div>
                        <button type="button" onClick={() => formik.setFieldValue("additionalDoc", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center", borderRadius: 6 }}
                          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                          <X size={14} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.label key="doc-drop" htmlFor="additionalFile" className="ja-drop-zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Upload size={17} style={{ color: "#d97706" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#d97706" }}>Browse file</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>PDF, DOC, DOCX</span>
                      </motion.label>
                    )}
                  </AnimatePresence>
                  <input type="file" id="additionalFile" accept=".pdf,.doc,.docx" onChange={handleAdditionalDocs} style={{ display: "none" }} />
                </div>
              </div>
            </motion.div>

            {/* ── Section 4: Cover Letter ── */}
            <motion.div variants={itemVariants} className="ja-section-card">
              <div className="ja-section-title">
                <div className="ja-section-icon" style={{ background: "#fdf4ff" }}><PenLine size={16} style={{ color: "#9333ea" }} /></div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Cover Letter <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, fontFamily: "'DM Sans',sans-serif" }}>(optional)</span></h2>
              </div>
              <textarea
                name="coverLetter"
                value={formik.values.coverLetter}
                onChange={formik.handleChange}
                className="ja-textarea"
                placeholder="Write a brief note about why you're a great fit for this role…"
              />
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0", textAlign: "right" }}>
                {formik.values.coverLetter.length} characters
              </p>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div variants={itemVariants}>
              <button type="submit" className="ja-submit-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="ja-spinner" />Submitting…</>
                  : <><Send size={16} />Submit Application</>
                }
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
                By submitting, you agree to share your information with the employer.
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JobApplication;