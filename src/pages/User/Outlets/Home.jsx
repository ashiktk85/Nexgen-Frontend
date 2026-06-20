"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowForward,
  CheckCircleOutline,
  Facebook,
  Twitter,
  LinkedIn,
  Mail,
  LocationOn,
  Payments,
  Work,
  PersonSearch,
  Business,
  Verified,
  Groups,
  Psychology,
  RocketLaunch,
} from "@mui/icons-material";
import { getJobCategory } from "@/constants/options";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion } from "framer-motion";
import bannerImg from "/Images/bannerImg.jpg";
import employerImg from "/Images/employer-img.jpg";
import repairImg from "/Images/mob-repair-img1.jpg";
import { useSelector } from "react-redux";
import AdBannerCarousel from "@/components/User/adBanner";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";
import PageLoader from "@/components/PageLoader";
import { Helmet } from "react-helmet-async";

// Scroll-triggered animation config
const viewportOnce = { once: true, amount: 0.18, margin: "-60px 0px" };

const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const scrollFadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollFadeLeftVariants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollFadeRightVariants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollScaleVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const FEATURED_AVATAR_STYLES = [
  { bg: "bg-[#003f87]/10", text: "text-[#003f87]" },
  { bg: "bg-[#722b00]/10", text: "text-[#722b00]" },
  { bg: "bg-[#0058be]/10", text: "text-[#0058be]" },
];

const FeaturedJobCard = ({ job, index = 0 }) => {
  const navigate = useNavigate();
  const initial = (job.companyName || job.jobTitle)?.charAt(0)?.toUpperCase() || "J";
  const avatarStyle = FEATURED_AVATAR_STYLES[index % FEATURED_AVATAR_STYLES.length];
  const category = getJobCategory(job.jobTitle);

  const handleApply = () =>
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
      },
    });

  return (
    <article className="bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 ${avatarStyle.bg} rounded-lg flex items-center justify-center`}>
          <span className={`${avatarStyle.text} font-bold text-xl`}>{initial}</span>
        </div>
        {category && (
          <span className="bg-[#0058be]/10 text-[#0058be] px-3 py-1 rounded-full text-xs font-bold">
            {category}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-semibold text-[#141b2b] mb-2 line-clamp-2">{job.jobTitle}</h3>
      <p className="text-sm font-semibold text-[#0058be] uppercase tracking-wide mb-4">{job.companyName}</p>
      <div className="flex flex-wrap gap-4 text-[#424752] text-sm mb-6">
        <div className="flex items-center gap-1">
          <LocationOn sx={{ fontSize: 16 }} />
          {[job.city, job.country].filter(Boolean).join(", ")}
        </div>
        {job.salaryRange?.length >= 2 && (
          <div className="flex items-center gap-1">
            <Payments sx={{ fontSize: 16 }} />
            ₹ {job.salaryRange[0]} - {job.salaryRange[job.salaryRange.length - 1]}
          </div>
        )}
        {job.experienceRequired?.length >= 1 && (
          <div className="flex items-center gap-1">
            <Work sx={{ fontSize: 16 }} />
            {job.experienceRequired[0]}–{job.experienceRequired[job.experienceRequired.length - 1]} yrs
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-auto">
        <button
          type="button"
          onClick={!job.alreadyApplied ? handleApply : undefined}
          disabled={job.alreadyApplied}
          className="flex-1 bg-[#0058be] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#2170e4] transition-colors disabled:bg-slate-200 disabled:text-slate-500"
        >
          {job.alreadyApplied ? "Applied" : "Apply Now"}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/job-details/${job._id}`)}
          className="px-4 py-3 border border-[#c2c6d4] rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] transition-colors text-sm font-semibold"
        >
          Details
        </button>
      </div>
    </article>
  );
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchDebounceRef = useRef(null);
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

  const runSearch = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setSearchLoading(true);
      setShowSearchResults(true);
      try {
        const { data } = await userAxiosInstance.get("/getJobPosts", {
          params: {
            userId: user?.userId,
            page: 1,
            limit: 10,
            search: trimmed,
          },
        });
        setSearchResults(data?.jobs || data?.jobPosts || []);
      } catch (error) {
        console.error("Hero search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [user?.userId]
  );

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault?.();
      runSearch(searchTerm);
    }
  };

  const handleJobSelect = (jobId) => {
    setShowSearchResults(false);
    navigate(`/job-details/${jobId}`);
  };

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      runSearch(searchTerm);
    }, 400);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchTerm, runSearch]);

  const fetchJobs = async () => {
    setInitialLoading(true);
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
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAdBanners(); // Fetch ad banners when component mounts
  }, []);

  if (initialLoading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>TechPath - Mobile Phone Repair Jobs in Kerala | Technician Careers</title>
        <meta
          name="description"
          content="Find mobile repair jobs in Kerala. Connect with top employers hiring chip-level technicians, iPhone/Android experts, and service managers. Register as job seeker or employer."
        />
      </Helmet>
      <main className="flex-grow bg-[#f9f9ff]">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen h-screen flex items-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img src={bannerImg || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(20, 27, 43, 0.9), rgba(20, 27, 43, 0.4))" }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative z-10 w-full max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-5 pt-20 pb-10"
          >
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                Find Your Dream Mobile Repair Job in Kerala Today
              </h1>
              <p className="text-base sm:text-lg mb-10 text-white/80 leading-relaxed">
                Whether you&apos;re a skilled mobile technician in Kerala or just starting out,
                TechPath connects you with top employers seeking chip-level, Android,
                iPhone, and service experts.
              </p>

              <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 mb-12 relative">
                <div className="flex-1 flex items-center px-4 gap-3 min-w-0">
                  <Search className="text-[#727784] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search mobile repair jobs, Android, iPhone, chip-level technician, Kerala..."
                    className="w-full border-none focus:ring-0 text-[#424752] bg-transparent py-4 text-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    onFocus={() => {
                      if (searchTerm.trim() && searchResults.length) setShowSearchResults(true);
                    }}
                    aria-label="Search jobs"
                    aria-expanded={showSearchResults}
                    aria-controls="hero-search-results"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#0058be] text-white px-8 md:px-10 py-4 rounded-lg font-semibold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Search
                </button>

                {showSearchResults && (
                  <div
                    id="hero-search-results"
                    className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white shadow-2xl border border-[#E2E8F0] text-left overflow-hidden z-20"
                  >
                    {searchLoading ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-500">Searching jobs...</div>
                    ) : searchResults.length > 0 ? (
                      <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {searchResults.map((job) => (
                          <li key={job._id}>
                            <button
                              type="button"
                              onClick={() => handleJobSelect(job._id)}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                            >
                              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{job.jobTitle}</p>
                              <p className="text-xs font-medium text-[#0058be] mt-0.5 line-clamp-1">{job.companyName}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-slate-500">
                        No jobs found for &quot;{searchTerm.trim()}&quot;
                      </div>
                    )}
                    {!searchLoading && searchResults.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => navigate("/all-jobs", { state: { searchInput: searchTerm.trim() } })}
                          className="text-xs font-semibold text-[#003f87] hover:underline"
                        >
                          View all results on job board →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {Object.keys(user).length < 1 && (
                <div className="flex flex-row gap-3 w-full max-w-4xl">
                  <Link to="/register" className="group flex-1 min-w-0">
                    <div className="bg-[#0056b3]/20 backdrop-blur-md border border-white/20 hover:bg-[#0056b3]/30 text-white flex flex-col gap-3 px-4 py-5 sm:py-6 rounded-xl transition-all h-full min-h-[148px] cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <PersonSearch className="!text-2xl sm:!text-3xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="text-left min-w-0">
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Register as</p>
                            <p className="text-sm sm:text-base font-bold leading-snug">Job Seeker</p>
                          </div>
                        </div>
                        <ArrowForward
                          fontSize="small"
                          className="flex-shrink-0 mt-1 opacity-80 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                        />
                      </div>
                      <ul className="space-y-1.5 text-[11px] sm:text-xs text-white/85 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Browse and apply to mobile repair jobs in Kerala
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Build your technician profile and upload your resume
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Track applications and get matched to new roles
                        </li>
                      </ul>
                    </div>
                  </Link>
                  <Link to="/employer/register" className="group flex-1 min-w-0">
                    <div className="bg-[#2170e4]/20 backdrop-blur-md border border-white/20 hover:bg-[#2170e4]/30 text-white flex flex-col gap-3 px-4 py-5 sm:py-6 rounded-xl transition-all h-full min-h-[148px] cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Business className="!text-2xl sm:!text-3xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="text-left min-w-0">
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Register as</p>
                            <p className="text-sm sm:text-base font-bold leading-snug">Mobile Repair Employer</p>
                          </div>
                        </div>
                        <ArrowForward
                          fontSize="small"
                          className="flex-shrink-0 mt-1 opacity-80 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                        />
                      </div>
                      <ul className="space-y-1.5 text-[11px] sm:text-xs text-white/85 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Add your shop and service center details
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Post jobs and hire qualified technicians
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/75 flex-shrink-0" />
                          Manage hiring from your employer dashboard
                        </li>
                      </ul>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Featured Jobs */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#f1f3ff]">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeUpVariants}
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#141b2b] mb-2">
                  Featured Mobile Repair &amp; Service Jobs in Kerala
                </h2>
                <p className="text-[#424752] max-w-xl">
                  Discover chip-level, Android, iPhone, and management roles perfectly matched to your skills
                </p>
              </div>
              <Link
                to="/all-jobs"
                className="text-[#003f87] font-semibold flex items-center gap-2 group hover:gap-4 transition-all whitespace-nowrap"
              >
                View All Jobs <ArrowForward fontSize="small" />
              </Link>
            </motion.div>

            <motion.div
              variants={scrollContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {jobs.slice(0, 6).map((job, index) => (
                <motion.div key={job._id} variants={scrollFadeUpVariants}>
                  <FeaturedJobCard job={job} index={index} />
                </motion.div>
              ))}
            </motion.div>

            {adBanners.length > 0 && (
              <motion.div
                className="mt-10 md:hidden"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={scrollFadeUpVariants}
              >
                <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
              </motion.div>
            )}
          </div>
        </section>

        {adBanners.length > 0 && (
          <motion.div
            className="hidden md:block bg-[#f1f3ff]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUpVariants}
          >
            <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
          </motion.div>
        )}

        {/* For Job Seekers */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              className="relative order-1 lg:order-none"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeLeftVariants}
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#003f87]/5 rounded-full blur-3xl" />
              <img
                src={repairImg || "/placeholder.svg"}
                alt="Job seeker using laptop"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[1.73]"
              />
              <motion.div
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-5 sm:p-6 rounded-xl shadow-xl z-20 border border-[#E2E8F0] max-w-xs"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={scrollScaleVariants}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[#0058be] bg-[#0058be]/10 p-2 rounded-lg flex items-center">
                    <Verified fontSize="small" />
                  </span>
                  <p className="font-semibold text-[#141b2b] text-sm">Verified Expert</p>
                </div>
                <p className="text-sm text-[#424752] italic">
                  &quot;Found my current role within 2 weeks. The matching was incredibly accurate.&quot;
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              className="order-2 lg:order-none"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeRightVariants}
            >
              <span className="text-[#003f87] text-xs font-bold tracking-widest uppercase mb-4 block">For Talent</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#141b2b] mb-6">For Job Seekers</h2>
              <p className="text-lg text-[#424752] mb-10">
                Discover your next career move with our extensive job listings
                and personalized recommendations.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  "Access thousands of job listings",
                  "Create a standout profile",
                  "Get personalized job recommendations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="text-[#003f87] bg-[#003f87]/10 p-1 rounded-full flex items-center">
                      <CheckCircleOutline sx={{ fontSize: 18 }} />
                    </span>
                    <p className="text-[#141b2b]">{item}</p>
                  </li>
                ))}
              </ul>
              <Link to="/all-jobs">
                <button className="bg-[#003f87] text-white px-10 py-4 rounded-lg font-semibold hover:shadow-xl transition-all active:scale-[0.98] inline-flex items-center gap-2 group">
                  Find Jobs
                  <ArrowForward fontSize="small" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* For Employers */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeLeftVariants}
            >
              <span className="text-[#0058be] text-xs font-bold tracking-widest uppercase mb-4 block">For Growth</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#141b2b] mb-6">For Employers</h2>
              <p className="text-lg text-[#424752] mb-10">
                Find the perfect candidates quickly and efficiently with our
                advanced recruiting tools.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  "Post jobs and manage applications",
                  "Search our extensive candidate database",
                  "Use AI-powered matching technology",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="text-[#0058be] bg-[#0058be]/10 p-1 rounded-full flex items-center">
                      <CheckCircleOutline sx={{ fontSize: 18 }} />
                    </span>
                    <p className="text-[#141b2b]">{item}</p>
                  </li>
                ))}
              </ul>
              <Link to="/employer/register">
                <button className="bg-[#0058be] text-white px-10 py-4 rounded-lg font-semibold hover:shadow-xl transition-all active:scale-[0.98] inline-flex items-center gap-2 group">
                  Post a Job
                  <ArrowForward fontSize="small" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
            <motion.div
              className="relative order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scrollFadeRightVariants}
            >
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0058be]/5 rounded-full blur-3xl" />
              <img
                src={employerImg || "/placeholder.svg"}
                alt="Employer posting a job"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[1.5]"
              />
              <motion.div
                className="absolute -top-6 -left-4 sm:-left-6 bg-[#e1e8fd] p-5 sm:p-6 rounded-xl shadow-xl z-20 border border-[#E2E8F0] flex items-center gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={scrollScaleVariants}
                transition={{ delay: 0.2 }}
              >
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-300" />
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400" />
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-500" />
                </div>
                <p className="font-semibold text-[#141b2b] text-sm">Growing Talent Pool</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose TechPath */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#141b2b] text-white">
          <motion.div
            className="max-w-[1280px] mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUpVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Why Choose TechPath</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              A fresh platform built for modern hiring, connecting high-intent talent with ambitious teams.
            </p>
          </motion.div>
          <motion.div
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Groups className="!text-3xl" />,
                color: "bg-[#003f87]",
                title: "High-intent talent, not just traffic",
                description:
                  "TechPath curates a growing community of verified professionals and companies. We focus on quality over volume so every profile and job post is relevant and worth your time.",
              },
              {
                icon: <Psychology className="!text-3xl" />,
                color: "bg-[#0058be]",
                title: "Smart matching that learns from you",
                description:
                  "Our matching engine looks beyond keywords to understand skills, experience, and preferences on both sides, improving recommendations with every interaction.",
              },
              {
                icon: <RocketLaunch className="!text-3xl" />,
                color: "bg-[#722b00]",
                title: "Built for ambitious teams and talent",
                description:
                  "TechPath is designed for fast-growing startups and forward-thinking enterprises, shaping a modern hiring experience together with early users.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={scrollFadeUpVariants}
                className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl hover:bg-white/10 transition-colors text-left"
              >
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-8`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={scrollFadeUpVariants}
        className="bg-[#dce2f7] w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto gap-12">
          <div className="max-w-xs">
            <span className="text-2xl font-bold text-[#003f87] block mb-6">Techpath</span>
            <p className="text-[#424752] text-sm leading-relaxed">
              Connecting talented professionals with opportunities that match their skills and ambitions.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]">
                <Facebook fontSize="small" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]">
                <Twitter fontSize="small" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]">
                <LinkedIn fontSize="small" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 flex-1">
            <div>
              <h4 className="font-semibold text-[#141b2b] mb-6">For Job Seekers</h4>
              <ul className="space-y-4">
                <li><Link to="/all-jobs" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Browse Jobs</Link></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">My Applications</a></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Career Advice</a></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Resume Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#141b2b] mb-6">For Employers</h4>
              <ul className="space-y-4">
                <li><Link to="/employer/register" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Post a Job</Link></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Browse Candidates</a></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Hiring Resources</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-[#141b2b] mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-[#424752]">
                <li>
                  <address className="not-italic leading-relaxed">
                    Koduveli Building 53/3608, Subhash Chandra Bose Road<br />
                    opp Muthoot Finance Vyttila, near Ponnurunni,<br />
                    Vytila, Kochi, Kerala 682019
                  </address>
                </li>
                <li className="flex items-center gap-2">
                  <Mail sx={{ fontSize: 16 }} className="text-[#0058be] flex-shrink-0" />
                  <a href="mailto:techpath786@gmail.com" className="hover:text-[#0058be] transition-colors">
                    techpath786@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-[#c2c6d4]/30 py-8 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#424752]">© Techpath. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/terms" className="text-[#424752] hover:text-[#003f87] transition-colors">Terms of Service</a>
            <a href="/privacy" className="text-[#424752] hover:text-[#003f87] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#424752] hover:text-[#003f87] transition-colors">Cookie Settings</a>
            <a href="#" className="text-[#424752] hover:text-[#003f87] transition-colors">Accessibility</a>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
