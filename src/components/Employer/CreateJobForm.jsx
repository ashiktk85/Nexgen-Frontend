import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TextField, Autocomplete, Box, Slider, createFilterOptions } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import validateJobForm from "@/Validations/CreateJob-validation";
import { employerJobCreation, employerJobUpdate, getCompanyById } from "@/apiServices/userApi";
import { getActiveJobTitles, getCustomCities, saveCustomCity } from "@/apiServices/employerApi";
import {
  createJobPostAdmin,
  updateJobPostAdmin,
  getActiveJobTitlesAdmin,
  getCustomCitiesAdmin,
  saveCustomCityAdmin,
} from "@/apiServices/adminApi";
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

    .cjf-grid-2 { display:grid; grid-template-columns:1fr; gap:24px; }
    @media (min-width:768px) { .cjf-grid-2 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
    .cjf-grid-auto { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr)); gap:16px; }
    .cjf-grid-auto-wide { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr)); gap:16px; }
    .cjf-form-actions { display:flex; flex-direction:column-reverse; gap:10px; align-items:stretch; }
    @media (min-width:640px) {
      .cjf-form-actions { flex-direction:row; justify-content:flex-end; align-items:center; }
    }
    @media (max-width:639px) {
      .cjf-root { padding:12px 12px 32px !important; }
      .cjf-section { padding:16px; }
      .cjf-form-actions button, .cjf-submit-btn { width:100%; justify-content:center; }
    }
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

import { parseSalaryFromJob } from "@/utils/formatSalary";

const cityFilter = createFilterOptions({ stringify: (option) => (typeof option === "string" ? option : option?.name || "") });

const getCityLabel = (option) => (typeof option === "string" ? option : option?.name || "");

/* ══════════════════════════════════════════════ */
function CreateJobForm({
  selectedData = null,
  page = "create",
  onClose = null,
  mode = "employer",
}) {
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const isAdminMode = mode === "admin";
  const activeEmployerId = isAdminMode ? null : Employer?.employerId;
  const activeEmployerName = isAdminMode ? null : Employer?.name;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customCities, setCustomCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState(selectedData?.requirements || []);
  const [availableRequirements, setAvailableRequirements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [titlesLoading, setTitlesLoading] = useState(true);

  useEffect(() => {
    const loadJobTitles = async () => {
      setTitlesLoading(true);
      try {
        const titles = isAdminMode
          ? await getActiveJobTitlesAdmin()
          : await getActiveJobTitles();
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
  }, [selectedData?.jobTitle, selectedData?.requirements, isAdminMode]);

  useEffect(() => {
    if (isAdminMode) return;
    const fetchCompanies = async () => {
      if (!activeEmployerId) {
        setCompanies([]);
        return;
      }
      try {
        const { data } = await employerAxiosInstance.get(`/company-list/${activeEmployerId}`);
        setCompanies(data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, [activeEmployerId, isAdminMode]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.jobTitle || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: "+91",
      country: selectedData?.country || "",
      ...(() => {
        const { from, to } = parseSalaryFromJob(selectedData);
        return { salaryFrom: from, salaryTo: to };
      })(),
      state: selectedData?.state || null,
      city: selectedData?.city || null,
      experienceRequired: [
        selectedData?.experienceRequired?.[0] ?? 0,
        selectedData?.experienceRequired?.[selectedData.experienceRequired.length - 1] ?? 3,
      ],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
      companyId: selectedData?.companyId || "",
      shopName: selectedData?.companyName || "",

      // Job post form improvements
      roomAvailable: selectedData?.roomAvailable ?? "",
      foodAvailable: selectedData?.foodAvailable ?? "",
      incentive: selectedData?.incentive ?? "",
      workingTime: selectedData?.workingTime ?? "",
      workingDays: selectedData?.workingDays ?? "",
      holiday: selectedData?.holiday ?? "",
      probationPeriod: selectedData?.probationPeriod ?? "",

      scheduledLiveAt: selectedData?.scheduledLiveAt
        ? new Date(selectedData.scheduledLiveAt).toISOString().slice(0, 16)
        : "",
      expiresAt: selectedData?.expiresAt
        ? new Date(selectedData.expiresAt).toISOString().slice(0, 16)
        : "",
    },
    enableReinitialize: true,
    validationSchema: validateJobForm,
    onSubmit: async (values) => {
      if (!isAdminMode && !activeEmployerId) {
        toast.error("Employer session expired");
        return;
      }
      try {
        const payload = {
          ...values,
          description: values.description?.trim() || null,
          country: values.country || null,
          state: values.state || null,
          city: values.city?.trim() || null,
          // Dropdown fields: convert empty string to `null` for backend enum/null handling
          roomAvailable: values.roomAvailable || null,
          foodAvailable: values.foodAvailable || null,
          incentive: values.incentive || null,
          workingTime: values.workingTime || null,
          workingDays: values.workingDays || null,
          holiday: values.holiday || null,
          probationPeriod: values.probationPeriod || null,
          scheduledLiveAt: values.scheduledLiveAt
            ? new Date(values.scheduledLiveAt).toISOString()
            : null,
          expiresAt: values.expiresAt
            ? new Date(values.expiresAt).toISOString()
            : null,
        };
        let status;
        if (page === "create") {
          status = isAdminMode
            ? await createJobPostAdmin(payload)
            : await employerJobCreation(payload, activeEmployerId);
        } else {
          payload._id = selectedData?._id;
          status = isAdminMode
            ? await updateJobPostAdmin(selectedData?._id, payload)
            : await employerJobUpdate(payload, activeEmployerId);
        }
        const success = isAdminMode ? status?.data?.status : status;
        if (success) {
          toast.success(page === "create" ? "Job created!" : "Job updated!");
          if (onClose) onClose();
          else navigate(isAdminMode ? "/admin/jobs" : "/employer/job_list");
          return;
        }
        toast.error(status?.data?.message || status?.message || "Error saving job post");
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

  useEffect(() => {
    const loadCustomCities = async () => {
      if (!formik.values.state) {
        setCustomCities([]);
        return;
      }
      try {
        const fetchFn = isAdminMode ? getCustomCitiesAdmin : getCustomCities;
        const list = await fetchFn({
          state: formik.values.state,
          country: formik.values.country,
        });
        setCustomCities(list || []);
      } catch (err) {
        console.error("Error fetching custom cities:", err);
      }
    };
    loadCustomCities();
  }, [formik.values.state, formik.values.country, isAdminMode]);

  const cityOptions = useMemo(() => {
    const seen = new Set();
    const merged = [];
    const addCity = (name, isCustom = false) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return;
      seen.add(key);
      merged.push({ name, isCustom });
    };
    cities.forEach((c) => addCity(c.name, false));
    customCities.forEach((c) => addCity(c.name, true));
    if (formik.values.city) addCity(formik.values.city.trim(), true);
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [cities, customCities, formik.values.city]);

  const persistCustomCity = useCallback(async (cityName) => {
    const trimmed = cityName?.trim();
    if (!trimmed || !formik.values.state) return;

    const exists =
      cities.some((c) => c.name.toLowerCase() === trimmed.toLowerCase()) ||
      customCities.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;

    try {
      const saveFn = isAdminMode ? saveCustomCityAdmin : saveCustomCity;
      const saved = await saveFn({
        name: trimmed,
        state: formik.values.state,
        country: formik.values.country,
      });
      if (saved) {
        setCustomCities((prev) => {
          if (prev.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return prev;
          return [...prev, saved];
        });
      }
    } catch (err) {
      console.error("Failed to save custom city:", err);
    }
  }, [cities, customCities, formik.values.state, formik.values.country, isAdminMode]);

  const handleJobTitleChange = (_, newValue) => {
    const title = newValue?.title || "";
    formik.setFieldValue("jobTitle", title);
    formik.setFieldTouched("jobTitle", true, false);
    if (newValue) {
      setAvailableRequirements(newValue.requirements || []);
      setSelectedRequirements([]);
    } else {
      setAvailableRequirements([]);
      setSelectedRequirements([]);
    }
  };

  const handleCityChange = async (_, value) => {
    const cityName = typeof value === "string" ? value.trim() : value?.name?.trim() || "";
    formik.setFieldValue("city", cityName || null);
    formik.setFieldTouched("city", true, false);
    if (cityName) await persistCustomCity(cityName);
  };

  const filterCityOptions = (options, params) => {
    const filtered = cityFilter(options, params);
    const input = params.inputValue.trim();
    if (input && !options.some((o) => getCityLabel(o).toLowerCase() === input.toLowerCase())) {
      filtered.push({ name: input, isCustom: true, isNew: true });
    }
    return filtered;
  };

  const touchAllFields = () => {
    formik.setTouched({
      jobTitle: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      salaryFrom: true,
      salaryTo: true,
      description: true,
      requirements: true,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    touchAllFields();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(typeof firstError === "string" ? firstError : "Please fix the highlighted fields");
      return;
    }
    if (!jobTitleOptions.some((j) => j.title === formik.values.jobTitle)) {
      toast.error("Please select a valid job title from the list.");
      return;
    }
    formik.submitForm();
  };

  const handleRequirementToggle = (req) => {
    const next = selectedRequirements.includes(req)
      ? selectedRequirements.filter(r => r !== req)
      : [...selectedRequirements, req];
    setSelectedRequirements(next);
    formik.setFieldValue("requirements", next);
  };

  const selectedJob = jobTitleOptions.find((j) => j.title === formik.values.jobTitle) || null;
  const countries = useMemo(() => Country.getAllCountries(), []);
  const selectedCountry = countries.find((c) => c.isoCode === formik.values.country) || null;
  const selectedState = states.find(s => s.isoCode === formik.values.state) || null;
  const selectedCity = formik.values.city
    ? (cityOptions.find((c) => c.name.toLowerCase() === formik.values.city.toLowerCase()) || formik.values.city)
    : null;
  const isEdit = page === "update";

  return (
    <div className="cjf-root" style={{ background: "#f1f5f9", minHeight: "100vh", padding: "24px" }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Page heading ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".09em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {isAdminMode ? "Admin job listing" : activeEmployerName?.toUpperCase()}
          </p>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
            {isEdit ? "Edit Job Listing" : isAdminMode ? "Post Admin Job" : "Post a New Job"}
          </h1>
        </motion.div>

        <form onSubmit={handleFormSubmit}>

          {/* ══ Section 1: Job Info ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<Briefcase size={16} style={{ color: "#6366f1" }} />} title="Job Information" iconBg="#eef2ff" />

            <div className="cjf-grid-2">
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {isAdminMode && (
                  <div>
                    <FL>Shop Name <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></FL>
                    <input
                      name="shopName"
                      type="text"
                      value={formik.values.shopName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. NexGen Mobile Service, Ernakulam"
                      className="cjf-input"
                    />
                    <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 6 }}>
                      Optional — shown on the job listing if provided. Not linked to any employer account.
                    </p>
                  </div>
                )}

                {/* Job Title */}
                <div>
                  <FL required>Job Title</FL>
                  <Autocomplete
                    options={jobTitleOptions}
                    getOptionLabel={o => o.title}
                    value={selectedJob}
                    onChange={handleJobTitleChange}
                    onBlur={() => formik.setFieldTouched("jobTitle", true)}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    loading={titlesLoading}
                    disablePortal
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" placeholder="e.g. Mobile Technician"
                        error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)} />
                    )}
                  />
                  <FE msg={formik.touched.jobTitle && formik.errors.jobTitle} />
                </div>

                {/* Shop Selection — employer accounts only */}
                {!isAdminMode && companies.length > 0 && (
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
                <FL>Job Description</FL>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Optional — describe the role, responsibilities, and ideal candidate…"
                  className={`cjf-textarea ${formik.touched.description && formik.errors.description ? "error" : ""}`}
                  style={{ flex: 1 }}
                  maxLength={4000}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <FE msg={formik.touched.description && formik.errors.description} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: (formik.values.description || "").length >= 4000 ? "#ef4444" : "#94a3b8", marginLeft: "auto" }}>
                    {(formik.values.description || "").length} / 4000 characters
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══ Section 2: Contact ══ */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<Mail size={16} style={{ color: "#0ea5e9" }} />} title="Contact Information" iconBg="#f0f9ff" />

            <div className="cjf-grid-auto">
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
            <SH icon={<MapPin size={16} style={{ color: "#ec4899" }} />} title="Location (optional)" iconBg="#fdf4ff" />

            <div className="cjf-grid-auto">
              {/* Country */}
              <div>
                <FL>Country</FL>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(o) => o.name}
                  value={selectedCountry}
                  onChange={(_, v) => {
                    formik.setFieldValue("country", v ? v.isoCode : "");
                    formik.setFieldValue("state", null);
                    formik.setFieldValue("city", null);
                  }}
                  onBlur={() => formik.setFieldTouched("country", true)}
                  disablePortal
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select country (optional)"
                      error={formik.touched.country && Boolean(formik.errors.country)} />
                  )}
                />
                <FE msg={formik.touched.country && formik.errors.country} />
              </div>

              {/* State */}
              <div>
                <FL>State / Province</FL>
                <Autocomplete
                  options={states}
                  getOptionLabel={o => o.name}
                  value={selectedState}
                  disabled={!formik.values.country}
                  onChange={(_, v) => { formik.setFieldValue("state", v ? v.isoCode : null); formik.setFieldValue("city", null); }}
                  disablePortal
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select state (optional)"
                      error={formik.touched.state && Boolean(formik.errors.state)} />
                  )}
                />
                <FE msg={formik.touched.state && formik.errors.state} />
              </div>

              {/* City */}
              <div>
                <FL>City</FL>
                <Autocomplete
                  freeSolo
                  options={cityOptions}
                  getOptionLabel={getCityLabel}
                  value={selectedCity}
                  disabled={!formik.values.state}
                  onChange={handleCityChange}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  filterOptions={filterCityOptions}
                  disablePortal
                  renderOption={(props, option) => (
                    <li {...props} key={option.isNew ? `new-${option.name}` : option.name}>
                      {option.isNew ? `Add "${option.name}"` : option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Search or type a city (optional)"
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
            <div className="cjf-grid-auto" style={{ marginBottom: 24 }}>
              <div>
                <FL>Salary (optional range)</FL>
                <div className="cjf-salary-wrap">
                  <span className="cjf-salary-prefix">₹</span>
                  <input
                    name="salaryFrom" type="text"
                    value={formik.values.salaryFrom} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`cjf-input cjf-salary-input ${formik.touched.salaryFrom && formik.errors.salaryFrom ? "error" : ""}`}
                    placeholder="e.g. 2000 or 10K"
                  />
                </div>
                <FE msg={formik.touched.salaryFrom && formik.errors.salaryFrom} />
              </div>
              <div>
                <FL>Salary To (optional)</FL>
                <div className="cjf-salary-wrap">
                  <span className="cjf-salary-prefix">₹</span>
                  <input
                    name="salaryTo" type="text"
                    value={formik.values.salaryTo} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={`cjf-input cjf-salary-input ${formik.touched.salaryTo && formik.errors.salaryTo ? "error" : ""}`}
                    placeholder="e.g. 20K (leave empty for single amount)"
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

            {/* Additional job details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 8,
              }}
            >
              <div>
                <FL>Room Available</FL>
                <select
                  name="roomAvailable"
                  value={formik.values.roomAvailable || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <FL>Food Available</FL>
                <select
                  name="foodAvailable"
                  value={formik.values.foodAvailable || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <FL>Incentive</FL>
                <select
                  name="incentive"
                  value={formik.values.incentive || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <FL>Working Time</FL>
                <select
                  name="workingTime"
                  value={formik.values.workingTime || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="9:00 AM – 6:00 PM">9:00 AM – 6:00 PM</option>
                  <option value="10:00 AM – 10:00 PM">10:00 AM – 10:00 PM</option>
                </select>
              </div>

              <div>
                <FL>Working Days</FL>
                <select
                  name="workingDays"
                  value={formik.values.workingDays || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="Monday – Saturday">Monday – Saturday</option>
                  <option value="Monday – Friday">Monday – Friday</option>
                </select>
              </div>

              <div>
                <FL>Holiday</FL>
                <select
                  name="holiday"
                  value={formik.values.holiday || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="Sunday Leave">Sunday Leave</option>
                  <option value="Saturday Leave">Saturday Leave</option>
                  <option value="Monthly Leave (2 Days / 4 Days)">Monthly Leave (2 Days / 4 Days)</option>
                </select>
              </div>

              <div>
                <FL>Probation Period</FL>
                <select
                  name="probationPeriod"
                  value={formik.values.probationPeriod || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="cjf-input"
                >
                  <option value="">Select</option>
                  <option value="No Probation">No Probation</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* ── Job scheduling (optional) ── */}
          <motion.div variants={itemVariants} className="cjf-section">
            <SH icon={<Send size={16} style={{ color: "#6366f1" }} />} title="Job Live Schedule" iconBg="#eef2ff" />
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px" }}>
              Optionally schedule when this job goes live and when it expires. Leave blank to publish immediately.
            </p>
            <div className="cjf-grid-auto-wide">
              <div>
                <FL>Go Live At</FL>
                <input
                  type="datetime-local"
                  name="scheduledLiveAt"
                  value={formik.values.scheduledLiveAt}
                  onChange={formik.handleChange}
                  className="cjf-input"
                />
              </div>
              <div>
                <FL>Expires At</FL>
                <input
                  type="datetime-local"
                  name="expiresAt"
                  value={formik.values.expiresAt}
                  onChange={formik.handleChange}
                  className="cjf-input"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Submit ── */}
          <motion.div variants={itemVariants} className="cjf-form-actions">
            <button type="button" onClick={() => onClose ? onClose() : navigate(isAdminMode ? "/admin/jobs" : -1)}
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