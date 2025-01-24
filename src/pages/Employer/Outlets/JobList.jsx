import React from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";

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
  // Dummy data for testing
  const jobList = [
    { id: 1, title: "Software Engineer", location: "New York", active: true },
    { id: 2, title: "Product Manager", location: "San Francisco", active: false },
    { id: 3, title: "Designer", location: "Austin", active: true },
    { id: 4, title: "Data Scientist", location: "Seattle", active: false },
    { id: 5, title: "QA Engineer", location: "Chicago", active: true },
    { id: 6, title: "DevOps Engineer", location: "Denver", active: false },
  ];

  return (
    <div className="my-6 px-10">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
        
        <JobCard  />
        <JobCard  />
        <JobCard  />
        <JobCard  />
        <JobCard  />
        <JobCard  />
      </div>
    </div>
  );
}

export default JobList;
