"use client";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ResumeManager from "@/components/User/ResumeManager";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit, Plus, FileText, Trash2, Check, X,
  User, GraduationCap, Briefcase, MapPin,
  Phone, Mail, Calendar, Camera, Upload,
  ChevronLeft,
} from "lucide-react";
import userAxiosInstance from "../../../config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { JOB_CATEGORIES, KERALA_DISTRICTS } from "@/constants/options";

function getResumeCount(resume) {
  const list = Array.isArray(resume) ? resume.filter(Boolean) : resume ? [resume] : [];
  return list.filter((r) => (typeof r === "string" ? r.trim() : r?.url)).length;
}

/* ─── Inject styles once ─── */
if (!document.getElementById("pp-styles")) {
  const s = document.createElement("style");
  s.id = "pp-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .pp-root { font-family:'DM Sans',sans-serif; }
    .pp-root h1,.pp-root h2,.pp-root h3,.pp-root h4 { font-family:'Plus Jakarta Sans',sans-serif; }

    /* Tabs */
    .pp-tab {
      display:flex; align-items:center; gap:6px;
      padding:9px 18px !important; border-radius:10px !important;
      font-size:13px !important; font-weight:600 !important;
      font-family:'Plus Jakarta Sans',sans-serif !important;
      cursor:pointer; transition:all .18s ease !important;
      color:#64748b !important; background:transparent !important; border:none !important;
    }
    .pp-tab[data-state="active"] {
      background:linear-gradient(135deg,#4f46e5,#6366f1) !important;
      color:#fff !important; box-shadow:0 4px 12px rgba(99,102,241,.3) !important;
    }
    .pp-tab:hover:not([data-state="active"]) { background:#f1f5f9 !important; color:#4f46e5 !important; }

    /* Cards */
    .pp-card {
      background:#fff; border:1.5px solid #e8edf5; border-radius:14px;
      padding:20px; transition:box-shadow .2s,transform .2s,border-color .2s;
    }
    .pp-card:hover { box-shadow:0 8px 28px rgba(79,70,229,.09); transform:translateY(-2px); border-color:#c7d2fe; }

    /* Info rows */
    .pp-info-cell {
      background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px;
      padding:14px 16px; transition:border-color .2s;
    }
    .pp-info-cell:hover { border-color:#c7d2fe; }

    /* Buttons */
    .pp-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:8px 18px; border-radius:10px; font-size:13px; font-weight:600;
      cursor:pointer; transition:all .18s ease; border:1.5px solid transparent;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .pp-btn-primary { background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,.3); }
    .pp-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
    .pp-btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .pp-btn-outline { background:#fff; color:#475569; border-color:#e2e8f0; }
    .pp-btn-outline:hover { background:#f8fafc; border-color:#c7d2fe; color:#4f46e5; }
    .pp-btn-ghost-red { background:none; border:none; color:#cbd5e1; padding:7px; border-radius:8px; cursor:pointer; transition:all .15s; display:flex; align-items:center; }
    .pp-btn-ghost-red:hover { background:#fef2f2; color:#ef4444; }
    .pp-btn-green { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; box-shadow:0 4px 12px rgba(34,197,94,.25); }
    .pp-btn-green:hover { opacity:.9; }

    /* Form inputs */
    .pp-input {
      width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none;
    }
    .pp-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }
    .pp-input.error { border-color:#ef4444; }
    .pp-label { display:block; font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:.07em; text-transform:uppercase; margin-bottom:6px; font-family:'Plus Jakarta Sans',sans-serif; }
    .pp-error { font-size:11.5px; color:#ef4444; margin-top:4px; }

    /* Timeline dot */
    .pp-timeline { position:relative; padding-left:20px; }
    .pp-timeline::before { content:''; position:absolute; left:6px; top:8px; bottom:8px; width:2px; background:linear-gradient(180deg,#6366f1,#a5b4fc); border-radius:2px; }
    .pp-timeline-dot { position:absolute; left:0; top:50%; transform:translateY(-50%); width:14px; height:14px; border-radius:50%; background:linear-gradient(135deg,#4f46e5,#6366f1); border:2px solid #fff; box-shadow:0 2px 6px rgba(99,102,241,.35); flex-shrink:0; }

    /* Year pill */
    .pp-year-pill {
      display:inline-flex;
      align-items:center;
      gap:4px;
      background:#eef2ff;
      color:#4f46e5;
      font-size:11px;
      font-weight:700;
      padding:3px 10px;
      border-radius:999px;
      font-family:'Plus Jakarta Sans',sans-serif;
      white-space:nowrap;
    }

    /* Avatar camera overlay */
    .pp-avatar-wrap { position:relative; display:inline-block; cursor:pointer; }
    .pp-avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,0); display:flex; align-items:center; justify-content:center; transition:background .2s; }
    .pp-avatar-wrap:hover .pp-avatar-overlay { background:rgba(0,0,0,.45); }
    .pp-avatar-wrap:hover .pp-cam-icon { opacity:1; }
    .pp-cam-icon { opacity:0; transition:opacity .2s; color:#fff; }

    /* Resume file card */
    .pp-resume-card { display:flex; align-items:center; gap:14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 18px; transition:border-color .2s; }
    .pp-resume-card:hover { border-color:#c7d2fe; }

    /* Spinner */
    .pp-spinner { width:40px; height:40px; border-radius:50%; border:3px solid #e0e7ff; border-top-color:#6366f1; animation:pp-spin .75s linear infinite; }
    @keyframes pp-spin { to { transform:rotate(360deg); } }

    /* Empty state */
    .pp-empty { text-align:center; padding:48px 24px; border:2px dashed #e2e8f0; border-radius:16px; }

    /* ─── Responsive tweaks ─── */
    @media (max-width: 640px) {
      .pp-header-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .pp-header-row > div {
        width: 100%;
      }
      .pp-header-row button.pp-btn {
        margin-top: 8px;
      }
      .pp-header-stats {
        width: 100%;
        justify-content: flex-start;
        gap: 24px;
      }
      .pp-dialog-grid-2 {
        grid-template-columns: 1fr !important;
      }
      /* Mobile tabs as settings-style list */
      .pp-tab {
        width: 100%;
        justify-content: space-between;
        border-radius: 12px !important;
        background: #fff !important;
        border: 1.5px solid #e2e8f0 !important;
      }
      .pp-tab + .pp-tab {
        margin-top: 6px;
      }
      .pp-tab[data-state="active"] {
        background: linear-gradient(135deg,#4f46e5,#6366f1) !important;
        color: #fff !important;
      }
      /* Back-to-top button on mobile */
      .pp-back-top-mobile {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 14px;
        font-size: 12px;
        font-weight: 600;
        color: #4f46e5;
        background: #e0e7ff;
        border-radius: 999px;
        padding: 6px 12px;
        border: none;
        cursor: pointer;
      }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Validation Schemas ─── */
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().min(2).max(50).required("First name is required"),
  lastName: Yup.string().min(2).max(50).required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^[0-9]{10,15}$/, "10-15 digits").required("Phone is required"),
  about: Yup.string().max(500),
  DOB: Yup.date().nullable(),
  location: Yup.string().max(100),
});
const EducationSchema = Yup.object().shape({
  qualification: Yup.string().min(2).max(100).required("Required"),
  institute: Yup.string().min(2).max(100).required("Required"),
  startYear: Yup.number().min(1900).max(new Date().getFullYear()).required("Required"),
  endYear: Yup.number().nullable().min(Yup.ref("startYear"), "Must be ≥ start year").max(new Date().getFullYear() + 10),
});
const ExperienceSchema = Yup.object().shape({
  jobTitle: Yup.string().min(2).max(100).required("Required"),
  company: Yup.string().min(2).max(100).required("Required"),
  startYear: Yup.number().min(1900).max(new Date().getFullYear()).required("Required"),
  endYear: Yup.number().nullable().min(Yup.ref("startYear"), "Must be ≥ start year").max(new Date().getFullYear() + 10),
});

/* ─── FormField ─── */
const FormField = ({ label, name, type = "text", placeholder, disabled = false }) => (
  <div>
    <label className="pp-label">{label}</label>
    <Field name={name}>
      {({ field, meta }) => (
        <>
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className={`pp-input ${meta.touched && meta.error ? "error" : ""}`}
            disabled={disabled}
          />
          <ErrorMessage name={name} component="p" className="pp-error" />
        </>
      )}
    </Field>
  </div>
);

const FormSelect = ({ label, name, placeholder, children }) => (
  <div>
    <label className="pp-label">{label}</label>
    <Field name={name}>
      {({ field, meta }) => (
        <>
          <select
            {...field}
            id={name}
            className={`pp-input ${meta.touched && meta.error ? "error" : ""}`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
          </select>
          <ErrorMessage name={name} component="p" className="pp-error" />
        </>
      )}
    </Field>
  </div>
);

/* ─── Avatar gradients ─── */
const getGrad = (ch = "A") => {
  const gs = ["linear-gradient(135deg,#6366f1,#818cf8)", "linear-gradient(135deg,#0ea5e9,#38bdf8)", "linear-gradient(135deg,#f59e0b,#fbbf24)", "linear-gradient(135deg,#10b981,#34d399)", "linear-gradient(135deg,#ec4899,#f472b6)"];
  return gs[(ch.toUpperCase().charCodeAt(0) - 65) % gs.length];
};

/* ═══════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════ */
export default function ProfilePage() {
  const topRef = useRef(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetail, setIsMobileDetail] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUser, setTempUser] = useState(null);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [isImageConfirmationOpen, setIsImageConfirmationOpen] = useState(false);
  const [isResumeConfirmationOpen, setIsResumeConfirmationOpen] = useState(false);
  const [isResumeDeleteConfirmOpen, setIsResumeDeleteConfirmOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [educationIndex, setEducationIndex] = useState(null);
  const [experienceIndex, setExperienceIndex] = useState(null);
  const userId = useSelector((state) => state.user.seekerInfo.userId);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await userAxiosInstance.get(`/user-profile/${userId}`);
      if (res.status === 200) setUser(res.data.userData);
    } catch { toast.error("Failed to load user data"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchUserData(); }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const handleChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setIsMobileDetail(false);
    };
    setIsMobile(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) return toast.error("Invalid image type");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setSelectedImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    setIsImageConfirmationOpen(true);
  };
  const confirmImageUpload = async () => {
    const fd = new FormData(); fd.append("profileImg", selectedImageFile);
    try {
      const res = await userAxiosInstance.post(`/update-profileImg/${userId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) { toast.success("Profile photo updated"); await fetchUserData(); }
    } catch { toast.error("Failed to update photo"); }
    finally { URL.revokeObjectURL(previewImageUrl); setIsImageConfirmationOpen(false); setSelectedImageFile(null); setPreviewImageUrl(null); }
  };
  const cancelImageUpload = () => { URL.revokeObjectURL(previewImageUrl); setIsImageConfirmationOpen(false); setSelectedImageFile(null); setPreviewImageUrl(null); };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.type !== "application/pdf") return toast.error("PDF only");
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    const list = Array.isArray(user?.resume) ? user.resume : user?.resume ? [user.resume] : [];
    if (list.length >= 3) return toast.error("Max 3 resumes");
    setSelectedResumeFile(file); setIsResumeConfirmationOpen(true);
  };
  const confirmResumeUpload = async () => {
    const fd = new FormData(); fd.append("resume", selectedResumeFile);
    try {
      const res = await userAxiosInstance.post(`/update-resume/${userId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) { toast.success("Resume uploaded"); await fetchUserData(); }
    } catch { toast.error("Upload failed"); }
    finally { setIsResumeConfirmationOpen(false); setSelectedResumeFile(null); }
  };
  const handleRemoveResume = async (url) => {
    try {
      const res = await userAxiosInstance.delete("/delete-resume", { data: { userId, resumeUrl: url } });
      if (res.data.success) { toast.success("Resume removed"); await fetchUserData(); }
    } catch { toast.error("Failed to remove"); }
  };
  const requestRemoveResume = (url) => {
    setResumeToDelete(url);
    setIsResumeDeleteConfirmOpen(true);
  };
  const confirmRemoveResume = async () => {
    if (!resumeToDelete) return;
    await handleRemoveResume(resumeToDelete);
    setIsResumeDeleteConfirmOpen(false);
    setResumeToDelete(null);
  };
  const cancelRemoveResume = () => {
    setIsResumeDeleteConfirmOpen(false);
    setResumeToDelete(null);
  };

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      const res = await userAxiosInstance.post(`/update-profile/${userId}`, values);
      if (res.data.success) { toast.success("Profile updated"); setUser(res.data.response || values); setIsEditDialogOpen(false); }
    } catch { toast.error("Update failed"); }
    finally { setSubmitting(false); }
  };

  const openEducationDialog = (idx = null) => {
    setCurrentEducation(idx !== null ? { ...user.education[idx] } : { qualification: "", institute: "", startYear: new Date().getFullYear(), endYear: null });
    setEducationIndex(idx); setIsEducationDialogOpen(true);
  };
  const saveEducation = async (values, { setSubmitting, resetForm }) => {
    const upd = { ...user };
    if (educationIndex !== null) upd.education[educationIndex] = values;
    else upd.education = [...(upd.education || []), values];
    try {
      const res = await userAxiosInstance.post(`/update-profile/${userId}`, upd);
      if (res.data.success) { toast.success(educationIndex !== null ? "Updated" : "Added"); setUser(res.data.response || upd); setIsEducationDialogOpen(false); resetForm(); }
    } catch { toast.error("Save failed"); }
    finally { setSubmitting(false); }
  };
  const deleteEducation = async (idx) => {
    const upd = { ...user }; upd.education = upd.education.filter((_, i) => i !== idx);
    try { const res = await userAxiosInstance.post(`/update-profile/${userId}`, upd); if (res.data.success) { toast.success("Removed"); setUser(res.data.response || upd); } } catch { toast.error("Failed"); }
  };

  const openExperienceDialog = (idx = null) => {
    setCurrentExperience(idx !== null ? { ...user.experience[idx] } : { company: "", jobTitle: "", startYear: new Date().getFullYear(), endYear: null });
    setExperienceIndex(idx); setIsExperienceDialogOpen(true);
  };
  const saveExperience = async (values, { setSubmitting, resetForm }) => {
    const upd = { ...user };
    if (experienceIndex !== null) upd.experience[experienceIndex] = values;
    else upd.experience = [...(upd.experience || []), values];
    try {
      const res = await userAxiosInstance.post(`/update-profile/${userId}`, upd);
      if (res.data.success) { toast.success(experienceIndex !== null ? "Updated" : "Added"); setUser(res.data.response || upd); setIsExperienceDialogOpen(false); resetForm(); }
    } catch { toast.error("Save failed"); }
    finally { setSubmitting(false); }
  };
  const deleteExperience = async (idx) => {
    const upd = { ...user }; upd.experience = upd.experience.filter((_, i) => i !== idx);
    try { const res = await userAxiosInstance.post(`/update-profile/${userId}`, upd); if (res.data.success) { toast.success("Removed"); setUser(res.data.response || upd); } } catch { toast.error("Failed"); }
  };

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="pp-root" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 14 }}>
      <div className="pp-spinner" />
      <p style={{ color: "#64748b", fontSize: 14 }}>Loading your profile…</p>
    </div>
  );
  if (!user) return (
    <div className="pp-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#ef4444" }}>
      Failed to load profile data.
    </div>
  );

  const fullName = `${user.firstName} ${user.lastName}`;
  const initial = user.firstName?.charAt(0) || "U";
  const getResumeFileName = (url) => url.split("/").pop();

  const TABS = [
    { value: "about", label: "About", icon: <User size={13} /> },
    { value: "resume", label: "Resume", icon: <FileText size={13} /> },
    { value: "education", label: "Education", icon: <GraduationCap size={13} /> },
    { value: "experience", label: "Experience", icon: <Briefcase size={13} /> },
  ];

  const currentTab = TABS.find((t) => t.value === activeTab);

  const handleTabChange = (val) => {
    setActiveTab(val);
    if (isMobile) {
      setIsMobileDetail(true);
      setTimeout(() => {
        topRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  return (
    <div
      ref={topRef}
      className="pp-root "
      style={{ background: "#f1f5f9", minHeight: "100vh" }}
    >

      {/* ── Header Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)", padding: "110px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(99,102,241,.22)", filter: "blur(55px)" }} />
        <div style={{ position: "absolute", bottom: -20, left: "30%", width: 140, height: 140, borderRadius: "50%", background: "rgba(167,139,250,.15)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 1260, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Your personal details
            </p>
            <h1 style={{ color: "#fff", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              My Profile
            </h1>
            <p style={{ color: "#c7d2fe", fontSize: 13.5, marginTop: 6, fontWeight: 400 }}>
              Manage your personal information, resume, and experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <div style={{ maxWidth: 1260, margin: "-52px auto 48px", padding: "0 16px", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>

          {/* ── Header ── */}
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", border: "1.5px solid #e8edf5", borderBottom: "none", padding: "20px 16px 0" }}>
            <div className="pp-header-row" style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", paddingBottom: 16, borderBottom: "1.5px solid #f1f5f9" }}>

              {/* Avatar */}
              <div style={{ position: "relative", marginTop: -52 }}>
                <div
                  className="pp-avatar-wrap"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: "block" }}
                >
                  <Avatar style={{ width: 96, height: 96, border: "4px solid #fff", boxShadow: "0 6px 24px rgba(0,0,0,0.15)" }}>
                    <AvatarImage src={user.profileUrl || "/placeholder.svg"} alt={fullName} />
                    <AvatarFallback style={{ background: getGrad(initial), color: "#fff", fontSize: 32, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pp-avatar-overlay">
                    <Camera size={22} className="pp-cam-icon" />
                  </div>
                </div>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              {/* Name / location */}
              <div style={{ flex: 1, minWidth: 160, paddingBottom: 4 }}>
                <h1 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>{fullName}</h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={13} style={{ color: "#6366f1" }} />
                  {user.location || "No location set"}
                </p>
                <button
                  className="pp-btn pp-btn-outline"
                  onClick={() => { setTempUser({ ...user }); setIsEditDialogOpen(true); }}
                  style={{ fontSize: 12 }}
                >
                  <Edit size={13} /> Edit Profile
                </button>
              </div>

              {/* Quick stats */}
              <div className="pp-header-stats" style={{ display: "flex", gap: 12, paddingBottom: 4, flexWrap: "wrap" }}>
                {[
                  { label: "Education", val: user.education?.length || 0, color: "#6366f1" },
                  { label: "Experience", val: user.experience?.length || 0, color: "#16a34a" },
                  { label: "Resumes", val: getResumeCount(user.resume), color: "#f59e0b" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Bar */}
            <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange}>
              {(!isMobile || !isMobileDetail) ? (
                <TabsList style={{ display: "flex", gap: 4, background: "transparent", padding: "12px 0 0", borderBottom: "none", width: "100%", justifyContent: "flex-start", flexWrap: "wrap" }}>
                  {TABS.map(({ value, label, icon }) => (
                    <TabsTrigger key={value} value={value} className="pp-tab">
                      {icon}{label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 0", gap: 8 }}>
                  <button
                    type="button"
                    className="pp-back-top-mobile"
                    onClick={() => {
                      setIsMobileDetail(false);
                      topRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <ChevronLeft size={14} />
                    Back
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                    {currentTab?.label}
                  </span>
                </div>
              )}

              {/* ── Tab Content ── */}
              {(!isMobile || isMobileDetail) && (
                <div style={{ background: "#fff", borderRadius: "0 0 20px 20px", border: "1.5px solid #e8edf5", borderTop: "none", padding: "28px" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: .25 }}
                    >
                      {/* ── ABOUT ── */}
                      <TabsContent value="about" className="mt-0">
                      <SectionHeader title="About Me" />
                      <div style={{ background: "linear-gradient(135deg,#f8faff,#f1f5f9)", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                          {user.about || "No bio added yet. Click Edit Profile to tell the world about yourself."}
                        </p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                        {[
                          { icon: <User size={14} />, label: "Full Name", value: fullName, color: "#6366f1" },
                          { icon: <Mail size={14} />, label: "Email", value: user.email, color: "#0ea5e9" },
                          { icon: <Phone size={14} />, label: "Phone", value: user.phone, color: "#16a34a" },
                          user.DOB && { icon: <Calendar size={14} />, label: "Date of Birth", value: new Date(user.DOB).toLocaleDateString(), color: "#f59e0b" },
                          user.location && { icon: <MapPin size={14} />, label: "Location", value: user.location, color: "#ec4899" },
                        ].filter(Boolean).map((item, i) => (
                          <motion.div
                            key={item.label}
                            className="pp-info-cell"
                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: item.color }}>{item.icon}<span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#94a3b8" }}>{item.label}</span></div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{item.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                      {/* ── RESUME ── */}
                      <TabsContent value="resume" className="mt-0">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <SectionHeader title="Resume" />
                        <input type="file" hidden ref={resumeInputRef} onChange={handleResumeUpload} accept=".pdf" />
                      </div>
                      <ResumeManager
                        resumes={user?.resume}
                        maxResumes={3}
                        onUploadClick={() => resumeInputRef.current?.click()}
                        onOpen={(url) => {
                          const u = (url || "").trim();
                          if (!u) return;
                          const base = import.meta.env.VITE_BACKEND_URL || "https://api.techpath.in";
                          const proxyUrl = `${base}/resume/view?userId=${encodeURIComponent(userId)}&resumeUrl=${encodeURIComponent(u)}&disposition=inline`;
                          window.open(proxyUrl, "_blank", "noopener,noreferrer");
                        }}
                        onRemove={requestRemoveResume}
                      />
                    </TabsContent>

                      {/* ── EDUCATION ── */}
                      <TabsContent value="education" className="mt-0">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <SectionHeader title="Education" />
                        <button className="pp-btn pp-btn-primary" style={{ fontSize: 12 }} onClick={() => openEducationDialog()}>
                          <Plus size={13} /> Add Education
                        </button>
                      </div>
                      {user.education?.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {user.education.map((edu, i) => (
                            <motion.div key={i} className="pp-card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 14,
                                  flexWrap: "wrap",
                                }}
                              >
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <GraduationCap size={18} style={{ color: "#6366f1" }} />
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{edu.qualification}</h4>
                                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px" }}>{edu.institute}</p>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    <span className="pp-year-pill">📅 {edu.startYear} – {edu.endYear || "Present"}</span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 6,
                                    flexShrink: 0,
                                    flexWrap: "wrap",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <button className="pp-btn pp-btn-outline" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => openEducationDialog(i)}><Edit size={12} />Edit</button>
                                  <button className="pp-btn-ghost-red" onClick={() => deleteEducation(i)}><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="pp-empty">
                          <GraduationCap size={40} style={{ color: "#c7d2fe", margin: "0 auto 12px" }} />
                          <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: "0 0 6px" }}>No education added</p>
                          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px" }}>Add your academic history to stand out</p>
                          <button className="pp-btn pp-btn-primary" onClick={() => openEducationDialog()}><Plus size={13} /> Add Education</button>
                        </div>
                      )}
                    </TabsContent>

                      {/* ── EXPERIENCE ── */}
                      <TabsContent value="experience" className="mt-0">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <SectionHeader title="Work Experience" />
                        <button className="pp-btn pp-btn-primary" style={{ fontSize: 12 }} onClick={() => openExperienceDialog()}>
                          <Plus size={13} /> Add Experience
                        </button>
                      </div>
                      {user.experience?.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {user.experience.map((exp, i) => (
                            <motion.div key={i} className="pp-card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <Briefcase size={18} style={{ color: "#16a34a" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{exp.jobTitle}</h4>
                                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px" }}>{exp.company}</p>
                                  <span className="pp-year-pill" style={{ background: "#f0fdf4", color: "#16a34a" }}>🗓️ {exp.startYear} – {exp.endYear || "Present"}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                  <button className="pp-btn pp-btn-outline" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => openExperienceDialog(i)}><Edit size={12} />Edit</button>
                                  <button className="pp-btn-ghost-red" onClick={() => deleteExperience(i)}><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="pp-empty">
                          <Briefcase size={40} style={{ color: "#bbf7d0", margin: "0 auto 12px" }} />
                          <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: "0 0 6px" }}>No experience added</p>
                          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px" }}>Showcase your work history to employers</p>
                          <button className="pp-btn pp-btn-primary" onClick={() => openExperienceDialog()}><Plus size={13} /> Add Experience</button>
                        </div>
                      )}
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* ═══ DIALOGS ═══ */}

      {/* Edit Profile */}
      <StyledDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Edit Profile" description="Update your personal information below">
        <Formik
          initialValues={{ firstName: tempUser?.firstName || "", lastName: tempUser?.lastName || "", email: tempUser?.email || "", phone: tempUser?.phone || "", about: tempUser?.about || "", DOB: tempUser?.DOB ? new Date(tempUser.DOB).toISOString().split("T")[0] : "", location: tempUser?.location || "", ...tempUser }}
          validationSchema={ProfileSchema} onSubmit={handleUpdateProfile}
        >
          {({ isSubmitting }) => (
            <Form style={{ display: "grid", gap: 14, padding: "4px 0" }}>
              <div className="pp-dialog-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="First Name" name="firstName" placeholder="First name" />
                <FormField label="Last Name" name="lastName" placeholder="Last name" />
              </div>
              <FormField label="Email" name="email" type="email" placeholder="Email address" disabled />
              <FormField label="Phone" name="phone" placeholder="Phone number" />
              <FormField label="About" name="about" placeholder="A short bio about yourself" />
              <div className="pp-dialog-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="Date of Birth" name="DOB" type="date" />
                <FormSelect label="Location" name="location" placeholder="Select preferred location">
                  <optgroup label="Kerala Districts (Preferred)">
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other">
                    <option value="All India (Remote)">All India (Remote)</option>
                    <option value="Other Location">Other Location</option>
                  </optgroup>
                </FormSelect>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
                <button type="button" className="pp-btn pp-btn-outline" onClick={() => setIsEditDialogOpen(false)}><X size={13} />Cancel</button>
                <button type="submit" className="pp-btn pp-btn-primary" disabled={isSubmitting}><Check size={13} />{isSubmitting ? "Saving…" : "Save Changes"}</button>
              </div>
            </Form>
          )}
        </Formik>
      </StyledDialog>

      {/* Education */}
      <StyledDialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen} title={educationIndex !== null ? "Edit Education" : "Add Education"} description="Enter your academic details below">
        <Formik
          initialValues={{ qualification: currentEducation?.qualification || "", institute: currentEducation?.institute || "", startYear: currentEducation?.startYear || new Date().getFullYear(), endYear: currentEducation?.endYear || "" }}
          validationSchema={EducationSchema} onSubmit={saveEducation}
        >
          {({ isSubmitting }) => (
            <Form style={{ display: "grid", gap: 14, padding: "4px 0" }}>
              <FormField label="Qualification / Degree" name="qualification" placeholder="e.g. B.Sc. Computer Science" />
              <FormField label="Institute / School" name="institute" placeholder="e.g. MIT" />
              <div className="pp-dialog-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="Start Year" name="startYear" type="number" placeholder="2018" />
                <FormField label="End Year (blank = Present)" name="endYear" type="number" placeholder="2022" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
                <button type="button" className="pp-btn pp-btn-outline" onClick={() => setIsEducationDialogOpen(false)}><X size={13} />Cancel</button>
                <button type="submit" className="pp-btn pp-btn-primary" disabled={isSubmitting}><Check size={13} />{isSubmitting ? "Saving…" : educationIndex !== null ? "Update" : "Add"}</button>
              </div>
            </Form>
          )}
        </Formik>
      </StyledDialog>

      {/* Experience */}
      <StyledDialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen} title={experienceIndex !== null ? "Edit Experience" : "Add Experience"} description="Enter your work experience details below">
        <Formik
          initialValues={{ jobTitle: currentExperience?.jobTitle || "", company: currentExperience?.company || "", startYear: currentExperience?.startYear || new Date().getFullYear(), endYear: currentExperience?.endYear || "" }}
          validationSchema={ExperienceSchema} onSubmit={saveExperience}
        >
          {({ isSubmitting }) => (
            <Form style={{ display: "grid", gap: 14, padding: "4px 0" }}>
              <FormSelect label="Job Title" name="jobTitle" placeholder="Select job title">
                {JOB_CATEGORIES.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </FormSelect>
              <FormField label="Company" name="company" placeholder="e.g. Google" />
              <div className="pp-dialog-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="Start Year" name="startYear" type="number" placeholder="2020" />
                <FormField label="End Year (blank = Present)" name="endYear" type="number" placeholder="2023" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
                <button type="button" className="pp-btn pp-btn-outline" onClick={() => setIsExperienceDialogOpen(false)}><X size={13} />Cancel</button>
                <button type="submit" className="pp-btn pp-btn-primary" disabled={isSubmitting}><Check size={13} />{isSubmitting ? "Saving…" : experienceIndex !== null ? "Update" : "Add"}</button>
              </div>
            </Form>
          )}
        </Formik>
      </StyledDialog>

      {/* Photo confirm */}
      <StyledDialog open={isImageConfirmationOpen} onOpenChange={setIsImageConfirmationOpen} title="Confirm Profile Photo" description="Use this image as your profile picture?">
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
          <Avatar style={{ width: 100, height: 100, border: "4px solid #e0e7ff", boxShadow: "0 6px 20px rgba(99,102,241,.2)" }}>
            <AvatarImage src={previewImageUrl || user.profileUrl} />
            <AvatarFallback style={{ background: getGrad(initial), color: "#fff", fontSize: 32, fontWeight: 800 }}>{initial}</AvatarFallback>
          </Avatar>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
          <button className="pp-btn pp-btn-outline" onClick={cancelImageUpload}><X size={13} />Cancel</button>
          <button className="pp-btn pp-btn-green" onClick={confirmImageUpload}><Check size={13} />Use this photo</button>
        </div>
      </StyledDialog>

      {/* Resume confirm */}
      <StyledDialog open={isResumeConfirmationOpen} onOpenChange={setIsResumeConfirmationOpen} title="Confirm Resume Upload" description="Upload this file to your profile?">
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#f8fafc", borderRadius: 12, padding: "14px 16px", margin: "8px 0 20px", border: "1.5px solid #e2e8f0" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={20} style={{ color: "#6366f1" }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", margin: 0 }}>{selectedResumeFile?.name}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{selectedResumeFile ? `${(selectedResumeFile.size / 1024 / 1024).toFixed(2)} MB · PDF` : ""}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
          <button className="pp-btn pp-btn-outline" onClick={() => { setIsResumeConfirmationOpen(false); setSelectedResumeFile(null); }}><X size={13} />Cancel</button>
          <button className="pp-btn pp-btn-primary" onClick={confirmResumeUpload}><Upload size={13} />Upload</button>
        </div>
      </StyledDialog>

      {/* Resume delete confirm */}
      <StyledDialog
        open={isResumeDeleteConfirmOpen}
        onOpenChange={setIsResumeDeleteConfirmOpen}
        title="Delete resume?"
        description="This will remove the resume from your profile."
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fef2f2", borderRadius: 12, padding: "14px 16px", margin: "8px 0 20px", border: "1.5px solid #fecaca" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={20} style={{ color: "#ef4444" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {resumeToDelete ? getResumeFileName(resumeToDelete) : "—"}
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>PDF Document</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1.5px solid #f1f5f9" }}>
          <button className="pp-btn pp-btn-outline" onClick={cancelRemoveResume}><X size={13} />Cancel</button>
          <button className="pp-btn" style={{ background: "#ef4444", color: "#fff", border: "1px solid #ef4444" }} onClick={confirmRemoveResume}>
            <Trash2 size={13} />Delete
          </button>
        </div>
      </StyledDialog>
    </div>
  );
}

/* ─── Helper sub-components ─── */
function SectionHeader({ title }) {
  return (
    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 0", letterSpacing: "-0.01em", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {title}
    </h3>
  );
}

function StyledDialog({ open, onOpenChange, title, description, children }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ borderRadius: 18, border: "1.5px solid #e0e7ff", padding: 0, overflow: "hidden", maxWidth: 540, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg,#312e81,#4f46e5)", padding: "20px 24px" }}>
          <DialogTitle style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</DialogTitle>
          {description && <DialogDescription style={{ color: "#c7d2fe", fontSize: 13, margin: "4px 0 0" }}>{description}</DialogDescription>}
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}