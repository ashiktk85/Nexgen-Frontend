import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Slider } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import validateJobForm from "@/Validations/CreateJob-validation";
import { employerJobCreation, employerJobUpdate, getCompanyById } from "@/apiServices/userApi";
import { getActiveJobTitles } from "@/apiServices/employerApi";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Mail, Phone, MapPin, IndianRupee,
  TrendingUp, FileText, CheckCircle2, Plus, X, Send, Pencil
} from "lucide-react";

/* ─── Inject styles once ─── */
if (!document.getElementById("cjf-styles")) {
  const s = document.createElement("style");
  s.id = "cjf-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .cjf-root { font-family:'DM Sans',sans-serif; }
    .cjf-root h1,.cjf-root h2,.cjf-root h3 { font-family:'Plus Jakarta Sans',sans-serif; }

    /* Section card */
    .cjf-section {
      background:#fff; border:1.5px solid #e8edf5; border-radius:16px; padding:24px;
      margin-bottom:20px;
    }
    .cjf-section-title {
      display:flex; align-items:center; gap:9px; margin:0 0 20px;
    }
    .cjf-section-icon {
      width:32px; height:32px; border-radius:9px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
    }

    /* Custom inputs */
    .cjf-input {
      width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; box-sizing:border-box;
    }
    .cjf-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }
    .cjf-input.error { border-color:#ef4444; }
    .cjf-input:disabled { opacity:.55; cursor:not-allowed; }

    .cjf-textarea {
      width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; resize:vertical;
      min-height:130px; box-sizing:border-box; line-height:1.6;
    }
    .cjf-textarea:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }
    .cjf-textarea.error { border-color:#ef4444; }

    .cjf-label {
      display:block; font-size:11px; font-weight:700; color:#64748b;
      letter-spacing:.07em; text-transform:uppercase; margin-bottom:7px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .cjf-error { font-size:11.5px; color:#ef4444; margin-top:5px; display:flex; align-items:center; gap:4px; }

    /* Requirement chips */
    .cjf-req-chip {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 12px; border-radius:999px; font-size:12px; font-weight:600;
      cursor:pointer; transition:all .18s ease; border:1.5px solid;
      font-family:'Plus Jakarta Sans',sans-serif; user-select:none;
    }
    .cjf-req-chip.off { background:#f8fafc; border-color:#e2e8f0; color:#64748b; }
    .cjf-req-chip.off:hover { border-color:#c7d2fe; color:#4f46e5; background:#eef2ff; }
    .cjf-req-chip.on  { background:linear-gradient(135deg,#4f46e5,#6366f1); border-color:transparent; color:#fff; box-shadow:0 3px 8px rgba(99,102,241,.25); }

    /* Submit button */
    .cjf-submit-btn {
      display:inline-flex; align-items:center; gap:8px;
      padding:13px 32px; border-radius:12px; border:none; cursor:pointer;
      font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff;
      box-shadow:0 6px 20px rgba(99,102,241,.35); transition:all .2s ease;
    }
    .cjf-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(99,102,241,.42); }
    .cjf-submit-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

    /* Salary input with rupee prefix */
    .cjf-salary-wrap { position:relative; }
    .cjf-salary-prefix { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:13px; pointer-events:none; }
    .cjf-salary-input { padding-left:28px !important; }

    /* MUI overrides */
    .cjf-root .MuiOutlinedInput-root { border-radius:10px !important; font-family:'DM Sans',sans-serif !important; font-size:13.5px !important; background:#f8fafc; }
    .cjf-root .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color:#c7d2fe !important; }
    .cjf-root .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color:#6366f1 !important; border-width:1.5px !important; }
    .cjf-root .MuiInputLabel-root.Mui-focused { color:#6366f1 !important; }
    .cjf-root .MuiInputBase-input { padding:11px 14px !important; }
    .cjf-root .MuiSlider-root { color:#6366f1 !important; }
    .cjf-root .MuiSlider-thumb { box-shadow:0 0 0 6px rgba(99,102,241,.16) !important; }
    .cjf-root .MuiSlider-rail { background:#e2e8f0 !important; }
  `;
  document.head.appendChild(s);
}

/* ─── Variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .09 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .38, ease: "easeOut" } } };

/* ─── Section header helper ─── */
const SH = ({ icon, title, iconBg }) => (
  <div className="cjf-section-title">
    <div className="cjf-section-icon" style={{ background: iconBg }}>{icon}</div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
  </div>
);

/* ─── Label helper ─── */
const FL = ({ children, required }) => (
  <label className="cjf-label">{children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}</label>
);

/* ─── Error helper ─── */
const FE = ({ msg }) => msg ? (
  <p className="cjf-error"><X size={11} />{msg}</p>
) : null;

/* ══════════════════════════════════════════════ */
function CreateJobForm({ selectedData = null, page = "create", onClose = null }) {
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState(selectedData?.requirements || []);
  const [availableRequirements, setAvailableRequirements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [titlesLoading, setTitlesLoading] = useState(true);

  useEffect(() => {
    const loadJobTitles = async () => {
      setTitlesLoading(true);
      try {
        const titles = await getActiveJobTitles();
        let options = (titles || []).map((t) => ({
          title: t.title,
          requirements: t.requirements || [],
        }));
        if (
          selectedData?.jobTitle &&
          !options.some((o) => o.title === selectedData.jobTitle)
        ) {
          options = [
            {
              title: selectedData.jobTitle,
              requirements: selectedData.requirements || [],
            },
            ...options,
          ];
        }
        setJobTitleOptions(options);
        if (selectedData?.jobTitle) {
          const match = options.find((j) => j.title === selectedData.jobTitle);
          setAvailableRequirements(
            match?.requirements || selectedData.requirements || []
          );
        }
      } catch (err) {
        console.error("Error fetching job titles:", err);
        toast.error("Failed to load job titles");
      } finally {
        setTitlesLoading(false);
      }
    };
    loadJobTitles();
  }, [selectedData?.jobTitle, selectedData?.requirements]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await employerAxiosInstance.get(`/company-list/${Employer?.employerId}`);
        setCompanies(data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    if (Employer?.employerId) fetchCompanies();
  }, [Employer?.employerId]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.jobTitle || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: "+91",
      country: "IN",
      salaryFrom: selectedData?.salaryRange?.[0] || 0,
      salaryTo: selectedData?.salaryRange?.[1] || 0,
      state: selectedData?.state || null,
      city: selectedData?.city || null,
      experienceRequired: [
        selectedData?.experienceRequired?.[0] ?? 0,
        selectedData?.experienceRequired?.[selectedData.experienceRequired.length - 1] ?? 3,
      ],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
      companyId: selectedData?.companyId || "",
    },
    enableReinitialize: true,
    validationSchema: validateJobForm,
    onSubmit: async (values) => {
      try {
        let status;
        if (page === "create") {
          status = await employerJobCreation(values, Employer?.employerId);
        } else {
          values._id = selectedData?._id;
          status = await employerJobUpdate(values, Employer?.employerId);
        }
        if (status) {
          toast.success(page === "create" ? "Job created!" : "Job updated!");
          if (onClose) onClose();
          else navigate("/employer/job_list");
          return;
        }
        toast.error(status?.message || "Error saving job post");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Unexpected error");
      }
    },
  });

  useEffect(() => {
    if (formik.values.jobTitle) {
      const reqs =
        jobTitleOptions.find((j) => j.title === formik.values.jobTitle)?.requirements || [];
      setAvailableRequirements(reqs);
    }
  }, [formik.values.jobTitle, jobTitleOptions]);

  useEffect(() => {
    if (formik.values.country) setStates(State.getStatesOfCountry(formik.values.country));
    else setStates([]);
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state && formik.values.country)
      setCities(City.getCitiesOfState(formik.values.country, formik.values.state));
    else setCities([]);
  }, [formik.values.state, formik.values.country]);

  const handleJobTitleChange = (_, newValue) => {
    const title = newValue?.title || "";
    formik.setFieldValue("jobTitle", title);
    if (newValue) {
      setAvailableRequirements(newValue.requirements || []);
      setSelectedRequirements([]);
    } else {
      setAvailableRequirements([]);
      setSelectedRequirements([]);
    }
  };

  const handleRequirementToggle = (req) => {
    const next = selectedRequirements.includes(req)
      ? selectedRequirements.filter(r => r !== req)
      : [...selectedRequirements, req];
    setSelectedRequirements(next);
    formik.setFieldValue("requirements", next);
  };

  const selectedJob = jobTitleOptions.find((j) => j.title === formik.values.jobTitle) || null;
  const selectedState = states.find(s => s.isoCode === formik.values.state) || null;
  const selectedCity = cities.find(c => c.name === formik.values.city) || null;
  const isEdit = page === "update";

  return (
    <div className="cjf-root" style={{ background: "#f1f5f9", minHeight: "100vh", padding: "24px" }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Page heading ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {Employer?.name?.toUpperCase()}
          </p>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
            {isEdit ? "Edit Job Listing" : "Post a New Job"}
          </h1>
        </motion.div>

        <form onSubmit={formik.handleSubmit}>

          {/* ══ Section 1: Job Info ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<Briefcase size={16} style={{ color: "#6366f1" }} />} title="Job Information" iconBg="#eef2ff" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Job Title */}
                <div>
                  <FL required>Job Title</FL>
                  <Autocomplete
                    options={jobTitleOptions}
                    getOptionLabel={o => o.title}
                    value={selectedJob}
                    onChange={handleJobTitleChange}
                    loading={titlesLoading}
                    disablePortal
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" placeholder="e.g. Mobile Technician"
                        error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)} />
                    )}
                  />
                  <FE msg={formik.touched.jobTitle && formik.errors.jobTitle} />
                </div>

                {/* Shop Selection */}
                {companies.length > 0 && (
                  <div>
                    <FL>Select Shop</FL>
                    <Autocomplete
                      options={companies}
                      getOptionLabel={(o) => o?.companyName || ""}
                      isOptionEqualToValue={(option, value) => {
                        if (!value) return false;
                        const optionId = option._id?.toString() || option._id;
                        const valueId = typeof value === 'string' ? value : (value._id?.toString() || value._id);
                        return optionId === valueId;
                      }}
                      value={companies.find(c => (c._id?.toString() || c._id) === (formik.values.companyId?.toString() || formik.values.companyId)) || null}
                      onChange={(_, newValue) => {
                        formik.setFieldValue("companyId", newValue ? (newValue._id?.toString() || newValue._id) : "");
                      }}
                      disablePortal
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" placeholder="Select a shop (optional)" />
                      )}
                    />
                  </div>
                )}

                {/* Requirements chips */}
                <AnimatePresence>
                  {availableRequirements.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <FL>Select Requirements</FL>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <AnimatePresence>
                          {availableRequirements.map(req => (
                            <motion.button
                              type="button" key={req}
                              className={`cjf-req-chip ${selectedRequirements.includes(req) ? "on" : "off"}`}
                              initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }}
                              onClick={() => handleRequirementToggle(req)}
                            >
                              {selectedRequirements.includes(req) && <CheckCircle2 size={11} />}
                              {req}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                      <FE msg={formik.touched.requirements && formik.errors.requirements && selectedRequirements.length === 0 && formik.errors.requirements} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Description */}
                <FL required>Job Description</FL>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe the role, responsibilities, and ideal candidate…"
                  className={`cjf-textarea ${formik.touched.description && formik.errors.description ? "error" : ""}`}
                  style={{ flex: 1 }}
                  maxLength={4000}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <FE msg={formik.touched.description && formik.errors.description} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: formik.values.description.length >= 4000 ? "#ef4444" : "#94a3b8", marginLeft: "auto" }}>
                    {formik.values.description.length} / 4000 characters
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══ Section 2: Contact ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<Mail size={16} style={{ color: "#0ea5e9" }} />} title="Contact Information" iconBg="#f0f9ff" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
              {/* Email */}
              <div>
                <FL required>Contact Email</FL>
                <input
                  name="email" type="email"
                  value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder="contact@company.com"
                  className={`cjf-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                />
                <FE msg={formik.touched.email && formik.errors.email} />
              </div>

              {/* Phone */}
              <div>
                <FL required>Phone</FL>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value="+91" readOnly className="cjf-input" style={{ width: 60, flexShrink: 0, textAlign: "center", color: "#64748b" }} />
                  <div style={{ flex: 1 }}>
                    <input
                      name="phone" type="tel"
                      value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      placeholder="Phone number"
                      className={`cjf-input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
                    />
                  </div>
                </div>
                <FE msg={formik.touched.phone && formik.errors.phone} />
              </div>
            </div>
          </motion.div>

          {/* ══ Section 3: Location ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<MapPin size={16} style={{ color: "#ec4899" }} />} title="Location" iconBg="#fdf4ff" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
              {/* Country */}
              <div>
                <FL>Country</FL>
                <input value="India" readOnly disabled className="cjf-input" />
              </div>

              {/* State */}
              <div>
                <FL required>State</FL>
                <Autocomplete
                  options={states}
                  getOptionLabel={o => o.name}
                  value={selectedState}
                  disabled={!formik.values.country}
                  onChange={(_, v) => { formik.setFieldValue("state", v ? v.isoCode : null); formik.setFieldValue("city", null); }}
                  disablePortal
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select state"
                      error={formik.touched.state && Boolean(formik.errors.state)} />
                  )}
                />
                <FE msg={formik.touched.state && formik.errors.state} />
              </div>

              {/* City */}
              <div>
                <FL required>City</FL>
                <Autocomplete
                  options={cities}
                  getOptionLabel={o => o.name}
                  value={selectedCity}
                  disabled={!formik.values.state}
                  onChange={(_, v) => formik.setFieldValue("city", v ? v.name : null)}
                  disablePortal
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select city"
                      error={formik.touched.city && Boolean(formik.errors.city)} />
                  )}
                />
                <FE msg={formik.touched.city && formik.errors.city} />
              </div>
            </div>
          </motion.div>

          {/* ══ Section 4: Compensation & Experience ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<IndianRupee size={16} style={{ color: "#16a34a" }} />} title="Compensation & Experience" iconBg="#f0fdf4" />

            {/* Salary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
              <div>
                <FL required>Salary From (₹)</FL>
                <div className="cjf-salary-wrap">
                  <span className="cjf-salary-prefix">₹</span>
                  <input
                    name="salaryFrom" type="number"
                    value={formik.values.salaryFrom} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`cjf-input cjf-salary-input ${formik.touched.salaryFrom && formik.errors.salaryFrom ? "error" : ""}`}
                    placeholder="e.g. 30000"
                  />
                </div>
                <FE msg={formik.touched.salaryFrom && formik.errors.salaryFrom} />
              </div>
              <div>
                <FL required>Salary To (₹)</FL>
                <div className="cjf-salary-wrap">
                  <span className="cjf-salary-prefix">₹</span>
                  <input
                    name="salaryTo" type="number"
                    value={formik.values.salaryTo} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`cjf-input cjf-salary-input ${formik.touched.salaryTo && formik.errors.salaryTo ? "error" : ""}`}
                    placeholder="e.g. 60000"
                  />
                </div>
                <FE msg={formik.touched.salaryTo && formik.errors.salaryTo} />
              </div>
            </div>

            {/* Experience slider */}
            <div>
              <FL>Experience Required</FL>
              <div style={{ background: "#f8fafc", border: "1.5px solid #f1f5f9", borderRadius: 12, padding: "16px 20px 10px" }}>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={formik.values.experienceRequired}
                    onChange={(_, v) => formik.setFieldValue("experienceRequired", v)}
                    valueLabelDisplay="auto"
                    min={0} max={10} marks
                  />
                </Box>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>0 years</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#4f46e5", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {formik.values.experienceRequired[0]} – {formik.values.experienceRequired[1]}{formik.values.experienceRequired[1] === 10 ? "+" : ""} years
                  </span>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>10+ years</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Submit ── */}
          <motion.div variants={itemVariants} style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
            <button type="button" onClick={() => onClose ? onClose() : navigate(-1)}
              style={{ padding: "11px 22px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.color = "#4f46e5"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
            >
              Cancel
            </button>
            <button type="submit" disabled={formik.isSubmitting} className="cjf-submit-btn">
              {formik.isSubmitting
                ? <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "cjf-spin .65s linear infinite" }} /> Saving…</>
                : isEdit
                  ? <><Pencil size={15} /> Update Job</>
                  : <><Send size={15} /> Post Job</>
              }
            </button>
            <style>{`@keyframes cjf-spin { to { transform:rotate(360deg); } }`}</style>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateJobForm;