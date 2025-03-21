import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./../pages/Login";
import ForgotPassword from "./../pages/ForgotPassword";
import RegisterOtp from "./../pages/RegisterOtp";
import SignupPage from "./../pages/SignUp";
import Profile from "../pages/User/Outlets/Profile";
import JobApplication from "../pages/User/Outlets/JobApplication";
import Home from "../pages/User/Outlets/Home";
import ApplicationSubmitted from "../pages/User/Outlets/ApplicationSubmitted";
// import Home2 from "../pages/Home2";
import AllJobsPage from "../pages/User/Outlets/AllJobs";
import JobDetailPage from "../pages/User/Outlets/JobDetails";
// import Home3 from "@/pages/Home3";
import HomeLayout from "@/pages/User/Layout/HomeLayout";
import JobApplicationHistory from "@/pages/User/Outlets/JobApplicationHistory";
import NotFound from "@/pages/Employer/NotFound";

function User() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home3 />} /> */}
      {/* <Route path="/home" element={<Home3 />} /> */}
      {/* <Route path="/home3" element={<Home3 />} /> */}
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs" element={<AllJobsPage />} />
        <Route path="/job-details/:id" element={<JobDetailPage />} />
        <Route path="/job-application/:id" element={<JobApplication />} />
        <Route path="/application-submitted" element={<ApplicationSubmitted />}/>
        <Route path="/job-application-history" element={<JobApplicationHistory />}/>

        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
}

export default User;
