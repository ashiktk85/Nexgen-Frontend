import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  employerCompanyCreation,
  employerCompanyUpdate,
} from "@/apiServices/userApi";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Mail, Phone, MapPin, Globe,
  FileText, Upload, Image as ImageIcon, Link2, Plus, X, Send, Pencil,
  CheckCircle2, Info
} from "lucide-react";
import LocationPicker from "./LocationPicker";

/* ─── Inject styles ─── */
if (!document.getElementById("cf-styles")) {
  const s = document.createElement("style");
  s.id = "cf-styles";
  s.textContent = `
    .cf-input {
      width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; box-sizing:border-box;
    }
    .cf-input:focus { border-color:#a855f7; box-shadow:0 0 0 3px rgba(168,85,247,.12); background:#fff; }
    .cf-input.error { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,.1); }

    .cf-textarea {
      width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px;
      font-size:13.5px; font-family:'DM Sans',sans-serif; color:#1e293b;
      background:#f8fafc; transition:all .2s; outline:none; resize:vertical;
      min-height:120px; box-sizing:border-box; line-height:1.6;
    }
    .cf-textarea:focus { border-color:#a855f7; box-shadow:0 0 0 3px rgba(168,85,247,.12); background:#fff; }
    .cf-textarea.error { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,.1); }

    .cf-label {
      display:block; font-size:11px; font-weight:700; color:#64748b;
      letter-spacing:.07em; text-transform:uppercase; margin-bottom:7px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .cf-error { font-size:11.5px; color:#ef4444; margin-top:5px; display:flex; align-items:center; gap:4px; }

    .cf-section {
      background:#fff; border:1.5px solid #e8edf5; border-radius:16px; padding:24px;
      margin-bottom:20px;
    }
    .cf-section-title {
      display:flex; align-items:center; gap:9px; margin:0 0 20px;
    }
    .cf-section-icon {
      width:32px; height:32px; border-radius:9px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
    }

    .cf-drop-zone {
      border:2px dashed #e2e8f0; border-radius:12px; padding:20px 16px;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:8px; cursor:pointer; transition:all .2s; background:#fafbff;
    }
    .cf-drop-zone:hover { border-color:#a855f7; background:#faf5ff; }

    .cf-file-chip {
      display:flex; align-items:center; gap:10px; background:#faf5ff;
      border:1.5px solid #e9d5ff; border-radius:10px; padding:10px 14px;
    }

    .cf-social-chip {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 12px; border-radius:999px; font-size:12px; font-weight:600;
      cursor:pointer; transition:all .18s ease; border:1.5px solid;
      font-family:'Plus Jakarta Sans',sans-serif; user-select:none;
    }
    .cf-social-chip.off { background:#f8fafc; border-color:#e2e8f0; color:#64748b; }
    .cf-social-chip.off:hover { border-color:#e9d5ff; color:#a855f7; background:#faf5ff; }
    .cf-social-chip.on  { background:linear-gradient(135deg,#a855f7,#c084fc); border-color:transparent; color:#fff; box-shadow:0 3px 8px rgba(168,85,247,.25); }

    .cf-submit-btn {
      display:inline-flex; align-items:center; justifyContent:center; gap:8px;
      padding:13px 32px; border-radius:12px; border:none; cursor:pointer;
      font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
      background:linear-gradient(135deg,#a855f7,#c084fc); color:#fff;
      box-shadow:0 6px 20px rgba(168,85,247,.35); transition:all .2s ease;
      width: 100%;
    }
    .cf-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(168,85,247,.45); }
    .cf-submit-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }
  `;
  document.head.appendChild(s);
}

const availableSocials = ["LinkedIn", "Twitter", "Facebook"];

/* ─── Helpers ─── */
const FL = ({ children, required }) => (
  <label className="cf-label">{children}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}</label>
);
const FE = ({ msg }) => msg ? <p className="cf-error"><X size={11} />{msg}</p> : null;

const SH = ({ icon, title, iconBg }) => (
  <div className="cf-section-title">
    <div className="cf-section-icon" style={{ background: iconBg }}>{icon}</div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
  </div>
);

const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .38, ease: "easeOut" } } };

/* ══════════════════════════════════════════════ */
const CompanyForm = ({ company = null }) => {
  const [selectedSocials, setSelectedSocials] = useState([]);
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();

  const isEditMode = !!company;

  const initialValues = {
    companyName: company?.companyName || "",
    email: company?.email || "",
    phone: company?.phone || "",
    address: company?.address || "",
    companyCertificate: null,
    about: company?.about || "",
    webSite: company?.webSite || "",
    socialLinks: {
      linkedin: company?.socialLinks?.linkedin || "",
      twitter: company?.socialLinks?.twitter || "",
      facebook: company?.socialLinks?.facebook || "",
    },
    location: {
      lat: company?.location?.lat || null,
      lng: company?.location?.lng || null,
      address: company?.location?.address || ""
    },
    // gallery images (5 optional slots)
    existingImages: company?.images || [],
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    showLocation: company?.showLocation ?? true,
  };

  useEffect(() => {
    if (company) {
      const existingSocials = availableSocials.filter(
        (social) => company?.socialLinks?.[social.toLowerCase()]
      );
      setSelectedSocials(existingSocials);
    }
  }, [company]);

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = {};
      if (!values.companyName) errors.companyName = "Shop Name is required";
      if (!values.email) errors.email = "Email is required";
      if (!values.phone) errors.phone = "Phone is required";
      if (!values.address) errors.address = "Address is required";
      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("companyName", values.companyName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("about", values.about);
      formData.append("webSite", values.webSite);

      const filteredSocialLinks = {};
      selectedSocials.forEach(s => {
        filteredSocialLinks[s.toLowerCase()] = values.socialLinks[s.toLowerCase()];
      });
      formData.append("socialLinks", JSON.stringify(filteredSocialLinks));
      formData.append("location", JSON.stringify(values.location));
      formData.append("showLocation", values.showLocation ? "true" : "false");

      if (values.companyCertificate instanceof File) {
        formData.append(
          "images",
          new File(
            [values.companyCertificate],
            "companyCertificate" + getFileExtension(values.companyCertificate.name),
            { type: values.companyCertificate.type }
          )
        );
      }

      // send kept existing gallery images (for edit)
      if (values.existingImages && values.existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(values.existingImages));
      }

      // send new gallery images from 5 individual slots (max 5 total with existing)
      const existingCount = values.existingImages ? values.existingImages.length : 0;
      const maxNew = Math.max(0, 5 - existingCount);
      const slotFiles = [values.image1, values.image2, values.image3, values.image4, values.image5].filter(
        (f) => f instanceof File
      );
      slotFiles.slice(0, maxNew).forEach((file, idx) => {
        formData.append(
          "images",
          new File(
            [file],
            `gallery-${idx + 1}` + getFileExtension(file.name),
            { type: file.type }
          )
        );
      });

      try {
        let response;
        if (isEditMode && company?._id) {
          response = await employerCompanyUpdate(company._id, formData);
        } else {
          response = await employerCompanyCreation(formData, Employer?.employerId);
        }

        if (response) {
          toast.success(isEditMode ? "Shop updated!" : "Shop created!");
          navigate("/employer/company_details");
        } else {
          toast.error("An unexpected error occurred");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  const getFileExtension = (filename) => filename.substring(filename.lastIndexOf("."));

  const toggleSocial = (social) => {
    setSelectedSocials(prev => prev.includes(social) ? prev.filter(s => s !== social) : [...prev, social]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>

      {/* ── Section 1: Basic Info ── */}
      <motion.div variants={itemVariants} className="cf-section">
        <SH icon={<Building2 size={16} style={{ color: "#a855f7" }} />} title="Basic Information" iconBg="#faf5ff" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <FL required>Shop Name</FL>
              <input
                name="companyName" type="text" value={formik.values.companyName}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="E.g. Acme Corp"
                className={`cf-input ${formik.touched.companyName && formik.errors.companyName ? "error" : ""}`}
              />
              <FE msg={formik.touched.companyName && formik.errors.companyName} />
            </div>
            <div>
              <FL>Website</FL>
              <input
                name="webSite" type="url" value={formik.values.webSite}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="https://acme.com"
                className={`cf-input ${formik.touched.webSite && formik.errors.webSite ? "error" : ""}`}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <FL>About Shop</FL>
            <textarea
              name="about" value={formik.values.about}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              placeholder="Tell us about the shop, its mission, and culture..."
              className={`cf-textarea ${formik.touched.about && formik.errors.about ? "error" : ""}`}
              style={{ flex: 1, minHeight: 100 }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Location ── */}
      <motion.div variants={itemVariants} className="cf-section">
        <SH icon={<MapPin size={16} style={{ color: "#ec4899" }} />} title="Shop Location" iconBg="#fdf4ff" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <FL>Pin Shop Location</FL>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Select your shop on the map for better reach. You can search, use GPS, or click to pin.</p>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#64748b", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!formik.values.showLocation}
              onChange={(e) => formik.setFieldValue("showLocation", !e.target.checked ? true : false)}
              style={{ width: 14, height: 14 }}
            />
            Don&apos;t show location
          </label>
        </div>
        {formik.values.showLocation && (
          <LocationPicker
            value={formik.values.location}
            onChange={(loc) => {
              formik.setFieldValue("location", loc);
              if (loc.address && !formik.values.address) {
                formik.setFieldValue("address", loc.address);
              }
            }}
          />
        )}
      </motion.div>

      {/* ── Section 3: Contact Details ── */}
      <motion.div variants={itemVariants} className="cf-section">
        <SH icon={<Mail size={16} style={{ color: "#0ea5e9" }} />} title="Contact Details" iconBg="#f0f9ff" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <FL required>Email Address</FL>
              <input
                name="email" type="email" value={formik.values.email}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="contact@company.com"
                className={`cf-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
              />
              <FE msg={formik.touched.email && formik.errors.email} />
            </div>
            <div>
              <FL required>Phone Number</FL>
              <input
                name="phone" type="tel" value={formik.values.phone}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="Phone number"
                className={`cf-input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
              />
              <FE msg={formik.touched.phone && formik.errors.phone} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <FL required>Address</FL>
            <textarea
              name="address" value={formik.values.address}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              placeholder="Complete shop address..."
              className={`cf-textarea ${formik.touched.address && formik.errors.address ? "error" : ""}`}
              style={{ flex: 1, minHeight: 80 }}
            />
            <FE msg={formik.touched.address && formik.errors.address} />
          </div>
        </div>
      </motion.div>

      {/* ── Section 3: Media & Documents ── */}
      <motion.div variants={itemVariants} className="cf-section">
        <SH icon={<ImageIcon size={16} style={{ color: "#ec4899" }} />} title="Media & Documents" iconBg="#fdf4ff" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {/* Certificate */}
          <div>
            <FL>Shop Certificate <span style={{ fontWeight: 400, textTransform: "none", color: "#94a3b8" }}>(PDF only)</span></FL>

            <AnimatePresence mode="wait">
              {formik.values.companyCertificate ? (
                <motion.div key="cert-chip" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="cf-file-chip">
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "#fdf4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={16} style={{ color: "#ec4899" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {formik.values.companyCertificate instanceof File ? formik.values.companyCertificate.name : "Shop Certificate"}
                    </p>
                  </div>
                  <button type="button" onClick={() => formik.setFieldValue("companyCertificate", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center", borderRadius: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <label key="cert-drop" htmlFor="cert-upload" className="cf-drop-zone">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fdf4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Upload size={17} style={{ color: "#ec4899" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#ec4899" }}>Upload Certificate</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>PDF only</span>
                </label>
              )}
            </AnimatePresence>
            <input id="cert-upload" type="file" accept="application/pdf" onChange={(e) => { if (e.target.files[0]) formik.setFieldValue("companyCertificate", e.target.files[0]) }} style={{ display: "none" }} />
          </div>

          {/* Gallery images (5 optional slots) */}
          <div>
            <FL>Shop Photos <span style={{ fontWeight: 400, textTransform: "none", color: "#94a3b8" }}>(Up to 5 images)</span></FL>

            {/* Existing images (edit mode) */}
            {formik.values.existingImages && formik.values.existingImages.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {formik.values.existingImages.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", width: 54, height: 54, borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <img src={img} alt={`Shop ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...formik.values.existingImages];
                        next.splice(idx, 1);
                        formik.setFieldValue("existingImages", next);
                      }}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 18,
                        height: 18,
                        borderRadius: "999px",
                        border: "none",
                        background: "rgba(15,23,42,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#e5e7eb",
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {[1, 2, 3, 4, 5].map((slot) => {
              const fieldName = `image${slot}`;
              const file = formik.values[fieldName];
              return (
                <div key={slot} style={{ marginBottom: 8 }}>
                  <label
                    htmlFor={`gallery-slot-${slot}`}
                    className="cf-drop-zone"
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      gap: 10,
                      width: "100%",           // match certificate row width
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,           // square thumbnail
                        borderRadius: 10,
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {file instanceof File ? (
                        // simple thumbnail using object URL
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Slot ${slot}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Upload size={17} style={{ color: "#2563eb" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                        {file instanceof File ? file.name : `Select image ${slot} (optional)`}
                      </p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                        JPG, PNG or WEBP
                      </p>
                    </div>
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          formik.setFieldValue(fieldName, null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 6,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                  <input
                    id={`gallery-slot-${slot}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) formik.setFieldValue(fieldName, f);
                    }}
                    style={{ display: "none" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Section 4: Social Links ── */}
      <motion.div variants={itemVariants} className="cf-section">
        <SH icon={<Link2 size={16} style={{ color: "#10b981" }} />} title="Social Links" iconBg="#ecfdf5" />

        <div style={{ marginBottom: 16 }}>
          <FL>Select Platforms</FL>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {availableSocials.map(social => (
              <div
                key={social}
                onClick={() => toggleSocial(social)}
                className={`cf-social-chip ${selectedSocials.includes(social) ? "on" : "off"}`}
              >
                {selectedSocials.includes(social) && <CheckCircle2 size={12} />}
                {social}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence>
            {selectedSocials.map(social => {
              const key = social.toLowerCase();
              return (
                <motion.div key={key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <FL>{social} URL</FL>
                  <input
                    name={`socialLinks.${key}`} type="url" value={formik.values.socialLinks[key]}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder={`https://${key}.com/your-page`}
                    className="cf-input"
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Actions ── */}
      <motion.div variants={itemVariants} style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={() => navigate(-1)}
          style={{ padding: "13px 24px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .18s", flex: 1 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.color = "#4f46e5"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
        >
          Cancel
        </button>
        <button type="submit" disabled={formik.isSubmitting} className="cf-submit-btn" style={{ flex: 2 }}>
          {formik.isSubmitting ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "ejl-spin .65s linear infinite" }} />
              Saving...
            </span>
          ) : (
            <>
              {isEditMode ? <Pencil size={18} /> : <CheckCircle2 size={18} />}
              {isEditMode ? "Update Shop Info" : "Save Shop Info"}
            </>
          )}
        </button>
      </motion.div>

    </form>
  );
};

export default CompanyForm;
