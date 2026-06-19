import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/Admin/Dashboard";
import BannerManagement from "../components/Admin/Banner";
import Users from "../components/Admin/Users";
import Employers from "../components/Admin/Employers";
import Shops from "../components/Admin/Shops";
import Jobs from "../components/Admin/Jobs";
import JobTitles from "../components/Admin/JobTitles";
import HomeLayout from "@/pages/Admin/Layout/HomeLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import OtpVerification from "@/pages/Admin/OtpVerification";
import Admins from "@/components/Admin/Admins";
import EmployerVerification from "@/components/Admin/EmployerVerification";
import { AdminProtectedRoute } from "@/services/adminProtecter";

function Admin() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <HomeLayout />
          </AdminProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/employers"
          element={
            <AdminProtectedRoute>
              <Employers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/shops"
          element={
            <AdminProtectedRoute>
              <Shops />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <AdminProtectedRoute>
              <Jobs />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/job-titles"
          element={
            <AdminProtectedRoute>
              <JobTitles />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/banner"
          element={
            <AdminProtectedRoute>
              <BannerManagement />
            </AdminProtectedRoute>
          }
        />
        {/* <Route path="/banner" element={<AdminProtectedRoute><Banner /></AdminProtectedRoute>} /> */}
        {/* <Route path="/employer-verification" element={<AdminProtectedRoute><EmployerVerification /></AdminProtectedRoute>} /> */}
        <Route
          path="/employer-verification"
          element={
            <AdminProtectedRoute>
              <EmployerVerification />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <AdminProtectedRoute>
              <Admins />
            </AdminProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default Admin;
