import React from "react";
import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();

  const jobDetailNavigation = () => {
    navigate(`/job-details/${job._id}`);
  };

  return (
    <article
      className={`bg-white shadow-md rounded-lg p-6 space-y-4 transition-all ${
        layout === "list"
          ? "w-full flex items-center gap-4 p-4"
          : "w-80 mx-auto"
      }`}
      aria-label="Job listing card"
    >
      {/* Logo Section */}
      <figure
        className={`${
          layout === "list" ? "w-16 h-16" : "w-12 h-12"
        } bg-black rounded-full flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="text-white font-bold text-lg">F</span>
      </figure>

      {/* Job Info */}
      <div className={`${layout === "list" ? "flex-1" : ""}`}>
        <h1 className="text-lg font-semibold text-gray-800">{job.jobTitle}</h1>
        <p className="text-sm text-gray-500">{job.companyName.toUpperCase()}</p>

        {/* Job Details */}
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <MdPlace />
          <p>{`${job.city}, ${job.country}`}</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <FaIndianRupeeSign />
          <p>{job.salaryRange?.join(" - ")}</p>
        </div>
        <div className={`flex items-center space-x-2 text-gray-600 text-sm`}>
          <IoBriefcase />
          <p>{[job.experienceRequired[0],job.experienceRequired[job.experienceRequired.length-1]].join(" - ")} yrs</p>
        </div>
      </div>

      {/* Job Details Button */}
      <footer>
        <button
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
          aria-label="View job details"
          onClick={jobDetailNavigation}
        >
          Job Details
        </button>
      </footer>
    </article>
  );
};

export default JobCard;
