import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import useRequestUser from "@/hooks/useRequestUser";

const StatusBadge = ({ status }) => {
  const cfg = {
    Shortlisted: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
    Rejected: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-500" },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  }[status] ?? { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200", dot: "bg-slate-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 text-[11px]">
      {icon}
    </div>
    <span className="text-[11px] font-medium text-slate-500 w-12 flex-shrink-0">{label}</span>
    <span className="text-xs text-slate-800 font-medium truncate">{value ?? "—"}</span>
  </div>
);

const InfoRow = ({ children }) => (
  <div className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{title}</h3>
    </div>
    <div className="px-3 py-1">{children}</div>
  </div>
);

function ApplicantModal({ isDialogOpen, setIsDialogOpen, application, fetchApplications, setSelectedData }) {
  const [applicationStatus, setApplicationStatus] = useState("");
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const { sendRequest } = useRequestUser();

  const handleDecision = async (applicationId) => {
    if (!applicationStatus) { toast.error("Please select a status option"); return; }
    sendRequest({
      url: `/employer/job-applications/${applicationId}/update_status`,
      method: "POST",
      data: { applicationStatus },
      onSuccess: () => { setSelectedData(null); fetchApplications(); setIsDecisionDialogOpen(false); },
      onError: (err) => console.error("Error changing status:", err),
    });
  };

  if (!application) return null;

  return (
    <>
      <div
        style={{ fontFamily: "'Geist', 'DM Sans', sans-serif" }}
        className="flex flex-col h-full bg-slate-50 min-h-screen"
      >
        {/* ── Header bar ── */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-slate-200 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {application.profileUrl ? (
                <img
                  src={application.profileUrl}
                  alt={application.name}
                  className="w-10 h-10 object-cover rounded-full border border-slate-200 bg-slate-50"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback avatar */}
              <div
                className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center border border-blue-200"
                style={{ display: application.profileUrl ? 'none' : 'flex' }}
              >
                {application.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Application</p>
                <h2 className="text-base font-bold text-slate-900 leading-none">{application.name}</h2>
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <select
              className="w-36 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              value={applicationStatus}
              onChange={(e) => setApplicationStatus(e.target.value)}
            >
              <option value="">Update status…</option>
              <option value="Shortlisted">Shortlist</option>
              <option value="Rejected">Reject</option>
              <option value="Pending">Pending</option>
            </select>
            <button
              onClick={() => { applicationStatus ? setIsDecisionDialogOpen(true) : toast.error("Please select a status option"); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

          {/* Personal info */}
          <Section title="Personal Information">
            <InfoRow>
              <InfoItem icon="👤" label="Name" value={application.name} />
              <InfoItem icon="📞" label="Phone" value={application.phone} />
            </InfoRow>
            <InfoRow>
              <InfoItem icon="✉️" label="Email" value={application.email} />
              <InfoItem icon="📍" label="Location" value={application.location} />
            </InfoRow>
          </Section>

          {/* Education */}
          <Section title="Education">
            {application.education?.length > 0 ? (
              <div className="py-2 space-y-3">
                {application.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">{edu.qualification}</h4>
                      <p className="text-[11px] text-slate-500">{edu.institute}</p>
                      <p className="text-[10px] text-slate-400">{edu.startYear} - {edu.endYear || 'Present'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1.5 italic cursor-default">Education not added</p>
            )}
          </Section>

          {/* Experience */}
          <Section title="Experience">
            {application.experience?.length > 0 ? (
              <div className="py-2 space-y-3">
                {application.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">{exp.jobTitle}</h4>
                      <p className="text-[11px] text-slate-500">{exp.company}</p>
                      <p className="text-[10px] text-slate-400">{exp.startYear} - {exp.endYear || 'Present'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1.5 italic cursor-default">Experience not added</p>
            )}
          </Section>

          {/* Documents */}
          {application.resume && (
            <Section title="Documents">
              <div className="py-2 space-y-1.5">
                {[
                  { label: "Resume", value: application.resume },
                  ...(application.additionalFile ? [{ label: "Additional File", value: application.additionalFile }] : [])
                ].map(({ label, value }) => (
                  <a
                    key={label}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center gap-2 px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">📄</div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-700">{label}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{value}</p>
                    </div>
                    <span className="ml-auto text-slate-300 group-hover:text-blue-400 text-xs">↗</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Cover letter */}
          {application.coverLetter && (
            <Section title="Cover Letter">
              <div className="py-2">
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </Section>
          )}
        </div>

        {/* ── Footer action bar ── */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="px-4 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* ── Confirm dialog ── */}
      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Confirm status change</DialogTitle>
          </DialogHeader>
          <div className="mt-2 mb-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              {applicationStatus === "Shortlisted"
                ? "You're about to shortlist this applicant. They'll be moved to your shortlist pipeline."
                : applicationStatus === "Rejected"
                  ? "You're about to reject this application. This action cannot be undone."
                  : "You're about to mark this application as pending."}
            </p>
            <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 text-xs">New status:</span>
              <StatusBadge status={applicationStatus} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDecisionDialogOpen(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDecision(application?._id)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 active:scale-95 transition-all"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ApplicantModal;