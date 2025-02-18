import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance"; // Fix typo
import { useParams } from "react-router-dom";

function JobList() {
  const employer = useSelector((state) => state.employer);
  const employerId = employer?._id;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Fix uppercase issue

  useEffect(() => {
    const fetchData = async () => {
      if (!employerId) return;
      try {
        setLoading(true);
        console.log("Fetching jobs for employerId:", employerId);
        const res = await employerAxiosInstance.get(`/job-list/${employerId}`);
        console.log("API Response: ", res.data);
        setJobs(res.data?.jobPosts || []); // Ensure correct data access
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.warning(error?.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employerId]); // ✅ Use employerId instead of employer?.employer?._id

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading jobs...</div>;
  }

  return (
    <div className="my-6 px-10">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
        {jobs.map((job) => (
          <JobCard
            key={job._id} // ✅ Use job._id instead of index
            title={job?.jobTitle}
            location={job?.city}
            postedDate={job?.createdAt}
            isActive={!job?.isBlocked}
            applicantsCount={job?.applicationsCount}
            jobId={job?._id}
          />
        ))}
      </div>
    </div>
  );
}

export default JobList;
