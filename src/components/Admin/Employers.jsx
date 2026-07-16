import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Building2, CheckCircle2, XCircle, Users, Download } from "lucide-react";

import ConfirmModal from "@/components/Admin/ConfirmModal";
import { getAllEmployers, employerListUnList, exportAllEmployersXlsx } from "@/apiServices/adminApi";
import { toast } from "sonner";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_STAT_GRID,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";

const Employers = () => {
  const [employers, setEmployers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchEmployers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchEmployers(page, search) {
    try {
      const result = await getAllEmployers(page, rowsPerPage, search);

      if (result?.data?.response) {
        const { employers, totalPages } = result.data.response;
        setEmployers(employers);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in employers listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const handleBlockUnblock = async (employerId) => {
    try {
      const result = await employerListUnList(employerId);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setEmployers((prev) =>
          prev.map((item) =>
            item._id === employerId
              ? { ...item, isBlocked: response.isBlocked }
              : item
          )
        );
      }
    } catch (error) {
      console.log(
        "Error in handleBlockUnblock at employer listing component: ",
        error.message
      );
      toast.error("An unexpected error occured");
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportAllEmployersXlsx(searchTerm);
      if (!result?.data) return;
      const url = URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `techpath-employers-${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Employers exported successfully");
    } catch (_) {
      /* toast in API */
    } finally {
      setExporting(false);
    }
  };

  const totalEmployers = employers.length;
  const activeEmployers = employers.filter((e) => !e.isBlocked).length;
  const blockedEmployers = employers.filter((e) => e.isBlocked).length;

  const columns = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "email", header: "Email", accessor: "email", sortable: true },
    { id: "phone", header: "Mobile", accessor: "phone" },
    { id: "location", header: "Location", accessor: "location" },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Overview</p>
          <h1 className={ADMIN_HEADER_TITLE}>Employers</h1>
        </div>
      </div>

      <div className={ADMIN_STAT_GRID}>
          <StatCard
            icon={<Users size={20} color="#fff" />}
            value={totalEmployers}
            label="Total Employers"
            gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
            shadow="0 8px 24px rgba(99,102,241,.35)"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#fff" />}
            value={activeEmployers}
            label="Active"
            gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
            shadow="0 8px 24px rgba(16,185,129,.32)"
          />
          <StatCard
            icon={<XCircle size={20} color="#fff" />}
            value={blockedEmployers}
            label="Blocked"
            gradient="linear-gradient(135deg,#b91c1c 0%,#ef4444 55%,#f97373 100%)"
            shadow="0 8px 24px rgba(239,68,68,.32)"
          />
          <StatCard
            icon={<Building2 size={20} color="#fff" />}
            value={rowsPerPage}
            label="Rows / Page"
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
            placeholder="Search by name, email or location…"
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

      <div className={ADMIN_TABLE_WRAP}>
          <DataTable
            title="Employers"
            columns={columns}
            data={employers}
            loading={!employers.length && totalPages === 1}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            selectable={false}
            compact
            showActions
            onView={(row) => {
              setSelectedEmployer(row);
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

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={employers.find((e) => e._id === pendingId)?.isBlocked ? "Unblock employer?" : "Block employer?"}
        description={
          employers.find((e) => e._id === pendingId)?.isBlocked
            ? "This employer will be able to use the platform again."
            : "This employer will be blocked from using the platform."
        }
        confirmLabel={employers.find((e) => e._id === pendingId)?.isBlocked ? "Unblock" : "Block"}
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
            <SheetTitle className="text-base font-bold text-slate-900">
              Employer & shop details
            </SheetTitle>
          </SheetHeader>
          {selectedEmployer && (
            <div className="px-4 py-3 space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-70px)]">
              {/* Employer profile (like ShopDetails employer card) */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Employer Profile
                  </h3>
                </div>
                <div className="px-3 py-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br from-violet-600 to-purple-400">
                      {(selectedEmployer.name || "E").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedEmployer.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {selectedEmployer.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">
                        Phone
                      </p>
                      <p className="text-xs text-slate-800">
                        {selectedEmployer.phone || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">
                        Location
                      </p>
                      <p className="text-xs text-slate-800">
                        {selectedEmployer.location || "—"}
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
                          selectedEmployer.isBlocked ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {selectedEmployer.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBlockUnblock(selectedEmployer._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        selectedEmployer.isBlocked
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {selectedEmployer.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Shop-style info (reusing ShopDetails structure where fields exist) */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Shop Information
                  </h3>
                </div>
                <div className="px-3 py-2 space-y-2">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      Shop / Company Name
                    </p>
                    <p className="text-xs text-slate-800">
                      {selectedEmployer.shopName || selectedEmployer.companyName || selectedEmployer.name}
                    </p>
                  </div>
                  {selectedEmployer.address && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 uppercase">
                        Address
                      </p>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap">
                        {selectedEmployer.address}
                      </p>
                    </div>
                  )}
                  {selectedEmployer.ownerName && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">
                          Owner Name
                        </p>
                        <p className="text-xs text-slate-800">
                          {selectedEmployer.ownerName}
                        </p>
                      </div>
                      {selectedEmployer.ownerAddress && (
                        <div>
                          <p className="text-[11px] font-medium text-slate-500 uppercase">
                            Owner Address
                          </p>
                          <p className="text-xs text-slate-800">
                            {selectedEmployer.ownerAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* KYC / verification docs quick view (if present) */}
              {(selectedEmployer.aadharFront ||
                selectedEmployer.aadharBack ||
                selectedEmployer.certificate) && (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Verification Documents
                    </h3>
                  </div>
                  <div className="px-3 py-2 space-y-2">
                    {selectedEmployer.aadharFront && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">
                          Aadhar Front
                        </p>
                        <p className="text-[10px] text-slate-500 break-all">
                          {selectedEmployer.aadharFront}
                        </p>
                      </div>
                    )}
                    {selectedEmployer.aadharBack && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">
                          Aadhar Back
                        </p>
                        <p className="text-[10px] text-slate-500 break-all">
                          {selectedEmployer.aadharBack}
                        </p>
                      </div>
                    )}
                    {selectedEmployer.certificate && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">
                          Shop Certificate
                        </p>
                        <p className="text-[10px] text-slate-500 break-all">
                          {selectedEmployer.certificate}
                        </p>
                      </div>
                    )}
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

export default Employers;
