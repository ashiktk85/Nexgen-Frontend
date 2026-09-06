import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { applyAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { phone: "", location: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .trim()
        .matches(/^\+?[1-9]\d{9,14}$/, "Enter a valid mobile number (10+ digits)")
        .required("Mobile number is required"),
      location: Yup.string().trim().max(120, "Location is too long"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const { data } = await authService.completeProfile({
          phone: values.phone.trim(),
          location: values.location.trim() || undefined,
        });
        const token = localStorage.getItem("token");
        if (token && data?.user) {
          applyAuth(token, data.user);
        }
        toast.success("Profile completed!");
        navigate("/", { replace: true });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Could not save profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <TechpathBrand {...BRAND_SIZES.compact} className="mb-6" />
        <h1 className="text-xl font-bold text-slate-900 mb-1">Complete your profile</h1>
        <p className="text-sm text-slate-500 mb-6">
          A mobile number is required to continue on TechPath.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Mobile number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="+91 9876543210"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm min-h-[44px]"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-red-600 mt-1">{formik.errors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Location (optional)
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="City, State"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[44px] rounded-lg bg-[#0058be] text-white font-semibold text-sm hover:bg-[#004a9e] disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
