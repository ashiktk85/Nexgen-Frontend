"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  People,
  BarChart,
  Star,
  CheckCircleOutline,
  Facebook,
  Twitter,
  LinkedIn,
  Mail,
  // MapPin,
  Phone,
} from "@mui/icons-material";
import JobCard from "@/components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion } from "framer-motion";
import bannerImg from "/Images/bannerImg.jpg";
import employerImg from "/Images/employer-img.jpg";
import repairImg from "/Images/mob-repair-img1.jpg";
import { useSelector } from "react-redux";
import seekerImg from "/Images/cv.png";
import businessmanImg from "/Images/businessman.png";
import AdBannerCarousel from "@/components/User/adBanner";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.seekerInfo);
  const [adBanners, setAdBanners] = useState([]);
  const navigate = useNavigate();

  // Fetch ad banners from the same endpoint used in banner-admin
  const fetchAdBanners = async () => {
    try {
      const { data } = await adminAxiosInstance.get("/all-banners");
      // The response structure is { message, data } where data contains the banner array
      if (data && data.data) {
        // Map the backend data structure to match what AdBannerCarousel expects
        const mappedBanners = data.data
          .filter((banner) => banner.active) // Only show active banners
          .map((banner) => ({
            id: banner._id,
            imageUrl: banner.image, // This is the signed URL from S3
            link: banner.link || "#", // Default to "#" if no link is provided
            altText: banner.fileName || "Advertisement Banner",
          }));
        setAdBanners(mappedBanners);
        console.log("Banners loaded:", mappedBanners.length);
      } else {
        setAdBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Fallback to empty array if fetch fails
      setAdBanners([]);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const query = searchTerm.trim();
      if (query) {
        navigate("/all-jobs", {
          state: {
            searchInput: query,
          },
        });
      }
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await userAxiosInstance.get("/getJobPosts", {
        params: { userId: user?.userId, page: 1, limit: 12 },
      });
      const jobPosts = data?.jobs || data?.jobPosts || [];
      console.log(jobPosts);

      // Sort: Unapplied first, then by newest date
      const sortedJobs = (jobPosts || []).sort((a, b) => {
        if (a.alreadyApplied !== b.alreadyApplied) {
          return a.alreadyApplied ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Limit to 12 jobs for the Home page
      setJobs(sortedJobs.slice(0, 12));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAdBanners(); // Fetch ad banners when component mounts
  }, []);

  if (loading) return <p>Loading</p>;

  return (
    <>
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full min-h-[520px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center"
        >
          <img
            src={bannerImg || "/placeholder.svg"}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-8 md:px-16 lg:px-20 text-white"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className="mt-2 text-sm sm:text-md md:text-lg max-w-2xl font-marcellus">
              Whether you're a skilled technician or just starting out, our
              platform is designed to match you with job opportunities tailored
              to your expertise.
            </p>

            {/* Search box */}
            <div className="mt-4 w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Search jobs by title, keyword, or location"
                className="w-full py-3 px-5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-[#07407d] transition w-full sm:w-auto"
              >
                Search
              </button>
            </div>

            {Object.keys(user).length < 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6 mt-6 sm:mt-8 w-full max-w-md"
              >
                <Link to="/sign-up" className="w-full">
                  <div className="flex items-center justify-between w-full rounded-lg bg-primary py-4 px-6 text-white transform transition-transform hover:scale-105">
                    <div className="mx-auto text-center">
                      <span className="text-sm block">Register as</span>
                      <div className="text-lg font-semibold">Job Seeker</div>
                    </div>
                    <img
                      src={seekerImg || "/placeholder.svg"}
                      alt="img"
                      className="w-12 h-12"
                    />
                  </div>
                </Link>

                <Link to="/employer/register" className="w-full">
                  <div className="flex items-center justify-between w-full rounded-lg bg-primary py-4 px-6 text-white transform transition-transform hover:scale-105">
                    <div className="mx-auto text-center">
                      <span className="text-sm block">Register as</span>
                      <div className="text-lg font-semibold">Employer</div>
                    </div>
                    <img
                      src={businessmanImg || "/placeholder.svg"}
                      alt="businessImg"
                      className="w-12 h-12"
                    />
                  </div>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Jobs Recommended Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 md:py-20 bg-slate-200"
        >
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Featured Job Opportunities
              </h2>
              <p className="text-gray-600 text-lg">
                Discover roles perfectly matched to your skills and aspirations
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs?.map((job, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="h-full flex"
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Link to="/all-jobs">
                <button
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg
                  hover:bg-[#07407d] transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  View All Jobs
                </button>
              </Link>
            </motion.div>

            {/* Ad Banner Section (mobile) */}
            {adBanners.length > 0 && (
              <div className="mt-8 md:hidden">
                <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Ad Banner Section - only renders if banners exist */}
        {adBanners.length > 0 && (
          <div className="hidden md:block">
            <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
          </div>
        )}

        {/* For Job Seekers Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 sm:px-8 lg:px-16">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                For Job Seekers
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6">
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
                    <CheckCircleOutline className="text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/all-jobs">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Find Jobs
                </button>
              </Link>
            </div>
            <div className="order-1 md:order-2 mb-4 md:mb-0">
              <img
                src={repairImg || "/placeholder.svg"}
                alt="Job seeker using laptop"
                className="rounded-xl shadow-xl w-full h-48 sm:h-64 object-cover
                          transition-transform ease-in-out transform hover:scale-105 duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* For Employers Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 sm:px-8 lg:px-16">
            <div className="mb-4 md:mb-0">
              <img
                src={employerImg || "/placeholder.svg"}
                alt="Employer posting a job"
                className="rounded-xl shadow-xl w-full h-48 sm:h-64 object-cover
                          transition-transform ease-in-out transform hover:scale-105 duration-300"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                For Employers
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6">
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
                    <CheckCircleOutline className="text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/employer/register">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Post a Job
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section removed */}

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Why Choose TechPath
              </h2>
              <p className="text-gray-600 text-lg">
                A fresh platform built for modern hiring
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {[
                {
                  icon: <People className="text-blue-500 text-5xl" />,
                  title: "High-intent talent, not just traffic",
                  description:
                    "TechPath curates a growing community of verified professionals and companies. We focus on quality over volume so every profile and job post is relevant and worth your time.",
                },
                {
                  icon: <BarChart className="text-blue-500 text-5xl" />,
                  title: "Smart matching that learns from you",
                  description:
                    "Our matching engine looks beyond keywords to understand skills, experience, and preferences on both sides, improving recommendations with every interaction.",
                },
                {
                  icon: <Star className="text-blue-500 text-5xl" />,
                  title: "Built for ambitious teams and talent",
                  description:
                    "TechPath is designed for fast-growing startups and forward-thinking enterprises, shaping a modern hiring experience together with early users.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-8 bg-white border border-gray-200 rounded-xl text-center shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
                >
                  <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-gray-100 pt-16 pb-8"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Techpath</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting talented professionals with opportunities that match their skills and ambitions.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <LinkedIn size={20} />
                </a>
              </div>
            </motion.div>

            {/* For Job Seekers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/all-jobs" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    My Applications
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Resume Tips
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* For Employers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/employer/register" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Browse Candidates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">
                    Hiring Resources
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  {/* <MapPin size={16} className="text-blue-400 flex-shrink-0" /> */}
                  <span>123 Tech Street, City, Country</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={16} className="text-blue-400 flex-shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-blue-400 transition">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={16} className="text-blue-400 flex-shrink-0" />
                  <a href="mailto:support@jobconnect.com" className="hover:text-blue-400 transition">
                    support@jobconnect.com
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-center"
          >
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © Techpath. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                Cookie Settings
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                Accessibility
              </a>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
