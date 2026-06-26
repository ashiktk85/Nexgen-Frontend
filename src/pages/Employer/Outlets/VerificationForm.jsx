import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChevronRight, ChevronLeft, Check, Upload, X, Building2, CreditCard, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { setEmployer } from "@/redux/slices/employer";
import { Link, useNavigate } from "react-router-dom";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";

/* ─── constants ─── */
const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const validationSchema = Yup.object({
  name: Yup.string().min(2, "At least 2 characters required").required("Company name is required"),
  address: Yup.string().min(10, "Please enter your complete address").required("Address is required"),
  location: Yup.string().min(2, "At least 2 characters required").required("Location is required"),
  aadharFront: Yup.mixed()
    .required("Aadhar front image is required")
    .test("fileSize", "File must be under 5MB", (v) => v?.size <= MAX_FILE_SIZE)
    .test("fileType", "Only JPG, PNG or WEBP allowed", (v) => ACCEPTED_IMAGE_TYPES.includes(v?.type)),
  aadharBack: Yup.mixed()
    .required("Aadhar back image is required")
    .test("fileSize", "File must be under 5MB", (v) => v?.size <= MAX_FILE_SIZE)
    .test("fileType", "Only JPG, PNG or WEBP allowed", (v) => ACCEPTED_IMAGE_TYPES.includes(v?.type)),
  shopCertificate: Yup.mixed()
    .required("Shop certificate is required")
    .test("fileSize", "File must be under 5MB", (v) => v?.size <= MAX_FILE_SIZE)
    .test("fileType", "Only JPG, PNG or WEBP allowed", (v) => ACCEPTED_IMAGE_TYPES.includes(v?.type)),
});

const STEPS = [
  { id: 1, title: "Basic Info",     subtitle: "Company details",    icon: Building2,  fields: ["name", "address", "location"] },
  { id: 2, title: "Aadhar Card",    subtitle: "Identity document",  icon: CreditCard, fields: ["aadharFront", "aadharBack"] },
  { id: 3, title: "Shop Details",   subtitle: "Business certificate", icon: FileText, fields: ["shopCertificate"] },
];

/* ─── file upload dropzone ─── */
function FileUpload({ label, hint, value, previewUrl, error, touched, onChange, onClear }) {
  const inputRef = React.useRef();
  const [dragging, setDragging] = React.useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <img src={previewUrl} alt={label} className="w-full max-h-48 object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={onClear}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-3">
            <p className="text-xs text-white font-medium truncate">{value?.name}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : touched && error
              ? "border-red-300 bg-red-50/40"
              : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
          }`}
        >
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">Drop file here or <span className="text-blue-600">browse</span></p>
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }}
      />
      {touched && error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center flex-shrink-0">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── main component ─── */
export default function VerificationForm({ embedded = false, onComplete }) {
  const dispatch = useDispatch();
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [previews, setPreviews] = React.useState({ aadharFront: null, aadharBack: null, shopCertificate: null });

  const formik = useFormik({
    initialValues: { name: "", address: "", location: "", aadharFront: null, aadharBack: null, shopCertificate: null },
    validationSchema,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (!Employer) { toast.error("Please login"); navigate("/employer-login"); return; }
      if (Employer?.isVerified === "Verified") {
        toast.info("Your account is already verified.");
        return;
      }
      setSubmitting(true);
      try {
        const getExt = (n) => n.substring(n.lastIndexOf("."));
        const formData = new FormData();
        formData.append("email", Employer.email);
        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("location", values.location);
        formData.append("images", new File([values.aadharFront], "aadharFront" + getExt(values.aadharFront.name), { type: values.aadharFront.type }));
        formData.append("images", new File([values.aadharBack],  "aadharBack"  + getExt(values.aadharBack.name),  { type: values.aadharBack.type  }));
        formData.append("images", new File([values.shopCertificate], "certificate" + getExt(values.shopCertificate.name), { type: values.shopCertificate.type }));

        const res = await employerAxiosInstnce.post("/employer-verification", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res?.data) {
          toast.success(res.data.message || "Verification request submitted!");
          if (res.data.employerData) {
            dispatch(setEmployer({
              ...Employer,
              isVerified: res.data.employerData.isVerified ?? "Requested",
            }));
          } else {
            dispatch(setEmployer({ ...Employer, isVerified: "Requested" }));
          }
          setTimeout(() => onComplete ? onComplete() : navigate("/employer/company_details"), 1200);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addPreview = (file, key) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreviews((p) => ({ ...p, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  const clearFile = (key) => {
    formik.setFieldValue(key, null);
    formik.setFieldTouched(key, false);
    setPreviews((p) => ({ ...p, [key]: null }));
  };

  const handleFile = (file, key) => {
    formik.setFieldValue(key, file);
    formik.setFieldTouched(key, true);
    addPreview(file, key);
  };

  /* validate current step fields before advancing */
  const goNext = async () => {
    const fields = STEPS[currentStep - 1].fields;
    // touch all fields in this step
    const touched = {};
    fields.forEach((f) => (touched[f] = true));
    await formik.setTouched({ ...formik.touched, ...touched }, true);

    // validate only current step fields
    const errors = await formik.validateForm();
    const stepErrors = fields.filter((f) => errors[f]);
    if (stepErrors.length === 0) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const stepMeta = STEPS[currentStep - 1];
  const StepIcon = stepMeta.icon;

  /* progress pct */
  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const formBody = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* step indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* steps row */}
        <div className="flex px-6 py-4 gap-2">
          {STEPS.map((step, i) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    done   ? "bg-emerald-500 text-white" :
                    active ? "bg-blue-600 text-white shadow-md shadow-blue-200" :
                             "bg-slate-100 text-slate-400"
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-semibold leading-tight ${active ? "text-slate-900" : done ? "text-emerald-600" : "text-slate-400"}`}>
                      {step.title}
                    </p>
                    <p className={`text-xs leading-tight ${active ? "text-slate-500" : "text-slate-300"}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 flex items-center px-2">
                    <div className={`h-px flex-1 transition-colors ${currentStep > step.id ? "bg-emerald-300" : "bg-slate-200"}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* form card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 pt-6 pb-2 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{stepMeta.title}</h3>
            <p className="text-xs text-slate-500">Step {currentStep} of {STEPS.length} — {stepMeta.subtitle}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Step 1 — Basic Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Company / Business Name</label>
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Acme Technologies Pvt Ltd"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center flex-shrink-0">!</span>
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Registered Address</label>
                <textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your full business address including city and pincode"
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center flex-shrink-0">!</span>
                    {formik.errors.address}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. City, State"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    formik.touched.location && formik.errors.location
                      ? "border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center flex-shrink-0">!</span>
                    {formik.errors.location}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 2 — Aadhar */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FileUpload
                label="Aadhar Card — Front"
                hint="JPG, PNG or WEBP · max 5MB"
                value={formik.values.aadharFront}
                previewUrl={previews.aadharFront}
                error={formik.errors.aadharFront}
                touched={formik.touched.aadharFront}
                onChange={(f) => handleFile(f, "aadharFront")}
                onClear={() => clearFile("aadharFront")}
              />
              <FileUpload
                label="Aadhar Card — Back"
                hint="JPG, PNG or WEBP · max 5MB"
                value={formik.values.aadharBack}
                previewUrl={previews.aadharBack}
                error={formik.errors.aadharBack}
                touched={formik.touched.aadharBack}
                onChange={(f) => handleFile(f, "aadharBack")}
                onClear={() => clearFile("aadharBack")}
              />
            </div>
          )}

          {/* Step 3 — Certificate */}
          {currentStep === 3 && (
            <FileUpload
              label="Shop / Business Certificate"
              hint="Upload your official shop registration certificate · JPG, PNG or WEBP · max 5MB"
              value={formik.values.shopCertificate}
              previewUrl={previews.shopCertificate}
              error={formik.errors.shopCertificate}
              touched={formik.touched.shopCertificate}
              onChange={(f) => handleFile(f, "shopCertificate")}
              onClear={() => clearFile("shopCertificate")}
            />
          )}
        </div>

        {/* footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit Verification
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* cancel / back link */}
      <div>
        {embedded ? (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </button>
        ) : (
          <Link
            to="/employer/company_details"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel and go back
          </Link>
        )}
      </div>
    </form>
  );

  if (embedded) {
    return <div className="max-w-2xl">{formBody}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* brand */}
        <div className="mb-8">
          <TechpathBrand {...BRAND_SIZES.compact} className="mb-3" />
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Verify your Account</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Complete the verification steps below to start posting jobs and hiring.
          </p>
        </div>
        {formBody}
      </div>
    </div>
  );
}