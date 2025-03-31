import React from "react";
import { useNavigate } from "react-router-dom";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from "../ui/card";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage
// } from "../ui/avatar";

import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { calculateTimeAgo } from "@/utils/dateFormation";


const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();

  const jobDetailNavigation = () => {
    navigate(`/job-details/${job._id}`);
  };
  console.log('Jobbbbb: ', job)
  return (
<article
      className={`bg-white shadow-md rounded-2xl transition-all hover:shadow-lg ${
        layout === "list"
          ? "w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6"
          : "w-full max-w-xs mx-auto p-5"
      }`}
      aria-label="Job listing card"
    >
      {/* Logo Section */}
      <figure
        className={`${
          layout === "list" ? "w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-0" : "w-12 h-12 mb-3"
        } bg-black rounded-full flex items-center justify-center flex-shrink-0`}
        aria-hidden="true"
      >
        <span className="text-white font-bold text-lg">{job.companyName?.charAt(0) || "J"}</span>
      </figure>

      {/* Job Info */}
      <div className={`flex-1 min-w-0 ${layout === "list" ? "sm:ml-2" : ""}`}>
        <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">{job.jobTitle}</h1>

        <p className="text-sm text-gray-500 mb-1">{job?.companyName?.toUpperCase()}</p>

        {/* Job Details */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MdPlace className="flex-shrink-0" />
            <p className="truncate">{`${job.city}, ${job.country}`}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <FaIndianRupeeSign className="flex-shrink-0" />
            <p className="truncate">{job.salaryRange?.join(" - ")}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <IoBriefcase className="flex-shrink-0" />
            <p className="truncate">
              {[job.experienceRequired[0], job.experienceRequired[job.experienceRequired.length - 1]].join(" - ")} yrs
            </p>
          </div>
        </div>
      </div>

      {/* Job Details Button and Posted Date */}
      <footer
        className={`mt-4 ${
          layout === "list"
            ? "w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-auto"
            : "flex items-center justify-between"
        }`}
      >
        <button
          className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg
           hover:bg-white border hover:border-blue-500 hover:text-blue-500 transition w-full sm:w-auto"
          aria-label="View job details"
          onClick={jobDetailNavigation}
        >
          Job Details
        </button>

        <p className="text-sm text-gray-500 mt-2 sm:mt-0">{calculateTimeAgo(job.createdAt)}</p>
      </footer>
    </article>
  );
};

export default JobCard;
