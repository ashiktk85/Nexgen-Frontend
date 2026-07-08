import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Users, Briefcase, ChevronRight } from "lucide-react";
import { getJobApplicationsAdmin, getJobApplicantsByJobAdmin } from "@/apiServices/adminApi";
import { toast } from "sonner";
import moment from "moment";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_EYEBROW,
  ADMIN_HEADER_TITLE,
  ADMIN_TABLE_WRAP,
  ADMIN_SEARCH_INPUT,
} from "@/components/Admin/adminPageLayout";
import { displayValue } from "@/utils/tableValue";

const AppliedStudents = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchJobs(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchJobs(page, search) {
    setLoading(true);
    try {
      const result = await getJobApplicationsAdmin(page, rowsPerPage, search);
      if (result?.data?.response) {
        const { jobs: list, totalPages: pages } = result.data.response;
        setJobs(list || []);
        setTotalPages(pages ?? 1);
      }
    } catch (error) {
      toast.error("Failed to load applied students");
    } finally {
      setLoading(false);
    }
  }

  const openApplicants = async (job) => {
    setSelectedJob(job);
    setOpenSheet(true);
    setApplicantsLoading(true);
    try {
      const result = await getJobApplicantsByJobAdmin(job._id);
      if (result?.data?.response) {
        setApplicants(result.data.response.applications || []);
      }
    } catch {
      toast.error("Failed to load applicants");
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const columns = [
    {
      id: "jobTitle",
      header: "Job Title",
      accessor: "jobTitle",
    },
    {
      id: "company",
      header: "Company / Shop",
      cell: (row) => displayValue(row.companyName || row.employerName),
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => `${row.city || ""}, ${row.state || ""}`.replace(/^, |, $/g, "") || "—",
    },
    {
      id: "applicants",
      header: "Applicants",
      cell: (row) => (
        <button
          type="button"
          onClick={() => openApplicants(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
        >
          <Users size={12} />
          {row.applicantCount || 0} students
          <ChevronRight size={12} />
        </button>
      ),
    },
    {
      id: "posted",
      header: "Posted",
      accessor: (row) =>
        row.createdAt ? moment(row.createdAt).format("DD MMM YYYY") : "—",
    },
  ];

  const applicantColumns = [
    { id: "name", header: "Name", accessor: "name" },
    { id: "email", header: "Email", accessor: "email" },
    { id: "phone", header: "Mobile", accessor: (row) => displayValue(row.phone) },
    {
      id: "applied",
      header: "Applied On",
      accessor: (row) =>
        row.createdAt ? moment(row.createdAt).format("DD MMM YYYY, h:mm A") : "—",
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "resume",
      header: "Resume",
      cell: (row) =>
        row.resume ? (
          <a
            href={row.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold text-[11px] hover:underline"
          >
            View
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <p className={ADMIN_HEADER_EYEBROW}>Recruitment</p>
          <h1 className={ADMIN_HEADER_TITLE}>Applied Students</h1>
        </div>
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
            placeholder="Search by job title…"
            className={ADMIN_SEARCH_INPUT}
          />
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP}>
        <DataTable
          title="Jobs with applications"
          columns={columns}
          data={jobs}
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

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-50 p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" />
              {selectedJob?.jobTitle}
            </SheetTitle>
            <p className="text-xs text-slate-500 px-4 pb-2">
              {selectedJob?.companyName || selectedJob?.employerName} ·{" "}
              {selectedJob?.applicantCount || 0} applicant(s)
            </p>
          </SheetHeader>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
            {applicantsLoading ? (
              <p className="text-sm text-slate-500">Loading applicants…</p>
            ) : applicants.length === 0 ? (
              <p className="text-sm text-slate-500">No applications for this job yet.</p>
            ) : (
              <DataTable
                columns={applicantColumns}
                data={applicants}
                selectable={false}
                showActions={false}
                compact
                showSno
                clientSidePagination
                rowsPerPage={10}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppliedStudents;
