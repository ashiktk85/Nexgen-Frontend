import React, { useState } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const ForgotPassword = () => {
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
        toast.success("Login successful");
        // const loginResult = await dispatch(login(values)).unwrap();
        // if (loginResult) {
        //   if (userInfo?.isBlocked) {
        //     toast.error(
        //       "Currently, you are restricted from accessing the site."
        //     );
        //     return;
        //   }
        //   toast.success("Login successful");
        //   setTimeout(() => {
        //     navigate("/");
        //   }, 1500);
        // }
      } catch (err) {
        toast.error(err.message || "An error occurred");
      }
    },
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-primary flex flex-col justify-center items-center text-center text-white p-6 lg:p-10">
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
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left">
            Nexgen
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
