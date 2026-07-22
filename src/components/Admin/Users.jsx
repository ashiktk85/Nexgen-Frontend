import { useEffect, useState, useRef } from "react";
import { DataTable } from "@/components/ui/DataTable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import StatCard from "@/components/ui/StatCard";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import {
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  UserMinus2,
  Upload,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getAllUsersUnified,
  exportAllUsersXlsx,
  userChangeStatusService,
  employerListUnList,
  changeUserRoleService,
  bulkCreateStudentsService,
} from "@/apiServices/adminApi";
import UserTypePill from "@/components/Admin/UserTypePill";
import { AdminFilterBar, AdminFilterSelect } from "@/components/Admin/AdminListFilters";
import moment from "moment";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_STAT_GRID,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";
import { displayValue } from "@/utils/tableValue";

const STUDENT_CSV_SAMPLE = `Name,Email,Password,FieldOfStudy
Rahul Kumar,rahul.kumar@example.com,Student@123,Android Repair
Anitha Nair,anitha.nair@example.com,,iPhone Repair
Vivek Menon,vivek.menon@example.com,Welcome2024,Chip-Level Technician`;

const CSV_UPLOAD_COLUMNS = [
  { name: "Name", required: true, description: "Student full name" },
  { name: "Email", required: true, description: "Unique login email (one account per email)" },
  {
    name: "Password",
    required: false,
    description: "Login password. If empty, default is changeme123",
  },
  {
    name: "FieldOfStudy",
    required: false,
    description:
      "Job specialty for email alerts (e.g. Android Repair, iPhone Repair, Chip-Level Technician)",
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    registeredFrom: "",
    registeredTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [pendingRow, setPendingRow] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // PRIORITY VISIBILITY FEATURE — CSV upload + role update loading
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvUploadModalOpen, setCsvUploadModalOpen] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters]);

  const updateFilter = (key, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  async function fetchUsers(page, search, activeFilters) {
    setLoading(true);
    try {
      const result = await getAllUsersUnified(page, rowsPerPage, {
        search,
        ...activeFilters,
      });
      if (result?.data?.response) {
        const { users: list, totalPages: pages, totalCount: count } = result.data.response;
        setUsers(list || []);
        setTotalPages(pages ?? 1);
        setTotalCount(count ?? 0);
      }
    } catch (error) {
      console.log("Error in user listing component: ", error.message);
      toast.error("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportAllUsersXlsx({ search: searchTerm, ...filters });
      if (!result?.data) return;
      const url = URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `techpath-users-${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Users exported successfully");
    } catch (_) {
      /* toast in API */
    } finally {
      setExporting(false);
    }
  };

  const handleBlockUnblock = async (row) => {
    try {
      let result;
      if (row.source === "employer") {
        result = await employerListUnList(row.sourceId);
      } else if (row.source === "user") {
        result = await userChangeStatusService(row.sourceId);
      } else {
        toast.error("Admin accounts must be managed from the Admins page");
        return;
      }
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message || "Status updated");
        const blocked = response.isBlocked;
        setUsers((prev) =>
          prev.map((item) =>
            item.sourceId === row.sourceId && item.source === row.source
              ? { ...item, isBlocked: blocked, status: blocked ? "blocked" : "active" }
              : item
          )
        );
        if (selectedUser?.sourceId === row.sourceId) {
          setSelectedUser((prev) =>
            prev ? { ...prev, isBlocked: blocked, status: blocked ? "blocked" : "active" } : prev
          );
        }
      }
    } catch (error) {
      console.log("Error in handleBlockUnblock at user listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  };

  // PRIORITY VISIBILITY FEATURE — parse CSV and bulk-create institute students
  const handleStudentCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setCsvUploading(true);

      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        toast.error("CSV must have a header and at least one row");
        return;
      }

      const header = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase());

      const nameIdx = header.indexOf("name");
      const emailIdx = header.indexOf("email");
      const passwordIdx = header.indexOf("password");
      const fieldIdx = header.indexOf("fieldofstudy");

      if (nameIdx === -1 || emailIdx === -1) {
        toast.error("CSV must contain Name and Email columns");
        return;
      }

      const students = lines
        .slice(1)
        .map((line) => {
          const cells = line.split(",").map((c) => c.trim());
          return {
            name: cells[nameIdx],
            email: cells[emailIdx],
            password: passwordIdx !== -1 ? cells[passwordIdx] : "",
            fieldOfStudy: fieldIdx !== -1 ? cells[fieldIdx] : "",
          };
        })
        .filter((s) => s.name && s.email);

      if (!students.length) {
        toast.error("No valid student rows found");
        return;
      }

      const res = await bulkCreateStudentsService(students);
      if (!res?.data) return;

      const { count } = res.data;
      toast.success(
        `Created ${count} student${count === 1 ? "" : "s"} from CSV`
      );
      setCsvUploadModalOpen(false);

      // Refresh list
      fetchUsers(currentPage, searchTerm);
    } catch (error) {
      console.log(
        "Error in handleStudentCsvUpload at user listing component: ",
        error.message
      );
      toast.error("Failed to upload students CSV");
    } finally {
      setCsvUploading(false);
      event.target.value = "";
    }
  };

  const downloadSampleCsv = () => {
    const blob = new Blob([STUDENT_CSV_SAMPLE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerCsvFilePicker = () => {
    fileInputRef.current?.click();
  };

  const activeUsers = users.filter((u) => u.status === "active").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const noPhoneUsers = users.filter((u) => !u.phone).length;

  const roleLabel = (role) => {
    const map = {
      student: "Student",
      public: "User",
      employer: "Employer",
      shop_owner: "Shop Owner",
      admin: "Admin",
    };
    return map[role] || role;
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    { id: "phone", header: "Mobile", accessor: (row) => displayValue(row.phone) },
    { id: "email", header: "Email", accessor: "email", sortable: true },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
          {roleLabel(row.role)}
        </span>
      ),
    },
    {
      id: "registeredAt",
      header: "Registration Date",
      accessor: (row) =>
        row.registeredAt ? moment(row.registeredAt).format("DD MMM YYYY") : "—",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.status === "blocked"
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {row.status === "blocked" ? "Blocked" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Overview</p>
          <h1 className={ADMIN_HEADER_TITLE}>User Management</h1>
        </div>
      </div>

      <div className={ADMIN_STAT_GRID}>
          <StatCard
            icon={<UsersIcon size={20} color="#fff" />}
            value={totalCount || users.length}
            label="Total Users"
            gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
            shadow="0 8px 24px rgba(99,102,241,.35)"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#fff" />}
            value={activeUsers}
            label="Active"
            gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
            shadow="0 8px 24px rgba(16,185,129,.32)"
          />
          <StatCard
            icon={<XCircle size={20} color="#fff" />}
            value={blockedUsers}
            label="Blocked"
            gradient="linear-gradient(135deg,#b91c1c 0%,#ef4444 55%,#f97373 100%)"
            shadow="0 8px 24px rgba(239,68,68,.32)"
          />
          <StatCard
            icon={<UserMinus2 size={20} color="#fff" />}
            value={noPhoneUsers}
            label="No Phone"
            gradient="linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#38bdf8 100%)"
            shadow="0 8px 24px rgba(14,165,233,.3)"
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
            placeholder="Search by name, email, or phone…"
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleStudentCsvUpload}
            />
            <button
              type="button"
              disabled={csvUploading}
              onClick={() => setCsvUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Upload className="w-3.5 h-3.5" />
              {csvUploading ? "Uploading..." : "Upload students CSV"}
            </button>
          </div>
        </div>

      <AdminFilterBar>
        <AdminFilterSelect
          label="Role"
          value={filters.role}
          onChange={(e) => updateFilter("role", e.target.value)}
          options={[
            { value: "all", label: "All roles" },
            { value: "public", label: "Users" },
            { value: "student", label: "Students" },
            { value: "employer", label: "Employers" },
            { value: "shop_owner", label: "Shop Owners" },
            { value: "admin", label: "Admins" },
          ]}
        />
        <AdminFilterSelect
          label="Status"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Registered from</label>
          <input
            type="date"
            value={filters.registeredFrom}
            onChange={(e) => updateFilter("registeredFrom", e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white h-[34px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Registered to</label>
          <input
            type="date"
            value={filters.registeredTo}
            onChange={(e) => updateFilter("registeredTo", e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white h-[34px]"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const todayStr = new Date().toLocaleDateString('en-CA');
            setCurrentPage(1);
            setFilters((prev) => ({ ...prev, registeredFrom: todayStr, registeredTo: todayStr }));
          }}
          className="text-xs font-semibold px-2.5 py-2 border border-slate-200 rounded-md hover:bg-slate-50 bg-white h-[34px]"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentPage(1);
            setFilters((prev) => ({ ...prev, registeredFrom: "", registeredTo: "" }));
          }}
          className="text-xs font-semibold px-2.5 py-2 border border-slate-200 rounded-md hover:bg-slate-50 bg-white h-[34px]"
        >
          Reset
        </button>
        <AdminFilterSelect
          label="Sort by"
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          options={[
            { value: "createdAt", label: "Registration date" },
            { value: "name", label: "Name" },
            { value: "role", label: "Role" },
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
            title="Users"
            columns={columns}
            data={users}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            selectable={false}
            compact
            showActions
            onView={(row) => {
              setSelectedUser(row);
              setOpenSheet(true);
            }}
            onBlock={(row) => {
              if (row.source === "admin") {
                toast.error("Manage admin accounts from the Admins page");
                return;
              }
              setPendingId(row.id);
              setPendingRow(row);
              setConfirmOpen(true);
            }}
            viewLabel="View"
            blockLabel={(row) => (row.status === "blocked" ? "Unblock" : "Block")}
            showSno={true}
            rowsPerPage={rowsPerPage}
          />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pendingRow?.status === "blocked" ? "Unblock user?" : "Block user?"}
        description={
          pendingRow?.status === "blocked"
            ? "This user will be able to access the platform again."
            : "This user will be blocked from accessing the platform."
        }
        confirmLabel={pendingRow?.status === "blocked" ? "Unblock" : "Block"}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={async () => {
          if (!pendingRow) return;
          setConfirmLoading(true);
          try {
            await handleBlockUnblock(pendingRow);
            setConfirmOpen(false);
            setPendingId(null);
            setPendingRow(null);
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

      <Dialog open={csvUploadModalOpen} onOpenChange={setCsvUploadModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Upload institute students (CSV)</DialogTitle>
            <DialogDescription>
              Bulk-create student accounts from a CSV file. Save your Excel sheet as{" "}
              <strong>CSV (Comma delimited)</strong> before uploading.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-600">Column</th>
                    <th className="px-3 py-2 font-semibold text-slate-600">Required</th>
                    <th className="px-3 py-2 font-semibold text-slate-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CSV_UPLOAD_COLUMNS.map((col) => (
                    <tr key={col.name}>
                      <td className="px-3 py-2 font-mono font-medium text-slate-800">{col.name}</td>
                      <td className="px-3 py-2">
                        {col.required ? (
                          <span className="text-red-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-3 text-xs text-indigo-900 leading-relaxed">
              <p className="font-semibold mb-1">Field of study &amp; job email alerts</p>
              <p>
                When an employer posts a new job, institute students receive an early-access email.
                If <strong>FieldOfStudy</strong> is set, the student is notified when the job title
                or requirements match that field (e.g. &quot;Android Repair&quot;, &quot;iPhone Repair&quot;).
                Leave it blank to receive alerts for all new jobs.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-3 text-xs text-emerald-900 leading-relaxed">
              <p className="font-semibold mb-1">What happens after upload</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Each row creates a <strong>student</strong> account with institute access</li>
                <li>Students see new jobs immediately (before public users)</li>
                <li>Duplicate emails are skipped; other valid rows are still created</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Example format</p>
              <pre className="text-[11px] bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre">
                {STUDENT_CSV_SAMPLE}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              Download sample CSV
            </button>
            <button
              type="button"
              disabled={csvUploading}
              onClick={triggerCsvFilePicker}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Upload className="w-3.5 h-3.5" />
              {csvUploading ? "Uploading..." : "Choose CSV file"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="sm:max-w-lg bg-slate-50 p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900">User details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="px-4 py-3 space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-70px)]">
              {/* Personal info */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Personal Information
                  </h3>
                </div>
                <div className="px-3 py-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center border border-blue-200">
                      {(selectedUser.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Phone</p>
                      <p className="text-xs text-slate-800">{displayValue(selectedUser.phone)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Role</p>
                      <p className="text-xs text-slate-800 capitalize">{roleLabel(selectedUser.role)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Registered</p>
                      <p className="text-xs text-slate-800">
                        {selectedUser.registeredAt
                          ? moment(selectedUser.registeredAt).format("DD MMM YYYY")
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">
                        Account status
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          selectedUser.status === "blocked"
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {selectedUser.status === "blocked" ? "Blocked" : "Active"}
                      </p>
                    </div>
                    {selectedUser.source !== "admin" && (
                    <button
                      onClick={() => handleBlockUnblock(selectedUser)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        selectedUser.status === "blocked"
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {selectedUser.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                    )}
                  </div>

                  {/* PRIORITY VISIBILITY FEATURE — user type (public / student) — job seekers only */}
                  {selectedUser.source === "user" && (
                  <div className="mt-3">
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      User type
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white"
                        value={selectedUser.role || "public"}
                        disabled={roleUpdating}
                        onChange={async (e) => {
                          const nextRole = e.target.value;
                          try {
                            setRoleUpdating(true);
                            const res = await changeUserRoleService(
                              selectedUser.sourceId,
                              {
                                role: nextRole,
                                isInstituteStudent:
                                  nextRole === "student" ? true : false,
                              }
                            );
                            const updated = res?.data?.response;
                            if (!updated) return;

                            setSelectedUser((prev) => ({
                              ...prev,
                              role: updated.role,
                              isInstituteStudent: updated.isInstituteStudent,
                            }));
                            setUsers((prev) =>
                              prev.map((u) =>
                                u.sourceId === selectedUser.sourceId && u.source === "user"
                                  ? {
                                      ...u,
                                      role: updated.role,
                                      isInstituteStudent:
                                        updated.isInstituteStudent,
                                    }
                                  : u
                              )
                            );
                            toast.success("User type updated");
                          } catch (error) {
                            console.log(
                              "Error updating user role in Users component: ",
                              error.message
                            );
                            toast.error("Failed to update user type");
                          } finally {
                            setRoleUpdating(false);
                          }
                        }}
                      >
                        <option value="public">Public</option>
                        <option value="student">Student</option>
                      </select>
                      {selectedUser.isInstituteStudent && (
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Institute student
                        </span>
                      )}
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {selectedUser.source === "user" && (
              <>
              {/* Education */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Education
                  </h3>
                </div>
                <div className="px-3 py-2">
                  {selectedUser.education?.length ? (
                    <div className="space-y-3">
                      {selectedUser.education.map((edu, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-semibold text-slate-800">
                              {edu.qualification || edu.degree}
                            </h4>
                            <p className="text-[11px] text-slate-500">{edu.institute}</p>
                            <p className="text-[10px] text-slate-400">
                              {edu.startYear} - {edu.endYear || "Present"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Education not added</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Experience
                  </h3>
                </div>
                <div className="px-3 py-2">
                  {selectedUser.experience?.length ? (
                    <div className="space-y-3">
                      {selectedUser.experience.map((exp, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-semibold text-slate-800">
                              {exp.jobTitle || exp.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">{exp.company}</p>
                            <p className="text-[10px] text-slate-400">
                              {exp.startYear} - {exp.endYear || "Present"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Experience not added</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              {(Array.isArray(selectedUser.resume)
                ? selectedUser.resume.length > 0
                : !!selectedUser.resume ||
                  selectedUser.additionalFile) && (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Documents
                    </h3>
                  </div>
                  <div className="px-3 py-2 space-y-2">
                    {Array.isArray(selectedUser.resume)
                      ? selectedUser.resume.map((res, idx) => (
                          <a
                            key={res.url || idx}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                              📄
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-slate-700">
                                {res.name || `Resume ${idx + 1}`}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {res.url}
                              </p>
                            </div>
                            <span className="ml-auto text-slate-300 group-hover:text-blue-400 text-xs">
                              ↗
                            </span>
                          </a>
                        ))
                      : selectedUser.resume && (
                          <a
                            href={selectedUser.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                              📄
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-slate-700">Resume</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {selectedUser.resume}
                              </p>
                            </div>
                            <span className="ml-auto text-slate-300 group-hover:text-blue-400 text-xs">
                              ↗
                            </span>
                          </a>
                        )}
                    {selectedUser.additionalFile && (
                      <a
                        href={selectedUser.additionalFile}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                          📎
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700">Additional File</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {selectedUser.additionalFile}
                          </p>
                        </div>
                        <span className="ml-auto text-slate-300 group-hover:text-blue-400 text-xs">
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* About / bio if present */}
              {selectedUser.about && (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      About
                    </h3>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {selectedUser.about}
                    </p>
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Users;
