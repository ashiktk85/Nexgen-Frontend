import { useEffect, useState } from "react";
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
} from "lucide-react";

import {
  getAllUsersSerive,
  userChangeStatusService,
  // PRIORITY VISIBILITY FEATURE — admin APIs for user role & bulk student creation
  changeUserRoleService,
  bulkCreateStudentsService,
} from "@/apiServices/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // PRIORITY VISIBILITY FEATURE — CSV upload + role update loading
  const [csvUploading, setCsvUploading] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchUsers(page, search) {
    try {
      const result = await getAllUsersSerive(page, rowsPerPage, search);
      if (result?.data?.response) {
        const { users, totalPages } = result.data.response;
        setUsers(users);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in user listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const handleBlockUnblock = async (userId) => {
    try {
      const result = await userChangeStatusService(userId);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setUsers((prev) =>
          prev.map((item) =>
            item._id === userId ? { ...item, isBlocked: response.isBlocked } : item
          )
        );
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

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBlocked).length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const noPhoneUsers = users.filter((u) => !u.phone).length;

  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    { id: "email", header: "Email", accessor: "email", sortable: true },
    { id: "phone", header: "Mobile", accessor: "phone" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Overview
            </p>
            <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-900 tracking-tight">
              Users
            </h1>
          </div>
        </div>

        <div className="grid gap-4 grid-template-columns-[repeat(auto-fill,minmax(190px,1fr))] md:grid-cols-4">
          <StatCard
            icon={<UsersIcon size={20} color="#fff" />}
            value={totalUsers}
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[220px] max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              placeholder="Search by name or email…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* PRIORITY VISIBILITY FEATURE — upload CSV to bulk-create institute students */}
          <div className="flex items-center gap-2">
            <input
              id="student-csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleStudentCsvUpload}
            />
            <button
              type="button"
              disabled={csvUploading}
              onClick={() =>
                document.getElementById("student-csv-upload")?.click()
              }
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {csvUploading ? "Uploading..." : "Upload students CSV"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-5">
          <DataTable
            title="Users"
            columns={columns}
            data={users}
            loading={!users.length && totalPages === 1}
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
              setPendingId(row._id);
              setConfirmOpen(true);
            }}
            viewLabel="View"
            blockLabel={(row) => (row.isBlocked ? "Unblock" : "Block")}
            showSno={true}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={users.find((u) => u._id === pendingId)?.isBlocked ? "Unblock user?" : "Block user?"}
        description={
          users.find((u) => u._id === pendingId)?.isBlocked
            ? "This user will be able to access the platform again."
            : "This user will be blocked from accessing the platform."
        }
        confirmLabel={users.find((u) => u._id === pendingId)?.isBlocked ? "Unblock" : "Block"}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={async () => {
          if (!pendingId) return;
          setConfirmLoading(true);
          try {
            await handleBlockUnblock(pendingId);
            setConfirmOpen(false);
            setPendingId(null);
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

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
                      {(selectedUser.firstName || selectedUser.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Phone</p>
                      <p className="text-xs text-slate-800">{selectedUser.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">Location</p>
                      <p className="text-xs text-slate-800">
                        {selectedUser.location || selectedUser.city || "—"}
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
                          selectedUser.isBlocked
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {selectedUser.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBlockUnblock(selectedUser._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        selectedUser.isBlocked
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {selectedUser.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>

                  {/* PRIORITY VISIBILITY FEATURE — user type (public / student) */}
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
                              selectedUser._id,
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
                                u._id === updated._id
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
                </div>
              </div>

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
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Users;
