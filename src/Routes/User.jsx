import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from './../pages/Login' 
import ForgotPassword from './../pages/ForgotPassword'
import RegisterOtp from './../pages/RegisterOtp'
import SignupPage from './../pages/SignUp'

function User() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default User;
