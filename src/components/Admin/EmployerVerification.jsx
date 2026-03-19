import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { toast } from "sonner";
import {
  getAllEmployerVerification,
  employerVerificationChangeStatus,
  getEmployerVerificationDetails,
} from "@/apiServices/adminApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ─────────────────── tiny helpers ─────────────────── */
const STATUS_META = {
  requested:   { label: "Requested",   color: "bg-amber-100 text-amber-700 border-amber-200"  },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-700 border-red-200"         },
  verified:    { label: "Verified",    color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  notverified: { label: "Unverified",  color: "bg-slate-100 text-slate-600 border-slate-200"   },
};

const TABS = ["requested", "rejected", "verified", "notverified"];

const Badge = ({ status }) => {
  const m = STATUS_META[status?.toLowerCase()] ?? STATUS_META.requested;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${m.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {m.label}
    </span>
  );
};

const Avatar = ({ name }) => {
  const safeName = typeof name === "string" ? name : "";
  const initials = safeName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const baseCharCode = safeName.charCodeAt(0) || 65;
  const hue = (baseCharCode * 11) % 360;
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold flex-shrink-0"
      style={{ background: `hsl(${hue},55%,50%)` }}
    >
      {initials || "?"}
    </span>
  );
};

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

const DocImg = ({ src, label, onViewLarge }) => (
  <div>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
    {src ? (
      <button
        type="button"
        onClick={() => onViewLarge?.(src, label)}
        className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group relative block text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
      >
        <img src={src} alt={label} className="w-full object-contain max-h-52" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-slate-800/90 px-3 py-1.5 rounded-lg">
            View large
          </span>
        </span>
      </button>
    ) : (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 h-32 flex items-center justify-center">
        <p className="text-sm text-slate-400">Not provided</p>
      </div>
    )}
  </div>
);

// New: render doc inside an iframe preview and open full in new tab on click
const IframeDoc = ({ src, label, onViewLarge }) => {
  if (!src) {
    return (
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 h-32 flex items-center justify-center">
          <p className="text-sm text-slate-400">Not provided</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
        <iframe
          title={label}
          src={src}
          className="w-full h-48"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // stop propagation if any parent handlers
            e.stopPropagation();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors text-white text-sm font-medium"
        >
          <span className="bg-slate-800/90 px-3 py-1.5 rounded-lg">Open full</span>
        </a>
        <button
          type="button"
          onClick={() => onViewLarge?.(src, label)}
          className="absolute right-3 bottom-3 bg-white/90 text-slate-800 px-2 py-1 rounded-md text-xs border border-slate-200 hover:shadow"
        >
          View large
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── confirm dialog ─────────────────── */
function ConfirmDialog({ open, onClose, onConfirm, decision, loading, reason, setReason }) {
  const isAccept = decision === "Verified";
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAccept ? "Verify this employer?" : "Reject this application?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAccept
              ? "The employer will be marked as verified and notified."
              : "This application will be rejected. You can provide a reason below, which the employer will see."}
          </AlertDialogDescription>
          {!isAccept && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Rejection reason
              </label>
              <textarea
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain briefly why the verification was rejected..."
              />
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Processing…"
              : isAccept
              ? "Yes, Verify"
              : "Yes, Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ─────────────────── side panel ─────────────────── */
function DetailPanel({ details, onClose, onAction, activeTab, actionLoading }) {
  const [largeImage, setLargeImage] = useState(null);
  if (!details) return null;
  const canAct = activeTab === "requested";
  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={details.ownerName} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{details.name}</p>
            <p className="text-xs text-slate-500 truncate">{details.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          {/* action buttons at top (only for requested tab) */}
          {canAct && (
            <>
              <button
                onClick={() => onAction("Rejected")}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => onAction("Verified")}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Verify
              </button>
            </>
          )}
          <Badge status={details.status?.toLowerCase()} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* info grid */}
        <section>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Company Info</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Owner", details.ownerName],
              ["Company", details.name],
              ["Email", details.email],
              ["Address", details.address],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                <p className="text-sm font-medium text-slate-800 break-all">{v || "—"}</p>
              </div>
            ))}
          </div>
        </section>

        {/* timeline */}
        <section>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Timeline</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Submitted</span>
              <span className="font-medium text-slate-700">{details.createdAt ? new Date(details.createdAt).toLocaleString() : "—"}</span>
            </div>
            {details.updatedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-700">{new Date(details.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </section>

        {/* documents */}
        <section>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Documents</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <IframeDoc src={details.documents?.aadharFront} label="Aadhar — Front" onViewLarge={(src, label) => setLargeImage({ src, label })} />
              <IframeDoc src={details.documents?.aadharBack}  label="Aadhar — Back"  onViewLarge={(src, label) => setLargeImage({ src, label })} />
            </div>
            <IframeDoc src={details.documents?.certificate} label="Shop Certificate" onViewLarge={(src, label) => setLargeImage({ src, label })} />
          </div>
        </section>
      </div>

      {/* view large image dialog */}
      <Dialog open={!!largeImage} onOpenChange={(open) => !open && setLargeImage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b border-slate-200 shrink-0">
            <DialogTitle className="text-base font-bold text-slate-900">
              {largeImage?.label ?? "Document"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100 min-h-[50vh]">
            {largeImage?.src && (
              <img
                src={largeImage.src}
                alt={largeImage.label}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* no bottom footer; actions moved to header */}
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
const EmployerVerification = () => {
  const [tableData,    setTableData]    = useState([]);
  const [activeTab,    setActiveTab]    = useState("requested");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [searchTerm,   setSearchTerm]   = useState("");

  // side sheet
  const [panelDetails,  setPanelDetails]  = useState(null);
  const [panelLoading,  setPanelLoading]  = useState(false);
  const [selectedId,    setSelectedId]    = useState(null);

  // confirm dialog
  const [confirmOpen,    setConfirmOpen]    = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [actionLoading,   setActionLoading]  = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const rowsPerPage = 20;

  // Debounce search so backend is not hit on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 when search changes (tab change already resets in switchTab)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  /* fetch list — backend search and pagination */
  const fetchList = useCallback(async (page, tab, search = "") => {
    setLoading(true);
    try {
      const typeMap = {
        requested:   "Requested",
        rejected:    "Rejected",
        verified:    "Verified",
        notverified: "NotVerified",
      };
      const result = await getAllEmployerVerification(page, rowsPerPage, typeMap[tab], search);
      if (result?.data?.response) {
        const { EmployerApplications, totalPages } = result.data.response;
        setTableData(EmployerApplications ?? []);
        setTotalPages(Math.max(1, totalPages ?? 1));
      }
    } catch {
      toast.error("Failed to load verification applications.");
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage]);

  useEffect(() => {
    fetchList(currentPage, activeTab, debouncedSearch);
  }, [currentPage, activeTab, debouncedSearch, fetchList]);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
    setPanelDetails(null);
    setSelectedId(null);
    setSearchTerm("");
  };

  /* open side panel */
  const openPanel = async (employer) => {
    const employerPublicId = employer.employerId;
    if (selectedId === employerPublicId) {
      setPanelDetails(null);
      setSelectedId(null);
      setSelectedEmployerId(null);
      return;
    }
    setSelectedId(employerPublicId);
    setSelectedEmployerId(employer._id);
    setPanelDetails(null);
    setPanelLoading(true);
    try {
      const result = await getEmployerVerificationDetails(employerPublicId);
      if (result?.data?.response) setPanelDetails(result.data.response);
    } catch {
      toast.error("Failed to load details.");
      setSelectedId(null);
    } finally {
      setPanelLoading(false);
    }
  };

  /* action (from panel footer) */
  const handlePanelAction = (decision) => {
    setPendingDecision(decision);
    setConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedEmployerId || !pendingDecision) return;
    setActionLoading(true);
    try {
      const result = await employerVerificationChangeStatus(
        selectedEmployerId,
        pendingDecision,
        pendingDecision === "Rejected" ? rejectReason : undefined
      );
      if (result?.data?.response) {
        toast.success(result.data.message ?? "Status updated.");
        setConfirmOpen(false);
        setPendingDecision(null);
        setRejectReason("");
        window.location.reload();
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
      setPendingDecision(null);
      setRejectReason("");
    }
  };

  /* table columns */
  const columns = [
    {
      id: "owner",
      header: "Employer",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.ownerName} />
          <p className="text-sm font-medium text-slate-800 leading-tight">{row.ownerName}</p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <span className="text-sm text-slate-700 break-all">{row.email || "—"}</span>
      ),
    },
    {
      id: "company",
      header: "Company",
      accessor: "name",
      sortable: true,
      cell: (row) => <span className="text-sm text-slate-700 font-medium">{row.name}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: () => <Badge status={activeTab} />,
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <button
          onClick={() => openPanel(row)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            selectedId === row._id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Review
        </button>
      ),
    },
  ];

  const tabCounts = {}; // placeholder — wire real counts if API provides them

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* page header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employer Verification</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review and manage employer verification requests</p>
      </div>

      {/* tab strip + search */}
      <div className="px-6 mb-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {STATUS_META[tab].label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[220px] max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by owner or company…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* content: table */}
      <div className="px-6 pb-6 flex gap-5 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
          {loading ? (
            <Spinner />
          ) : tableData.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500">No {STATUS_META[activeTab].label.toLowerCase()} applications</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={tableData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              selectable={false}
              compact
              showActions={false}
              showSno={true}
              rowsPerPage={rowsPerPage}
            />
          )}
        </div>
      </div>

      {/* slide-over sheet for review details */}
      <Sheet
        open={!!panelDetails}
        onOpenChange={(open) => {
          if (!open) {
            setPanelDetails(null);
            setSelectedId(null);
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-2xl w-full p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900">
              Employer verification
            </SheetTitle>
          </SheetHeader>
          {panelLoading || !panelDetails ? (
            <Spinner />
          ) : (
            <DetailPanel
              details={panelDetails}
              onClose={() => { setPanelDetails(null); setSelectedId(null); }}
              onAction={handlePanelAction}
              activeTab={activeTab}
              actionLoading={actionLoading}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPendingDecision(null); setRejectReason(""); }}
        onConfirm={confirmAction}
        decision={pendingDecision}
        loading={actionLoading}
        reason={rejectReason}
        setReason={setRejectReason}
      />
    </div>
  );
};

export default EmployerVerification;