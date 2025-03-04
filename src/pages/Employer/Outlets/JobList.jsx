import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";



function JobList() {
  const employer = useSelector((state) => state.employer.employer);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employerAxiosInstnce.get(
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
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <div className=" flex justify-end mb-6">
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
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3"
              : "flex flex-col"
          }`}
        >
          {jobs.map((job, index) => (
            <div key={index} className="flex justify-center">
              <JobCard key={index} job={job} layout={viewMode} />
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
  );
}

export default JobList;
