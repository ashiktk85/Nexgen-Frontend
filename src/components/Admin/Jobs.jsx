import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Briefcase, CheckCircle2, ListChecks, XCircle, Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/Admin/ConfirmModal";
import { AdminFilterBar, AdminFilterSelect } from "@/components/Admin/AdminListFilters";
import { getAllJobs, jobListUnList, deleteJobAdmin, exportAllJobsXlsx } from "@/apiServices/adminApi";
import { toast } from "sonner";
import moment from "moment";
import { formatSalary } from "@/utils/formatSalary";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_STAT_GRID,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";

const defaultFilters = {
  listing: "all",
  status: "all",
  jobType: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchJobs(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters]);

  async function fetchJobs(page, search, activeFilters) {
    setLoading(true);
    try {
      const result = await getAllJobs(page, rowsPerPage, {
        search,
        ...activeFilters,
      });

      if (result?.data?.response) {
        const { jobs: list, totalPages: pages } = result.data.response;
        setJobs(list || []);
        setTotalPages(pages ?? 1);
      }
    } catch (error) {
      console.log("Error in jobs listing component: ", error.message);
      toast.error("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  }

  const refreshJobs = () => fetchJobs(currentPage, searchTerm, filters);

  const updateFilter = (key, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleHardDelete = async (jobId) => {
    try {
      const result = await deleteJobAdmin(jobId);
      if (result?.data) {
        toast.success(result.data.message || "Job deleted permanently");
        setJobs((prev) => prev.filter((item) => item._id !== jobId));
        if (selectedJob?._id === jobId) {
          setOpenSheet(false);
          setSelectedJob(null);
        }
        await fetchJobs(currentPage, searchTerm, filters);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportAllJobsXlsx({ search: searchTerm, ...filters });
      if (!result?.data) return;
      const url = URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `techpath-jobs-${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Jobs exported successfully");
    } catch (_) {
      /* toast in API */
    } finally {
      setExporting(false);
    }
  };

  const totalJobs = jobs.length;
  const listedJobs = jobs.filter((j) => !j.isBlocked).length;
  const unlistedJobs = jobs.filter((j) => j.isBlocked).length;
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const pendingJob = jobs.find((j) => j._id === pendingId);
  const pendingDeleteJob = jobs.find((j) => j._id === pendingDeleteId);
  const handleEdit = (row) => {
    setEditingJob(row);
    setOpenEditSheet(true);
  };

  const columns = [
    {
      id: "jobTitle",
      header: "Job Title",
      accessor: "jobTitle",
    },
    {
      id: "employerName",
      header: "Shop / Employer",
      accessor: "employerName",
    },
    {
      id: "createdAt",
      header: "Posted on",
      accessor: (row) =>
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "—",
    },
    {
      id: "listing",
      header: "Listing",
      cell: (row) => (
        <span
          className={`inline-flex items-center justify-center min-w-[64px] px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.isBlocked
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {row.isBlocked ? "Unlisted" : "Listed"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const s = (row.status || "open").toLowerCase();
        const isScheduled = s === "scheduled";
        const isOpen = s === "open";
        const label = isScheduled
          ? "Scheduled"
          : (row.status || "open").charAt(0).toUpperCase() + (row.status || "open").slice(1);
        return (
          <span
            className={`inline-flex items-center justify-center min-w-[52px] px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isScheduled
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : isOpen
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
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

      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by title, shop, city…"
            className={ADMIN_SEARCH_INPUT}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? "Exporting…" : "Export Excel"}
          </button>
        </div>
      </div>

      <AdminFilterBar>
        <AdminFilterSelect
          label="Listing"
          value={filters.listing}
          onChange={(e) => updateFilter("listing", e.target.value)}
          options={[
            { value: "all", label: "All listings" },
            { value: "listed", label: "Listed" },
            { value: "unlisted", label: "Unlisted" },
          ]}
        />
        <AdminFilterSelect
          label="Status"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
            { value: "paused", label: "Paused" },
          ]}
        />
        <AdminFilterSelect
          label="Type"
          value={filters.jobType}
          onChange={(e) => updateFilter("jobType", e.target.value)}
          options={[
            { value: "all", label: "All types" },
            { value: "admin", label: "Admin jobs" },
            { value: "employer", label: "Employer jobs" },
          ]}
        />
        <AdminFilterSelect
          label="Sort by"
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          options={[
            { value: "createdAt", label: "Date posted" },
            { value: "jobTitle", label: "Job title" },
            { value: "status", label: "Status" },
            { value: "listing", label: "Listing" },
            { value: "city", label: "City" },
          ]}
        />
        <AdminFilterSelect
          label="Order"
          value={filters.sortOrder}
          onChange={(e) => updateFilter("sortOrder", e.target.value)}
          options={[
            { value: "desc", label: "Descending" },
            { value: "asc", label: "Ascending" },
          ]}
        />
      </AdminFilterBar>

      <div className={ADMIN_TABLE_WRAP}>
          <DataTable
            title="Jobs"
            columns={columns}
            data={jobs}
            loading={loading}
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
            onEdit={(row) => handleEdit(row)}
            onBlock={(row) => {
              setPendingId(row._id);
              setConfirmOpen(true);
            }}
            onDelete={(row) => {
              setPendingDeleteId(row._id);
              setDeleteConfirmOpen(true);
            }}
            viewLabel="View"
            editLabel="Edit"
            blockLabel={(row) => (row.isBlocked ? "List" : "Unlist")}
            deleteLabel="Delete"
            showSno={true}
            rowsPerPage={rowsPerPage}
          />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pendingJob?.isBlocked ? "List job?" : "Unlist job?"}
        description={
          pendingJob?.isBlocked
            ? "This job will become visible to users again."
            : "This job will be hidden from users."
        }
        confirmLabel={pendingJob?.isBlocked ? "List" : "Unlist"}
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

      <ConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        variant="danger"
        title="Permanently delete job?"
        description={
          pendingDeleteJob
            ? `"${pendingDeleteJob.jobTitle}" will be removed from the database along with its applications. This cannot be undone.`
            : "This job will be permanently removed from the database. This cannot be undone."
        }
        confirmLabel="Delete permanently"
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          setConfirmLoading(true);
          try {
            await handleHardDelete(pendingDeleteId);
            setDeleteConfirmOpen(false);
            setPendingDeleteId(null);
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

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
                <div className="px-3 pb-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleListUnlist(selectedJob._id);
                      setOpenSheet(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    {selectedJob.isBlocked ? "List" : "Unlist"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeleteId(selectedJob._id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Delete permanently
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Shop Location
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-2">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Area</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {[selectedJob.city, selectedJob.state].filter(Boolean).join(", ") || "—"}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Country</p>
                  <p className="text-sm text-slate-900">{selectedJob.country || "—"}</p>
                </div>
              </div>

              {/* Core job details */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Job Details
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-2">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Salary</p>
                  <p className="text-sm font-semibold text-emerald-600">{formatSalary(selectedJob)}</p>

                  <p className="text-[11px] font-medium text-slate-500 uppercase">Experience</p>
                  <p className="text-sm text-slate-900">
                    {selectedJob.experienceRequired?.[0]}–{selectedJob.experienceRequired?.[selectedJob.experienceRequired?.length - 1]} years
                  </p>

                  {selectedJob.workingTime && (
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      Working Time
                      <span className="block text-sm font-semibold text-slate-900 normal-case">{selectedJob.workingTime}</span>
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Room</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedJob.roomAvailable || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Food</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedJob.foodAvailable || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Incentive</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedJob.incentive || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Probation</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedJob.probationPeriod || "—"}</p>
                    </div>
                  </div>

                  {selectedJob.workingDays && (
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      Working Days
                      <span className="block text-sm font-semibold text-slate-900 normal-case">{selectedJob.workingDays}</span>
                    </p>
                  )}

                  {selectedJob.holiday && (
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      Holiday
                      <span className="block text-sm font-semibold text-slate-900 normal-case">{selectedJob.holiday}</span>
                    </p>
                  )}

                  <p className="text-[11px] font-medium text-slate-500 uppercase">Description</p>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedJob.description || "—"}</p>

                  {selectedJob.requirements?.length > 0 && (
                    <>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Requirements</p>
                      <ul className="list-disc pl-5 text-sm text-slate-900">
                        {selectedJob.requirements.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Edit job sheet ── */}
      <Sheet
        open={openEditSheet}
        onOpenChange={(open) => {
          if (!open) {
            setOpenEditSheet(false);
            setEditingJob(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl bg-slate-50 p-0"
        >
          {editingJob && (
            <CreateJobForm
              mode="admin"
              page="update"
              selectedData={editingJob}
              onClose={() => {
                setOpenEditSheet(false);
                setEditingJob(null);
                refreshJobs();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Jobs;
