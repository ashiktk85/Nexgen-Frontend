import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from './../pages/Login' 
import ForgotPassword from './../pages/ForgotPassword'
import RegisterOtp from './../pages/RegisterOtp'
import SignupPage from './../pages/SignUp'
import Profile from "../pages/Profile";
import JobApplication from "../pages/JobApplication";
import Home from "../pages/Home";
import ApplicationSubmitted from "../pages/ApplicationSubmitted";
import Home2 from "../pages/Home2";
import AllJobsPage from "../pages/AllJobs";
import JobDetailPage from "../pages/JobDetails";


function User() {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/home" element={<Home2 />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/job-application" element={<JobApplication />} />
      <Route path="/application-submitted" element={<ApplicationSubmitted />} />
      <Route path="/all-jobs" element={<AllJobsPage />} />
      <Route path="/job-details" element={<JobDetailPage />} />
    </Routes>
  );
}

export default User;

