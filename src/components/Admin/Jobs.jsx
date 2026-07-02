import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Briefcase, CheckCircle2, ListChecks, XCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/Admin/ConfirmModal";
import { getAllJobs, jobListUnList } from "@/apiServices/adminApi";
import { toast } from "sonner";
import moment from "moment";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_STAT_GRID,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchJobs(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchJobs(page, search) {
    try {
      const result = await getAllJobs(page, rowsPerPage, search);

      if (result?.data?.response) {
        const { jobs, totalPages } = result.data.response;
        setJobs(jobs);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in jobs listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const handleListUnlist = async (jobId) => {
    try {
      const result = await jobListUnList(jobId);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setJobs((prev) =>
          prev.map((item) =>
            item._id === jobId ? { ...item, ...response } : item
          )
        );
        if (selectedJob?._id === jobId) {
          setSelectedJob((prev) => (prev?._id === jobId ? { ...prev, ...response } : prev));
        }
      }
    } catch (error) {
      console.log(
        "Error in handleListUnlist at job listing component: ",
        error.message
      );
      toast.error("An unexpected error occured");
    }
  };

  const totalJobs = jobs.length;
  const listedJobs = jobs.filter((j) => !j.isBlocked).length;
  const unlistedJobs = jobs.filter((j) => j.isBlocked).length;
  const openJobs = jobs.filter((j) => j.status === "open").length;

  const columns = [
    {
      id: "jobTitle",
      header: "Job Title",
      accessor: "jobTitle",
      sortable: true,
    },
    {
      id: "employerName",
      header: "Shop / Employer",
      accessor: "employerName",
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Posted on",
      accessor: (row) =>
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "—",
      sortable: true,
    },
    {
      id: "status",
      header: "Open/Close",
      accessor: "status",
      cell: (row) => {
        const s = (row.status || "open").toLowerCase();
        const isOpen = s === "open";
        const isPaused = s === "paused";
        const label = (row.status || "open").charAt(0).toUpperCase() + (row.status || "open").slice(1);
        return (
          <span
            className={`inline-flex items-center justify-center min-w-[52px] px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isOpen
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : isPaused
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Overview</p>
          <h1 className={ADMIN_HEADER_TITLE}>Jobs</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/jobs/create")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Post job
        </button>
      </div>

      <div className={ADMIN_STAT_GRID}>
          <StatCard
            icon={<Briefcase size={20} color="#fff" />}
            value={totalJobs}
            label="Total Jobs"
            gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
            shadow="0 8px 24px rgba(99,102,241,.35)"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#fff" />}
            value={openJobs}
            label="Open Jobs"
            gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
            shadow="0 8px 24px rgba(16,185,129,.32)"
          />
          <StatCard
            icon={<ListChecks size={20} color="#fff" />}
            value={listedJobs}
            label="Listed"
            gradient="linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#38bdf8 100%)"
            shadow="0 8px 24px rgba(14,165,233,.3)"
          />
          <StatCard
            icon={<XCircle size={20} color="#fff" />}
            value={unlistedJobs}
            label="Unlisted"
            gradient="linear-gradient(135deg,#b91c1c 0%,#ef4444 55%,#f97373 100%)"
            shadow="0 8px 24px rgba(239,68,68,.32)"
          />
        </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by title or employer…"
            className={ADMIN_SEARCH_INPUT}
          />
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP}>
          <DataTable
            title="Jobs"
            columns={columns}
            data={jobs}
            loading={!jobs.length && totalPages === 1}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            selectable={false}
            compact
            showActions
            onView={(row) => {
              setSelectedJob(row);
              setOpenSheet(true);
            }}
            onBlock={(row) => {
              setPendingId(row._id);
              setConfirmOpen(true);
            }}
            viewLabel="View"
            blockLabel={(row) => (row.isBlocked ? "List" : "Unlist")}
            showSno={true}
            rowsPerPage={rowsPerPage}
          />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={jobs.find((j) => j._id === pendingId)?.isBlocked ? "List job?" : "Unlist job?"}
        description={
          jobs.find((j) => j._id === pendingId)?.isBlocked
            ? "This job will become visible to users again."
            : "This job will be hidden from users."
        }
        confirmLabel={jobs.find((j) => j._id === pendingId)?.isBlocked ? "List" : "Unlist"}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={async () => {
          if (!pendingId) return;
          setConfirmLoading(true);
          try {
            await handleListUnlist(pendingId);
            setConfirmOpen(false);
            setPendingId(null);
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

      {/* View sheet - same design as Employers */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="sm:max-w-lg bg-slate-50 p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900">
              Job details
            </SheetTitle>
          </SheetHeader>
          {selectedJob && (
            <div className="px-4 py-3 space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-70px)]">
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Job
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Job title</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedJob.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Employer / Shop</p>
                    <p className="text-xs text-slate-800 break-all">
                      {selectedJob.isAdminJob ? (
                        <span>{selectedJob.companyName || selectedJob.employerName} <span className="text-indigo-600 font-semibold">(Admin job)</span></span>
                      ) : (
                        selectedJob.employerName || "—"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Status
                  </h3>
                </div>
                <div className="px-3 py-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Posted on</p>
                    <p className="text-xs text-slate-800">
                      {selectedJob.createdAt
                        ? new Date(selectedJob.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Open/Close</p>
                    <p className="text-xs text-slate-800">{selectedJob.status || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">Listing</p>
                    <p className={`text-xs font-semibold ${selectedJob.isBlocked ? "text-amber-600" : "text-emerald-600"}`}>
                      {selectedJob.isBlocked ? "Unlisted" : "Listed"}
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <button
                    onClick={() => {
                      handleListUnlist(selectedJob._id);
                      setOpenSheet(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    {selectedJob.isBlocked ? "List" : "Unlist"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Jobs;

