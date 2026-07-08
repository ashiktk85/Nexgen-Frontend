"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowForward,
  CheckCircleOutline,
  Facebook,
  LinkedIn,
  Instagram,
  Mail,
  LocationOn,
  PersonSearch,
  Business,
  Verified,
  Groups,
  Psychology,
} from "@mui/icons-material";
import FeaturedJobCard from "@/components/User/FeaturedJobCard";
import { TECHPATH_SOCIAL } from "@/constants/socialLinks";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion, useReducedMotion } from "framer-motion";
import { useSelector } from "react-redux";
import AdBannerCarousel from "@/components/User/adBanner";
import MobileBanner from "@/components/User/MobileBanner";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";
import { Helmet } from "react-helmet-async";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";

const HERO_BANNER_SRC = "/Images/bannerImg.jpg";
const EMPLOYER_IMG_SRC = "/Images/employer-img.jpg";
const REPAIR_IMG_SRC = "/Images/mob-repair-img1.jpg";

// Scroll-triggered animation config — lighter thresholds to avoid scroll jank
const viewportOnce = { once: true, amount: 0.12, margin: "0px 0px -60px 0px" };

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const scrollFadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollFadeLeftVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollFadeRightVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollScaleVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedMotionFadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const user = useSelector((state) => state.user.seekerInfo);
  const [adBanners, setAdBanners] = useState([]);
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion ? reducedMotionFadeVariants : scrollFadeUpVariants;
  const fadeLeft = reduceMotion ? reducedMotionFadeVariants : scrollFadeLeftVariants;
  const fadeRight = reduceMotion ? reducedMotionFadeVariants : scrollFadeRightVariants;
  const fadeScale = reduceMotion ? reducedMotionFadeVariants : scrollScaleVariants;
  const sectionStagger = reduceMotion ? reducedMotionFadeVariants : scrollContainerVariants;

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
    fetchAdBanners();
  }, []);

  const JobsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 rounded-2xl bg-white border border-[#E2E8F0] animate-pulse" />
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>TechPath - Mobile Phone Repair Jobs in Kerala | Technician Careers</title>
        <meta
          name="description"
          content="Find mobile repair jobs in Kerala. Connect with top employers hiring chip-level technicians, iPhone/Android experts, and service managers. Register as job seeker or employer."
        />
      </Helmet>
      <style>{`
        @keyframes homeHeroKenBurns {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
        .home-hero-bg {
          animation: homeHeroKenBurns 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-hero-bg { animation: none; }
        }
      `}</style>
      <main className="flex-grow bg-[#f9f9ff] w-full overflow-x-hidden">
        {/* Hero — min-height only so scroll is never trapped on load */}
        <section className="relative min-h-[100dvh] flex items-center overflow-x-hidden bg-[#141b2b] w-full">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={HERO_BANNER_SRC}
              alt="Mobile repair professionals at work in Kerala"
              className="home-hero-bg w-full h-full object-cover transform-gpu"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(20, 27, 43, 0.9), rgba(20, 27, 43, 0.4))" }}
            />
          </div>

          <motion.div
            className="relative z-10 w-full max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-5 pt-20 pb-10 min-w-0"
            variants={heroContainerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? false : "visible"}
          >
            <div className="max-w-2xl text-white min-w-0">
              <motion.h1
                variants={heroItemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight break-words"
              >
                Find Your Dream Mobile Repair Job in Kerala Today
              </motion.h1>
              <motion.p
                variants={heroItemVariants}
                className="text-base sm:text-lg mb-10 text-white/80 leading-relaxed"
              >
                Whether you&apos;re a skilled mobile technician in Kerala or just starting out,
                TechPath connects you with top employers seeking chip-level, Android,
                iPhone, and service experts.
              </motion.p>

              <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link
                  to="/all-jobs"
                  className="inline-flex items-center justify-center gap-2 bg-[#0058be] text-white px-8 py-4 rounded-lg font-semibold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Browse Jobs <ArrowForward fontSize="small" />
                </Link>
              </motion.div>

              {Object.keys(user).length < 1 && (
                <motion.div
                  variants={heroItemVariants}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-4xl"
                >
                  <Link to="/register" className="group flex-1 min-w-0">
                    <div className="bg-[#0056b3]/35 border border-white/25 hover:bg-[#0056b3]/45 text-white flex flex-col gap-3 px-4 py-5 sm:py-6 rounded-xl transition-colors h-full sm:min-h-[148px] cursor-pointer">
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
                      <ul className="hidden sm:block space-y-1.5 text-[11px] sm:text-xs text-white/85 pl-0.5">
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
                    <div className="bg-[#2170e4]/35 border border-white/25 hover:bg-[#2170e4]/45 text-white flex flex-col gap-3 px-4 py-5 sm:py-6 rounded-xl transition-colors h-full sm:min-h-[148px] cursor-pointer">
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
                      <ul className="hidden sm:block space-y-1.5 text-[11px] sm:text-xs text-white/85 pl-0.5">
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
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {adBanners.length > 0 && (
          <MobileBanner banners={adBanners} className="md:hidden" />
        )}

        {/* Featured Jobs */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#f1f3ff] overflow-x-hidden w-full">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
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

            {initialLoading ? (
              <JobsSkeleton />
            ) : (
              <motion.div
                variants={sectionStagger}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid gap-5 w-full min-w-0"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}
              >
                {jobs.slice(0, 6).map((job, index) => (
                  <motion.div key={job._id} variants={fadeUp} className="min-w-0 h-full">
                    <FeaturedJobCard job={job} index={index} compact />
                  </motion.div>
                ))}
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
            variants={fadeUp}
          >
            <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
          </motion.div>
        )}

        {/* For Job Seekers */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden w-full">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-w-0">
            <motion.div
              className="relative order-1 lg:order-none min-w-0"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeLeft}
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#003f87]/5 rounded-full blur-3xl pointer-events-none hidden sm:block" />
              <img
                src={REPAIR_IMG_SRC}
                alt="Job seeker using laptop"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[1.73]"
                loading="lazy"
                decoding="async"
              />
              <motion.div
                className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 bg-white p-4 sm:p-6 rounded-xl shadow-xl z-20 border border-[#E2E8F0] max-w-[calc(100%-2rem)] sm:max-w-xs"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeScale}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[#0058be] bg-[#0058be]/10 p-2 rounded-lg flex items-center">
                    <Verified fontSize="small" />
                  </span>
                  <p className="font-semibold text-[#141b2b] text-sm">Verified Expert</p>
                </div>
                <p className="text-sm text-[#424752] italic">
                  &quot;Found a chip-level repair role in Ernakulam within two weeks — right here on TechPath.&quot;
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              className="order-2 lg:order-none"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeRight}
            >
              <span className="text-[#003f87] text-xs font-bold tracking-widest uppercase mb-4 block">For Talent</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#141b2b] mb-6">For Job Seekers</h2>
              <p className="text-lg text-[#424752] mb-10">
                Discover mobile repair careers across Kerala — browse listings,
                build your technician profile, and apply to verified shops and service centers.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  "Browse chip-level, Android, and iPhone repair jobs",
                  "Create a profile with resume, education, and experience",
                  "Filter by Kerala district, skill, and experience level",
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
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden w-full">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-w-0">
            <motion.div
              className="order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeLeft}
            >
              <span className="text-[#0058be] text-xs font-bold tracking-widest uppercase mb-4 block">For Growth</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#141b2b] mb-6">For Employers</h2>
              <p className="text-lg text-[#424752] mb-10">
                Hire qualified mobile technicians with job posts, shop profiles,
                and application tools built for Kerala&apos;s repair industry.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  "Post jobs and manage applications in one place",
                  "Showcase your repair shop with location and contact details",
                  "Schedule go-live dates and reach interested technicians",
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
              className="relative order-1 lg:order-2 min-w-0"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeRight}
            >
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none hidden sm:block" />
              <img
                src={EMPLOYER_IMG_SRC}
                alt="Employer posting a job"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[1.5]"
                loading="lazy"
                decoding="async"
              />
              <motion.div
                className="absolute top-4 left-4 sm:-top-6 sm:-left-6 bg-[#e1e8fd] p-4 sm:p-6 rounded-xl shadow-xl z-20 border border-[#E2E8F0] flex items-center gap-3 sm:gap-4 max-w-[calc(100%-2rem)]"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeScale}
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
        <section
          id="why-choose-techpath"
          aria-labelledby="why-choose-techpath-heading"
          className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#141b2b] text-white overflow-x-hidden w-full"
        >
          <motion.div
            className="max-w-[1280px] mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <h2 id="why-choose-techpath-heading" className="text-2xl sm:text-3xl font-semibold mb-4">
              Why Choose TechPath 
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Kerala&apos;s dedicated job platform for mobile technicians, repair shops, and service
              centers — connecting chip-level, Android, and iPhone experts with verified employers.
            </p>
          </motion.div>
          <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Groups className="!text-3xl" />,
                color: "bg-[#003f87]",
                title: "Verified mobile technicians & repair-focused listings",
                description:
                  "TechPath brings together chip-level, Android, iPhone, and service center professionals across Kerala districts. Every profile and job post targets mobile repair roles — so technicians and employers connect on relevant opportunities, not generic job boards.",
              },
              {
                icon: <Psychology className="!text-3xl" />,
                color: "bg-[#0058be]",
                title: "Skill-based search by repair specialty",
                description:
                  "Find roles by repair specialty — chip-level, Android and iPhone servicing, software, sales, or service center management. Filter by Kerala location, experience level, and job type to connect with the right opportunities faster.",
              },
              {
                icon: <LocationOn className="!text-3xl" />,
                color: "bg-[#722b00]",
                title: "Built for Kerala's mobile repair industry",
                description:
                  "From Ernakulam and Thrissur to Kozhikode and beyond, TechPath helps repair shops, service centers, and training institutes post mobile repair jobs and hire qualified technicians. Register as a job seeker or employer and grow with Kerala's repair community.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
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
        variants={fadeUp}
        className="bg-[#dce2f7] w-full overflow-x-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-start py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto gap-12 min-w-0">
          <div className="max-w-xs min-w-0">
            <TechpathBrand {...BRAND_SIZES.page} className="mb-6" />
            <p className="text-[#424752] text-sm leading-relaxed">
              Connecting talented professionals with opportunities that match their skills and ambitions.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href={TECHPATH_SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechPath on Facebook"
                className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]"
              >
                <Facebook fontSize="small" />
              </a>
              <a
                href={TECHPATH_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechPath on Instagram"
                className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]"
              >
                <Instagram fontSize="small" />
              </a>
              <a
                href={TECHPATH_SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechPath on LinkedIn"
                className="w-10 h-10 rounded-full bg-[#c2c6d4] flex items-center justify-center hover:bg-[#003f87] hover:text-white transition-all text-[#424752]"
              >
                <LinkedIn fontSize="small" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 flex-1 min-w-0 w-full">
            <div>
              <h4 className="font-semibold text-[#141b2b] mb-6">For Job Seekers</h4>
              <ul className="space-y-4">
                <li><Link to="/all-jobs" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Browse Jobs</Link></li>
                <li><Link to="/register" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Register as Technician</Link></li>
                <li><Link to="/login" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Sign In</Link></li>
                <li><Link to="/all-jobs?location=Ernakulam" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Jobs in Kochi / Ernakulam</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#141b2b] mb-6">For Employers</h4>
              <ul className="space-y-4">
                <li><Link to="/employer/register" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Post a Job</Link></li>
                <li><Link to="/employer/employer-login" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Employer Sign In</Link></li>
                <li><Link to="/all-jobs" className="text-sm text-[#424752] hover:text-[#0058be] transition-colors">Browse Job Listings</Link></li>
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
            <a href="/terms" className="text-[#424752] hover:text-[#003f87] transition-colors">Terms &amp; Conditions</a>
            <a href="/privacy" className="text-[#424752] hover:text-[#003f87] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#424752] hover:text-[#003f87] transition-colors">Cookie Settings</a>
            <a href="#" className="text-[#424752] hover:text-[#003f87] transition-colors">Accessibility</a>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
