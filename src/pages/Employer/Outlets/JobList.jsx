import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";

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

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await employerAxiosInstnce.get(`/job-list/${employer?.employerId}`)
     
        console.log(res);
        
        setJobs(res.data)
      } catch (error) {
        toast.warning(error?.response?.data?.message || "An error occured")
      }
    }

    fetchData()
  },[employer?.employerId])

  return (
    <div className="my-6 px-10">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
        
        {
          jobs.map((job ,index) => (
            <JobCard key = {index} title={job?.jobTitle} location={job?.city}
            postedDate={job?.createdAt} isActive={job?.isBlocked} applicantsCount={job?.applicationsCount}
            />
          ))
        }
      </div>
    </div>
  );
}

export default JobList;
