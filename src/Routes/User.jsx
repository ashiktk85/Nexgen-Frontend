import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./../pages/Login";
import ForgotPassword from "./../pages/ForgotPassword";
import RegisterOtp from "./../pages/RegisterOtp";
import Register from "../pages/Register";
import AuthCallback from "../pages/AuthCallback";
import Profile from "../pages/User/Outlets/Profile";
import JobApplication from "../pages/User/Outlets/JobApplication";
import Home from "../pages/User/Outlets/Home";
import ApplicationSubmitted from "../pages/User/Outlets/ApplicationSubmitted";
import NotFound from "@/pages/User/NotFound";
// import Home2 from "../pages/Home2";
import AllJobsPage from "../pages/User/Outlets/AllJobs";
import JobDetailPage from "../pages/User/Outlets/JobDetails";
import ShopDetails from "../pages/User/Outlets/ShopDetails";
import HomeLayout from "@/pages/User/Layout/HomeLayout";
import JobApplicationHistory from "@/pages/User/Outlets/JobApplicationHistory";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { UserProtectedRoute } from "@/services/userProtector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function User() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home3 />} /> */}
      {/* <Route path="/home" element={<Home3 />} /> */}
      {/* <Route path="/home3" element={<Home3 />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs" element={<AllJobsPage />} />
        <Route path="/job-details/:id" element={<JobDetailPage />} />
        <Route path="/shop-details/:id" element={<ShopDetails />} />
        <Route path="/job-application/:id" element={<UserProtectedRoute><JobApplication /></UserProtectedRoute>} />
        <Route path="/application-submitted" element={<UserProtectedRoute><ApplicationSubmitted /></UserProtectedRoute>} />
        <Route path="/job-application-history" element={<UserProtectedRoute><JobApplicationHistory /></UserProtectedRoute>} />

        <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}


export default User;
