import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getJobTitlesAdmin,
  createJobTitleAdmin,
  updateJobTitleAdmin,
  deleteJobTitleAdmin,
} from "@/apiServices/adminApi";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";

const emptyForm = { title: "", requirementsText: "", isActive: true };

const JobTitles = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const rowsPerPage = 20;

  const fetchTitles = async (page, search) => {
    setLoading(true);
    try {
      const res = await getJobTitlesAdmin(page, rowsPerPage, search);
      const data = res?.data?.response;
      if (data) {
        setJobTitles(data.jobTitles || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      toast.error("Failed to load job titles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSheetOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      title: row.title || "",
      requirementsText: (row.requirements || []).join("\n"),
      isActive: row.isActive !== false,
    });
    setSheetOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      toast.error("Title is required");
      return;
    }

    const requirements = form.requirementsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (requirements.length === 0) {
      toast.error("Add at least one requirement");
      return;
    }

    const payload = {
      title,
      requirements,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateJobTitleAdmin(editingId, payload);
        toast.success("Job title updated");
      } else {
        await createJobTitleAdmin(payload);
        toast.success("Job title created");
      }
      await fetchTitles(currentPage, searchTerm);
      setSheetOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save job title");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteJobTitleAdmin(pendingDeleteId);
      setJobTitles((prev) => prev.filter((item) => item._id !== pendingDeleteId));
      toast.success("Job title deleted");
      setConfirmOpen(false);
      setPendingDeleteId(null);
      fetchTitles(currentPage, searchTerm);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job title");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      id: "title",
      header: "Title",
      accessor: "title",
      sortable: true,
    },
    {
      id: "requirements",
      header: "Requirements",
      cell: (row) => (
        <span className="text-slate-600">
          {(row.requirements || []).length} item{(row.requirements || []).length === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.isActive !== false
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {row.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setPendingDeleteId(row._id);
              setConfirmOpen(true);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Configuration</p>
          <h1 className={ADMIN_HEADER_TITLE}>Job Titles</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add job title
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search job titles…"
            className={ADMIN_SEARCH_INPUT}
          />
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP}>
        <DataTable
          title="Job Titles"
          columns={columns}
          data={jobTitles}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          selectable={false}
          compact
          showActions={false}
          showSno
          rowsPerPage={rowsPerPage}
        />
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-lg bg-slate-50 p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900">
              {editingId ? "Edit job title" : "Add job title"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={ADMIN_SEARCH_INPUT}
                placeholder="e.g. Mobile Service"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Requirements * <span className="font-normal text-slate-400">(one per line, at least one required)</span>
              </label>
              <textarea
                value={form.requirementsText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requirementsText: e.target.value }))
                }
                rows={10}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder={"Normal Works - Android Only\nChip-Level Work - Android & iPhone"}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="rounded border-slate-300"
              />
              Active (visible when employers create jobs)
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete job title?"
        description="Employers will no longer see this title when creating jobs. Existing job posts are not affected."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default JobTitles;
