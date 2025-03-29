import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import JobCard from "../../../components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";

const AllJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("");
  // const [companyData, setCompanyData] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const [searchedJobs, setSearchedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const searchBoxRef = useRef(null);
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSearchBox(false);
      }
    }

    if (showSearchBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchBox]);

  
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobType, experienceLevel, searchLocation]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const {data} = await userAxiosInstance.get("/getJobPosts");
      console.log(data)
      setJobs(data.jobPosts);
setFilteredJobs(data.jobPosts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning(error?.response?.data?.message || "An error occurred");
    }
  };

  const handleSearch = () => {
    let searchedJobs = [...jobs];
    if (searchTerm) {
      searchedJobs = searchedJobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (searchLocation) {
      searchedJobs = searchedJobs.filter((job) =>
        job.city.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    setSearchedJobs(searchedJobs);
    setShowSearchBox(false);
  };

  const filterJobs = () => {
    let updatedJobs = [...searchedJobs];

    if (searchTerm) {
      updatedJobs = updatedJobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchLocation) {
      updatedJobs = updatedJobs.filter((job) =>
        job.city.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (jobType) {
      updatedJobs = updatedJobs.filter((job) => job.jobType === jobType);
    }

    if (experienceLevel) {
      updatedJobs = updatedJobs.filter((job) =>
        job.experienceRequired.toString().includes(experienceLevel)
      );
    }

    setFilteredJobs(updatedJobs);
  };
  const clearAll = () => {
    
    setFilteredJobs(jobs);
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-2 pt-12">
        {/* Top Section: Search Bar and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Filters Section */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              {/* Location Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {Array.from(new Set(jobs.map((job) => job.city))).map(
                    (city, index) => (
                      <option key={index} value={city}>{city}</option>
                    )
                  )}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Job Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">Select Job Type</option>
                  {Array.from(new Set(jobs.map((job) => job.jobTitle))).map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Experience Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select Experience</option>
                  {Array.from(
                    new Set(jobs.flatMap((job) => job.experienceRequired))
                  )
                    .sort((a, b) => a - b)
                    .map((level) => (
                      <option key={level} value={level}>
                        {level} years
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <button onClick={clearAll}>Clear All</button>
          </div>

          {/* Search Section */}
          <div className="w-full">
            <div className="flex flex-row gap-3">
              <div className="w-3/4 relative mb-6" ref={searchBoxRef}>
                <div
                  className="flex items-center rounded-md p-3 bg-white cursor-pointer"
                  onClick={() => setShowSearchBox(!showSearchBox)}
                >
                  <FaSearch
                    className={`text-gray-500 transition-all ${
                      showSearchBox ? "mr-0" : "mr-2"
                    }`}
                  />
                  {!showSearchBox && (
                    <span className="text-gray-600">Search jobs</span>
                  )}
                </div>

                {showSearchBox && (
                  <div className="absolute top-full left-0 w-full bg-white p-4 shadow-md rounded-md mt-0">
                    {/* Designation/Company Input */}
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        id="designation"
                        className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder=""
                      />
                      <label
                        htmlFor="designation"
                        className={`absolute left-3 text-gray-500 text-base transition-all 
                      ${
                        searchTerm
                          ? "top-1 text-sm text-blue-500"
                          : "top-4 text-gray-400"
                      } 
                      peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500`}
                      >
                        Designation/Company
                      </label>
                    </div>

                    {/* Location Input */}
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        id="location"
                        className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder=""
                      />
                      <label
                        htmlFor="location"
                        className={`absolute left-3 text-gray-500 text-base transition-all 
                      ${
                        searchLocation
                          ? "top-1 text-sm text-blue-500"
                          : "top-4 text-gray-400"
                      } 
                      peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500`}
                      >
                        Location
                      </label>
                    </div>

                    {/* Search Button */}
                    <button
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                )}
              </div>

              {/* View Toggle Buttons */}
              <div className="w-1/4 relative flex justify-end mb-6">
                <button
                  className={`py-3 px-4 rounded-l-md  ${
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
            </div>
            {/* Job Listings */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-600 text-lg">Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div
                className={`gap-3 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 "
                    : "flex flex-col"
                }`}
              >
                {filteredJobs.map((job) => (
                  <div key={job._id} className="flex justify-center">
                    <JobCard job={job} layout={viewMode} />
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
        </div>
      </div>
    </div>
  );
};

export default AllJobsPage;
