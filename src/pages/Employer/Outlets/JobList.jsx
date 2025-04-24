import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance"; // Fix typo
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import { ImBriefcase } from "react-icons/im";
import { employerJobDelete, employerJobStatusChange } from "@/apiServices/userApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function JobList() {
  const employer = useSelector((state) => state.employer.employer);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (job) => {
    if (job) {
      console.log("jobedit", job);
      navigate("/employer/job/edit", { state: { job } });
    }
  };

  const handleDelete = (job) => {
    if (job) {
      console.log("job delete", job);
      setSelectedJob(job);
      setIsDialogOpen(true);
    }
  };

  const handleStatus = async (job) => {
    if (job) {
      try {
        console.log("jobedit", job);
        const data = {
          status: job?.status === "open" ? "close" : "open"
        };
        const response = await employerJobStatusChange(job._id, data);
        if (response) {
          const updatedJob = response.data.updatedJob;
          setJobs(prevJobs=>
            prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job )
          )
          toast.success(`Status updated to ${data.status}.`);
          return;
        }
        toast.error(response?.message || "Error updating job status");
      } catch (error) {
        console.error("Job creation error:", error);

        // Extract and show detailed error message
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };
  
  const handleDeleteDecision = async () => {
    if (selectedJob) {
      try {
        console.log("jobedit", selectedJob);

        const response = await employerJobDelete(selectedJob._id, employer?.employerId);
        if (response) {
          setJobs(prevJobs=>
            prevJobs.filter(job => job._id !== selectedJob._id )
          )
          toast.success(`Job deleted!`);
          return;
        }
        toast.error(response?.message || "Error updating job status");
      } catch (error) {
        console.error("Job creation error:", error);

        // Extract and show detailed error message
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      } finally{
        setIsDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentViewMode("grid"); // Force "grid" on sm screens
      } else {
        setCurrentViewMode(viewMode); // Use actual viewMode above sm
      }
    };

    // Set mode on mount and listen for resizes
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]); // Reacts to viewMode changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employerAxiosInstance.get(
          `/job-list/${employer?.employerId}`
        );

        console.log(res);

        setJobs(res.data.jobPosts);
        setLoading(false);
      } catch (error) {
        toast.warning(error?.response?.data?.message || "An error occured");
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [employer?.employerId]);

  return (
    <>
    <div className="my-6 px-2">
      <main className="container mx-auto px-8 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImBriefcase className="h-5 w-5 text-gray-400" />
              <h1 className="text-2xl font-bold">Job List</h1>
            </div>
          </div>
          <div className="hidden sm:flex justify-end mb-6 ">
            <h2>{jobs.employerId}</h2>
            <button
              className={`py-3 px-4 rounded-l-md ${
                viewMode === "grid"
                  ? "bg-blue-600 border text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <FaTh />
            </button>
            <button
              className={`py-3 px-4 rounded-r-md ${
                viewMode === "list"
                  ? "bg-blue-600 border text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setViewMode("list")}
            >
              <FaList />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600 text-lg">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div
              className={`gap-3 ${
                currentViewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3"
                  : "flex flex-col"
              }`}
            >
              {jobs.map((job, index) => (
                <div key={index} className="flex justify-center">
                  <JobCard
                    key={index}
                    job={job}
                    layout={viewMode}
                    handleEdit={handleEdit}
                    handleStatus={handleStatus}
                    handleDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <h1 className="text-xl md:text-2xl font-bold text-gray-700">
                No jobs available
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>

    {/* Status confirmation modal */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              <DialogContent className="w-[1000px] ">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  
                    <p>
                      Are you sure you want to delete this job application? This action
                      cannot be undone.
                    </p>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteDecision}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
    </>
  );
}

export default JobList;
