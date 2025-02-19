import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import { useParams } from "react-router-dom";

const dummyColumns = (handleActiveToggle) => [
  { key: "title", label: "Title" },
  { key: "location", label: "Location" },
  {
    key: "active",
    label: "Active Status",
    render: (active, row) => (
      <>
        <span
          className={`px-2 py-1 rounded font-bold ${
            active ? "text-green-500" : "text-red-500"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>

        <Switch
          checked={active}
          onChange={() => handleActiveToggle(row.id)} // Call the passed function with the row ID
          inputProps={{ "aria-label": "Active Status" }}
        />
      </>
    ),
  },
];

function JobList() {
 
  const employer = useSelector((state) => state.employer.employer)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await employerAxiosInstnce.get(`/job-list/${employer?.employerId}`)
     
        console.log(res);
        
        setJobs(res.data.jobPosts)
        setLoading(false)
      } catch (error) {
        toast.warning(error?.response?.data?.message || "An error occured")
        setLoading(false)
      }
    }
    setLoading(true)
    fetchData()
  },[employer?.employerId])

  if(loading) return <p>Loading</p>

  return (
    <div className="my-6 px-10">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
      {jobs.length > 0 ? (
        jobs.map((job ,index) => (
            <JobCard key = {index} job={job} />
          ))
        ) : (
          <div className="w-full md:h-full h-28 flex items-center justify-center">
            <h1 className="text-xl md:text-2xl font-bold">
              No job available
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobList;
