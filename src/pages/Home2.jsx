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
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";

export default function JobPortalLanding() {
  const [jobs , setJobs] = useState([])
  const fetchJobs = async() => {
    try {
      const {data} = await employerAxiosInstnce.get('/getAllJobs')
      console.log(data.jobPosts);
      setJobs(data.jobPosts)
      
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchJobs()
  },[])
  // const jobs = Array(8).fill({});

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gray-100 text-center h-[75vh] flex flex-col justify-center items-center overflow-hidden">
          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 z-10">
            Find Your Dream Job or Perfect Candidate
          </h1>
          <div className="flex justify-center flex-wrap gap-4 mt-6 z-10">
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

        {/* Job Cards Section */}
        {/* Job Cards Section */}
        <div className="py-16 bg-gray-50">
          <h2 className="text-2xl font-bold text-primary px-4 lg:px-10 text-center">
            Jobs Recommended for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 lg:px-10 mt-6">
            {jobs.map((jobs, index) => (
              <JobCard key={index} title={jobs?.jobTitle} location={jobs?.city} salary={jobs?.salaryRange} date={jobs?.createdAt} id = {jobs?._id}/>
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
                Discover your next career move with our extensive job listings
                and personalized recommendations.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Access thousands of job listings",
                  "Create a standout profile",
                  "Get personalized job recommendations",
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
                Find the perfect candidates quickly and efficiently with our
                advanced recruiting tools.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Post jobs and manage applications",
                  "Search our extensive candidate database",
                  "Use AI-powered matching technology",
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
                text: "JobConnect helped me find my dream job in just two weeks. The platform is user-friendly and the job recommendations were spot-on!",
                author: "Sarah T. - Software Developer",
              },
              {
                text: "As an employer, I've been impressed with the quality of candidates we've found through JobConnect. It's streamlined our hiring process significantly.",
                author: "Mark R. - HR Manager",
              },
              {
                text: "The AI-powered matching on JobConnect is a game-changer. I've never had such relevant job recommendations before!",
                author: "Emily L. - Marketing Specialist",
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
            <h2 className="text-3xl font-bold">Why Choose JobConnect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
            {[
              {
                icon: <People className="text-blue-500" />,
                title: "Large Talent Pool",
                description:
                  "Access thousands of qualified candidates or job listings.",
              },
              {
                icon: <BarChart className="text-blue-500" />,
                title: "Advanced Matching",
                description:
                  "Our AI-powered system ensures perfect job-candidate fits.",
              },
              {
                icon: <Star className="text-blue-500" />,
                title: "Top Companies",
                description: "Partner with industry-leading organizations.",
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
          © 2024 JobConnect. All rights reserved.
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
