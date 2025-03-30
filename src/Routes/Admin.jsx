import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/Admin/Dashboard";
import Users from "../components/Admin/Users";
import Employers from "../components/Admin/Employers";
import Jobs from "../components/Admin/Jobs";
import HomeLayout from "@/pages/Admin/Layout/HomeLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminRegister from "@/pages/Admin/AdminRegister";
import OtpVerification from "@/pages/Admin/OtpVerification";
import EmployerVerification from "@/components/Admin/EmployerVerification";
import { AdminProtectedRoute } from "@/services/adminProtecter";

function Admin() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/" element={<AdminProtectedRoute><HomeLayout /></AdminProtectedRoute>}>
        <Route path="/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
        <Route path="/users" element={<AdminProtectedRoute><Users /></AdminProtectedRoute>} />
        <Route path="/employers" element={<AdminProtectedRoute><Employers /></AdminProtectedRoute>} />
        <Route path="/jobs" element={<AdminProtectedRoute><Jobs /></AdminProtectedRoute>} />
        <Route path="/employer-verification" element={<AdminProtectedRoute><EmployerVerification /></AdminProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default Admin;
