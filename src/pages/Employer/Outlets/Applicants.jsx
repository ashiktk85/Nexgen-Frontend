import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import Switch from "@mui/material/Switch";
import { useParams } from "react-router-dom";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import ApplicantModal from "@/components/Employer/ApplicantModal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "@/components/ui/StatCard";
import { Users, TrendingUp, CheckCircle2, XCircle, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialDummyUsers = [
  {
    id: "1",
    title: "Software Engineer",
    email: "hr@techcorp.com",
    phone: "1234567890",
    countryCode: "+91",
    location: "Bangalore, India",
    experienceRequired: [1, 3],
    description:
      "We are looking for a passionate software engineer to join our dynamic team. You will work on cutting-edge projects and contribute to our innovative software solutions.",
    requirements:
      "Proficiency in JavaScript, React, and Node.js. Familiarity with Agile methodologies and version control tools like Git.",
    active: true,
  },
  {
    id: "2",
    title: "Data Analyst",
    email: "recruitment@datasense.com",
    phone: "9876543210",
    countryCode: "+1",
    location: "New York, USA",
    experienceRequired: [2, 5],
    description:
      "Join our data analytics team to help transform data into actionable insights. Ideal candidates will have a strong background in data visualization and analysis.",
    requirements:
      "Experience with SQL, Python, and Tableau. Strong analytical and problem-solving skills.",
    active: false,
  },
  {
    id: "3",
    title: "Digital Marketing Specialist",
    email: "careers@marketmedia.com",
    phone: "5551234567",
    countryCode: "+44",
    location: "London, UK",
    experienceRequired: [3, 6],
    description:
      "We are hiring a digital marketing specialist to create, implement, and optimize our online marketing campaigns across various channels.",
    requirements:
      "Expertise in SEO, SEM, and social media marketing. Hands-on experience with Google Analytics and PPC campaigns.",
    active: true,
  },
  {
    id: "4",
    title: "Product Manager",
    email: "jobs@innovatepm.com",
    phone: "8765432109",
    countryCode: "+49",
    location: "Berlin, Germany",
    experienceRequired: [5, 10],
    description:
      "Lead our product development efforts and collaborate with cross-functional teams to deliver world-class products.",
    requirements:
      "Proven experience in product management. Strong understanding of market research and Agile development.",
    active: true,
  },
  {
    id: "5",
    title: "Graphic Designer",
    email: "designteam@creativespace.com",
    phone: "6677889900",
    countryCode: "+61",
    location: "Sydney, Australia",
    experienceRequired: [1, 4],
    description:
      "Join our creative team to design visually appealing content for various platforms, ensuring brand consistency and aesthetic appeal.",
    requirements:
      "Proficiency in Adobe Photoshop, Illustrator, and InDesign. A strong portfolio showcasing creative work.",
    active: false,
  },
  {
    id: "6",
    title: "Digital Marketing Specialist",
    email: "careers@marketmedia.com",
    phone: "5551234567",
    countryCode: "+44",
    location: "London, UK",
    experienceRequired: [3, 6],
    description:
      "We are hiring a digital marketing specialist to create, implement, and optimize our online marketing campaigns across various channels.",
    requirements:
      "Expertise in SEO, SEM, and social media marketing. Hands-on experience with Google Analytics and PPC campaigns.",
    active: true,
  },
];

const dummyColumns = [
  { id: "name", header: "Name", accessor: "name" },
  { id: "email", header: "Email", accessor: "email" },
  { id: "location", header: "Location", accessor: "location" },
  {
    id: "status",
    header: "Status",
    cell: (row) => {
      const isShortlisted = row.status === "Shortlisted";
      const isPending = row.status === "Pending";
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999,
          fontSize: 11, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: "nowrap",
          background: isShortlisted ? "#f0fdf4" : isPending ? "#fef3c7" : "#fef2f2",
          color: isShortlisted ? "#16a34a" : isPending ? "#d97706" : "#dc2626",
          border: isShortlisted ? "1px solid #bbf7d0" : isPending ? "1px solid #fde68a" : "1px solid #fecaca"
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isShortlisted ? "#22c55e" : isPending ? "#f59e0b" : "#ef4444" }} />
          {row.status}
        </span>
      );
    },
  },
];

/* ─── Animation variants ─── */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .08 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .35, ease: "easeOut" } } };

/* ─── Stat card definitions ─── */
const getStats = (stats) => [
  {
    label: "Total Applicants",
    value: stats.total ?? 0,
    icon: <Users size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)",
    shadow: "0 8px 24px rgba(99,102,241,.35)",
  },
  {
    label: "Shortlisted",
    value: stats.shortlisted ?? 0,
    icon: <CheckCircle2 size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)",
    shadow: "0 8px 24px rgba(16,185,129,.32)",
  },
  {
    label: "Pending",
    value: stats.pending ?? 0,
    icon: <TrendingUp size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#f59e0b 0%,#fbbf24 55%,#fcd34d 100%)",
    shadow: "0 8px 24px rgba(245,158,11,.32)",
  },
  {
    label: "Rejected",
    value: stats.rejected ?? 0,
    icon: <XCircle size={20} color="#fff" />,
    gradient: "linear-gradient(135deg,#dc2626 0%,#ef4444 55%,#f87171 100%)",
    shadow: "0 8px 24px rgba(220,38,38,.32)",
  },
];

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const employer = useSelector((state) => state.employer.employer);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, pending: 0, rejected: 0 });
  const [jobDetails, setJobDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const ROWS_PER_PAGE = 5;

  const fetchApplications = async ({
    page = currentPage,
    search = appliedSearch,
    status = statusFilter,
  } = {}) => {
    setLoading(true);
    try {
      const { data } = await employerAxiosInstance.get(
        `/job-applications/${jobId}`,
        {
          params: {
            page,
            limit: ROWS_PER_PAGE,
            search: search?.trim() || undefined,
            status: status !== "all" ? status : undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        }
      );
      setApplications(data.jobApplications || []);
      setTotalPages(data.totalPages || 1);
      if (data.stats) setStats(data.stats);

      if (employer?.employerId && !jobDetails) {
        const jobsRes = await employerAxiosInstance.get(`/job-list/${employer.employerId}`);
        const currentJob = jobsRes.data.jobPosts?.find((j) => j._id === jobId);
        if (currentJob) setJobDetails(currentJob);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [jobId]);

  useEffect(() => {
    fetchApplications({ page: currentPage });
  }, [jobId, currentPage, statusFilter, appliedSearch]);

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleView = (row) => {
    setSelectedData(row);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedData(null);
  };

  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="ejl-root" style={{ background: "#f1f5f9", minHeight: "100vh", padding: "16px 12px 40px" }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">

        {/* ── Page heading ── */}
        <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13.5, fontWeight: 700, color: "#64748b", background: "transparent", border: "none", cursor: "pointer", marginBottom: 8, padding: 0 }}>
              <ArrowLeft size={14} /> Back to Jobs
            </button>
            <h1 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Job Applicants {jobDetails?.jobTitle ? `for ${jobDetails.jobTitle}` : ""}
            </h1>
          </div>
        </motion.div>

        {/* ── Gradient stat cards ── */}
        <motion.div
          variants={itemVariants}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,140px),1fr))", gap: 12, marginBottom: 24 }}
        >
          {getStats(stats).map(({ label, value, icon, gradient, shadow }) => (
            <StatCard
              key={label}
              icon={icon}
              value={loading ? "-" : value}
              label={label}
              gradient={gradient}
              shadow={shadow}
            />
          ))}
        </motion.div>

        {/* ── Search & Status filter ── */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "stretch",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "6px 10px",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              gap: 8,
            }}
          >
            <Search size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
              placeholder="Search applicants by name, email or location…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 13.5,
                color: "#0f172a",
                fontFamily: "'DM Sans',sans-serif",
                minWidth: 0,
              }}
            />
            <button
              type="button"
              onClick={runSearch}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                flexShrink: 0,
              }}
            >
              Search
            </button>
          </div>

          {/* Status filter */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                color: "#0f172a",
                padding: "4px 6px",
                cursor: "pointer",
              }}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* ── Data Table ── */}
        <motion.div variants={itemVariants} style={{ background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "0" }}>
            <DataTable
              columns={dummyColumns}
              data={applications}
              loading={loading}
              onView={handleView}
              selectable={false}
              showActions={true}
              viewLabel="View Details"
              showSno={true}
              responsiveCards
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={ROWS_PER_PAGE}
            />
          </div>
        </motion.div>

        {/* Detail Sheet */}
        <Sheet open={!!selectedData} onOpenChange={(open) => { if (!open) handleCloseDialog(); }}>
          <SheetContent hideClose className="sm:max-w-none" style={{ width: "95vw", maxWidth: "900px", padding: 0, overflowY: "auto", background: "#f1f5f9" }} side="right">
            {selectedData && (
              <ApplicantModal
                isDialogOpen={!!selectedData}
                setIsDialogOpen={(val) => { if (!val) handleCloseDialog() }}
                application={selectedData}
                setSelectedData={setSelectedData}
                fetchApplications={fetchApplications}
              />
            )}
          </SheetContent>
        </Sheet>
      </motion.div>
    </div>
  );
}

export default Applicants;