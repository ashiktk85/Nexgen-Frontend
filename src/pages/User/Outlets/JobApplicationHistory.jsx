import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@mui/material";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import useRequestUser from "@/hooks/useRequestUser";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function JobApplicationHistory() {
  const { data, loading, error, sendRequest } = useRequestUser();
  const userData = useSelector((state) => state.user.seekerInfo);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown date";
    return format(new Date(isoDate), "do MMMM yyyy, h:mm a");
  };

  const handleTab = (value) => {
    console.log('value', value);
    let filtered = [];

    switch (value) {
      case "recent":
        filtered = allJobs;
        break;
      case "Shortlisted":
        filtered = allJobs.filter((job) => job.applicationStatus === "Shortlisted");
        break;
      case "in-progress":
        filtered = allJobs.filter((job) => job.applicationStatus === "Pending");
        break;
      case "rejected":
        filtered = allJobs.filter((job) => job.applicationStatus === "Rejected");
        break;
      default:
        filtered = allJobs;
    }
    setFilteredJobs(filtered);
  };

  const fetchData = async () => {
    if (userData) {
      sendRequest({
        url: `/job-applications/${userData.userId}`,
        method: "GET",
        onSuccess: (data) => {
          console.log("Job applications fetched successfully", data);
          console.log('data', data);
          setAllJobs(data.allApplicationsOfAUser);
          setFilteredJobs(data.allApplicationsOfAUser);
        },
        onError: (err) =>
          console.error("Error job applications:", err),
      });
    } else {
      toast.error('User data not found in state.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="md:w-3/6 w-full mx-auto p-4 mt-16"
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl font-semibold mb-4"
      >
        My Jobs
      </motion.h1>

      <Tabs defaultValue="recent" onValueChange={handleTab} className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Apply</TabsTrigger>
            <TabsTrigger value="Shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={filteredJobs.length} // Key to trigger animation on tab change
          className="space-y-4"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <img
                  src={job?.companyLogo || "/placeholder.svg"}
                  alt={`${job?.companyName} logo`}
                  width={48}
                  height={48}
                  className="rounded"
                />
                <div className="flex-1 min-w-0">
                  <motion.h3 variants={itemVariants} className="font-medium">
                    {job?.jobTitle}
                  </motion.h3>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground"
                  >
                    {job?.companyName}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground"
                  >
                    {`${job?.city}, ${job?.country}`}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground"
                  >
                    Applied on {formatDate(job?.appliedAt)}
                  </motion.p>
                  {job.jobStatus === 'open' ? (
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-2 mt-1"
                    >
                      <p className="text-sm text-muted-foreground">
                        Last modified {formatDate(job?.updatedAt)}
                      </p>
                      <span className="text-blue-600">·</span>
                      <div className="flex items-center gap-1">
                        <span
                          className={
                            job.applicationStatus === 'Shortlisted'
                              ? "text-sm text-green-600"
                              : job.applicationStatus === 'Pending'
                              ? "text-sm text-yellow-300"
                              : "text-sm text-red-500"
                          }
                        >
                          {job.applicationStatus}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      variants={itemVariants}
                      className="text-sm text-muted-foreground mt-1"
                    >
                      No longer accepting applications
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              variants={itemVariants}
              className="text-center text-muted-foreground"
            >
              No applications found.
            </motion.p>
          )}
        </motion.div>
      </Tabs>
    </motion.div>
  );
}