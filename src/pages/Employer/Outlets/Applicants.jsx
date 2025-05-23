import React, { useState, useEffect } from "react";
import ListingTable from "../../../components/common/table";
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
import ApplicantModal from "@/components/Employer/ApplicantModal";
import { motion, AnimatePresence } from "framer-motion";

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

const dummyColumns = (handleActiveToggle) => [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "location", label: "Location" },
  {
    key: "status",
    label: "Status",
    render: (status, row) => (
      <>
        <motion.span
          className={`py-1 rounded font-bold ${
            status === "Shortlisted"
              ? "text-green-500"
              : status === "Pending"
              ? "text-orange-400"
              : "text-red-500"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {status}
        </motion.span>
        {/* <Switch
          checked={status}
          onChange={() => handleActiveToggle(row.id)}
          inputProps={{ "aria-label": "Active Status" }}
        /> */}
      </>
    ),
  },
];

function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await employerAxiosInstance.get(
        `/job-applications/${jobId}`
      );
      console.log(data, "ress");
      setApplications(data.jobApplications);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load applicants");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleView = (id) => {
    const application = applications.find(
      (application) => application._id === id
    );
    setSelectedData(application);
    setIsDialogOpen(true);
  };

  const handleActiveToggle = (id) => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === id
          ? { ...application, active: !application.active }
          : application
      )
    );
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedData(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="my-6 px-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-2xl font-bold" variants={itemVariants}>
        Job Applicants
      </motion.h1>
      <motion.div variants={itemVariants}>
        {loading ? (
          <motion.div
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 text-lg">Loading...</p>
          </motion.div>
        ) : (
          <ListingTable
            users={applications}
            columns={dummyColumns(handleActiveToggle)}
            rowsPerPage={5}
            onView={handleView}
          />
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ApplicantModal
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              application={selectedData}
              setSelectedData={setSelectedData}
              fetchApplications={fetchApplications}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Applicants;