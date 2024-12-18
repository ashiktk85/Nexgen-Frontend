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

function User() {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/job-application" element={<JobApplication />} />
      <Route path="/application-submitted" element={<ApplicationSubmitted />} />
    </Routes>
  );
}

export default User;
