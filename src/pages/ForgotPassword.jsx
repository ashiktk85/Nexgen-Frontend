import React, { useState } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        const endpoint = userType === "user" 
          ? "http://localhost:3001/api/user/forgot-password" 
          : "http://localhost:3001/api/employer/forgot-password";
          
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await response.json();
        
        if (data.status) {
           toast.success("OTP sent to your email");
           navigate("/forgot-password-otp", { state: { email: values.email, userType } });
        } else {
           toast.error(data.message || "Failed to send OTP");
        }
      } catch (err) {
        toast.error(err.message || "An error occurred");
      }
    },
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Right Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Find Jobs for Mobile Technicians
          </h2>

          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Discover the best opportunities and connect with employers who value
            your skills.
          </p>
        </div>
      </div>
      {/* Left Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-8 pt-20 lg:p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left">
          Techpath
          </h1>

          {/* Welcome Text */}
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
            Verify Your Email
          </h2>
          <p className="text-gray-500 mb-6 text-center lg:text-left">
            Enter your registered email
          </p>

          {/* Email and Password Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={userType === "user"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  Candidate
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="employer"
                    checked={userType === "employer"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  Employer
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2  border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your registered email"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              <div className="text-red-500 text-sm h-3">
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : null}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
          {/* Create Account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Back to{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
