import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/Admin/Dashboard";
import Users from "../components/Admin/Users";
import Employees from "../components/Admin/Employees";
import Jobs from "../components/Admin/Jobs";
import HomeLayout from "@/pages/Admin/Layout/HomeLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminRegister from "@/pages/Admin/AdminRegister";
import OtpVerification from "@/pages/Admin/OtpVerification";

function Admin() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/" element={<HomeLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/jobs" element={<Jobs />} />
      </Route>
    </Routes>
  );
}

export default Admin;
