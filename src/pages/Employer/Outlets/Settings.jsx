import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, ShieldAlert, ShieldQuestion, XCircle, ChevronRight } from "lucide-react";
import VerificationForm from "./VerificationForm";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance.jsx";
import { setEmployer } from "@/redux/slices/employer";

const Settings = () => {
  const employer = useSelector((state) => state.employer.employer);
  const dispatch = useDispatch();
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const hasVerificationDocs =
    !!employer?.ownerName ||
    !!employer?.ownerAddress ||
    !!employer?.aadharFront ||
    !!employer?.aadharBack ||
    !!employer?.certificate;

  const verificationStatus =
    employer?.isVerified || (hasVerificationDocs ? "Requested" : "NotVerified");

  const isVerified = verificationStatus === "Verified";
  const isPending = verificationStatus === "Requested";
  const isRejected = verificationStatus === "Rejected";

  useEffect(() => {
    if (!employer?.employerId) return;
    // Refresh employer data so verification status and rejection reason stay in sync
    employerAxiosInstance
      .get(`/employer-by-id/${employer.employerId}`)
      .then((res) => {
        if (res?.data?.employerData) {
          dispatch(setEmployer(res.data.employerData));
        }
      })
      .catch(() => {
        // best-effort refresh; ignore errors here
      });
  }, [employer?.employerId, dispatch]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page heading */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
            Account
          </p>
          <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Account & verification
          </h1>
        </div>

        {/* Verification section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              Verification status
            </h2>
          </div>
          <div className="p-5 md:p-6">
            {isVerified ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </span>
                  <p className="text-sm text-slate-600">
                    Your account is verified. You can post jobs and manage your listings.
                  </p>
                </div>
              </div>
            ) : isPending ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shrink-0"
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <ShieldQuestion className="h-4 w-4" />
                    Pending
                  </span>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">
                      Verification pending
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Your verification request has been sent. Admin will review your documents and update your status soon.
                    </p>
                  </div>
                </div>
              </div>
            ) : isRejected && !showVerificationForm ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shrink-0"
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Rejected
                  </span>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">
                      Verification rejected
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Your previous verification request was rejected.
                    </p>
                    {employer?.verificationRejectedReason && (
                      <p className="mt-1 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        <span className="font-semibold">Reason: </span>
                        {employer.verificationRejectedReason}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">
                      You can submit updated documents again using the button on the right.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVerificationForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#dc2626,#ef4444)",
                    boxShadow: "0 4px 12px rgba(239,68,68,.28)",
                  }}
                >
                  Resubmit verification
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : showVerificationForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-slate-600">
                    Complete the form below to submit your verification request. Admin will review your documents.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowVerificationForm(false)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>
                <VerificationForm
                  embedded
                  onComplete={() => setShowVerificationForm(false)}
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shrink-0"
                    style={{
                      background: "#fffbeb",
                      color: "#b45309",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Not verified
                  </span>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">
                      Account not verified
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Verify your account to unlock full access. Submit your details and documents for review.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVerificationForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                    boxShadow: "0 4px 12px rgba(99,102,241,.3)",
                  }}
                >
                  Start verification
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
