import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, MapPin } from "lucide-react";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance.jsx";
import { setEmployer } from "@/redux/slices/employer";

const Settings = () => {
  const employer = useSelector((state) => state.employer.employer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!employer?.employerId) return;
    employerAxiosInstance
      .get(`/employer-by-id/${employer.employerId}`)
      .then((res) => {
        if (res?.data?.employerData) {
          dispatch(setEmployer(res.data.employerData));
        }
      })
      .catch(() => {});
  }, [employer?.employerId, dispatch]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
            Account
          </p>
          <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Account details
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Your profile</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage your shop owner account. No document upload is required to post jobs.
            </p>
          </div>
          <div className="p-5 md:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-900">{employer?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mobile</p>
                <p className="text-sm font-medium text-slate-900">{employer?.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
                <p className="text-sm font-medium text-slate-900">{employer?.location || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
