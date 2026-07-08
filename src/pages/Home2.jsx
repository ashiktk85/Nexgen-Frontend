import React, { useEffect, useState } from "react";
import {
  Search,
  People,
  BarChart,
  Star,
  CheckCircleOutline,
} from "@mui/icons-material";
import Navbar from "../components/User/Navbar";
import JobCard from "../components/User/JobCard";
import axios from "axios";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
// import {banner1} from "../../public/Images/banner1"

export default function JobPortalLanding() {
  const [jobs, setJobs] = useState([]);
  const fetchJobs = async () => {
    try {
      const { data } = await userAxiosInstance.get("/getJobPosts");
      console.log(data.jobPosts);
      setJobs(data.jobPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);
  // const jobs = Array(8).fill({});

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gray-100 text-center h-[75vh] flex flex-col justify-center items-center overflow-hidden">
          {/* Main Content */}

          <img
            src="../../public/Images/banner3.svg"
            alt=""
            className="object-cover w-full transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 h-[75vh] p-6 flex flex-col items-center justify-center  ">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-10 z-10">
              Find Your Dream Job or Perfect Candidate
            </h1>
            <div className="flex justify-center flex-wrap gap-4 z-10">
              <input
                type="text"
                placeholder="Title..."
                className="px-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Place..."
                className="px-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-24 bg-primary rounded-sm text-white flex justify-center items-center">
                <Search className="mr-2" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Job Cards Section */}
        {/* Job Cards Section */}
        <div className="py-16 bg-gray-50">
          <h2 className="text-2xl font-bold text-primary px-4 lg:px-10 text-center">
            Latest Mobile Repair Jobs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 lg:px-10 mt-6">
            {jobs.map((jobs, index) => (
              <JobCard
                key={index}
                title={jobs?.jobTitle}
                location={jobs?.city}
                salary={jobs?.salaryRange}
                date={jobs?.createdAt}
                id={jobs?._id}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Browse All Jobs
            </button>
          </div>
        </div>

        {/* For Job Seekers Section */}
        <div className="py-16 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">For Job Seekers</h2>
              <p className="text-gray-700 mb-6">
                Discover mobile repair careers across Kerala — browse listings,
                build your technician profile, and apply to verified shops.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Browse chip-level, Android, and iPhone repair jobs",
                  "Create a profile with resume, education, and experience",
                  "Filter by Kerala district, skill, and experience level",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleOutline className="text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Find Jobs
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60"
                alt="Job seeker using laptop"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>

        {/* For Employers Section */}
        <div className="py-16 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-16">
            <div>
              <img
                src="https://plus.unsplash.com/premium_photo-1661658740167-45b56833412b?w=500&auto=format&fit=crop&q=60"
                alt="Employer posting a job"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">For Employers</h2>
              <p className="text-gray-700 mb-6">
                Hire qualified mobile technicians with job posts, shop profiles,
                and application tools built for Kerala&apos;s repair industry.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Post jobs and manage applications in one place",
                  "Showcase your repair shop with location and contact details",
                  "Schedule go-live dates and reach interested technicians",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleOutline className="text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Post a Job
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
            {[
              {
                text: "TechPath helped me find a chip-level repair role in Ernakulam within two weeks.",
                author: "Arun K. - Chip-Level Technician",
              },
              {
                text: "Posting jobs and reviewing applications on TechPath made hiring technicians for our service center much easier.",
                author: "Sreejith M. - Repair Shop Owner",
              },
              {
                text: "I could filter Android and iPhone repair jobs by district and experience — exactly what I needed.",
                author: "Anjali P. - Mobile Technician",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Why Choose TechPath</h2>
            <p className="mt-2 text-gray-600 text-lg">
              A fresh platform built for modern hiring
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
            {[
              {
                icon: <People className="text-blue-500" />,
                title: "High-intent talent, not just traffic",
                description:
                  "TechPath curates a growing community of verified professionals and companies. We focus on quality over volume so every profile and job post is relevant and worth your time.",
              },
              {
                icon: <BarChart className="text-blue-500" />,
                title: "Smart matching that learns from you",
                description:
                  "Our matching engine looks beyond keywords to understand skills, experience, and preferences on both sides, improving recommendations with every interaction.",
              },
              {
                icon: <Star className="text-blue-500" />,
                title: "Built for ambitious teams and talent",
                description:
                  "TechPath is designed for fast-growing startups and forward-thinking enterprises, shaping a modern hiring experience together with early users.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white border rounded-lg text-center"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          © TechPath. All rights reserved.
        </p>
        <div className="space-x-4">
          <button className="text-blue-600 hover:underline">
            Terms of Service
          </button>
          <button className="text-blue-600 hover:underline">Privacy</button>
        </div>
      </footer>
    </div>
  );
}


