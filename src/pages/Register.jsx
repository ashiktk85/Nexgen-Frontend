import React, { useEffect, useState } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import { motion } from "framer-motion";
import { GoogleButton } from "@/components/GoogleButton";
import { useAuth } from "@/hooks/useAuth";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { Helmet } from "react-helmet-async";
import { JOB_CATEGORIES, KERALA_DISTRICTS } from "@/constants/options";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loginWithGoogle, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user]);

  const showPasswordFunction = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setShowPassword(true);
    } else {
      x.type = "password";
      setShowPassword(false);
    }
  };

  const showConfirmPasswordFunction = () => {
    var x = document.getElementById("confirm-password");
    if (x.type === "password") {
      x.type = "text";
      setShowConfirmPassword(true);
    } else {
      x.type = "password";
      setShowConfirmPassword(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
      preferredLocation: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .required("First name is required"),
      lastName: Yup.string()
        .trim()
        .required("Last name is required"),
      phone: Yup.string()
        .trim()
        .min(10, "Phone number must be at least 10 digits")
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .required("Phone number is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          ...(values.preferredLocation && { location: values.preferredLocation }),
          ...(values.jobTitle && { fieldOfStudy: values.jobTitle }),
        };

        const { data } = await userAxiosInstance.post("/signup", payload);
        if (data) {
          localStorage.setItem("email", values.email);
          toast.success("Registration successful! Please verify your OTP.");
          navigate("/otp-verification");
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Registration failed"));
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
    >
      <Helmet>
        <title>Register as Mobile Technician | TechPath Job Platform</title>
        <meta
          name="description"
          content="Register as a mobile phone technician on TechPath. Create your profile, get matched with repair jobs in Kerala, and grow your career. Chip-level, Android, iPhone experts welcome."
        />
      </Helmet>
      {/* Left Section (Form) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Link to="/">
              <TechpathBrand {...BRAND_SIZES.page} className="mb-6 mx-auto lg:mx-0" />
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-semibold mb-2 text-center lg:text-left"
          >
            Register as Mobile Technician - Kerala&apos;s Top Job Platform
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            Join Techpath to discover mobile repair careers and connect with top employers in Kerala.
          </motion.p>

          {/* Social Login Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row gap-4 mb-6"
          >
            <div className="flex justify-center">
              <GoogleButton onClick={loginWithGoogle} label="Sign up with Google" />
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-4">
            <span className="absolute bg-white px-4 -top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              or sign up with email
            </span>
            <hr className="border-gray-200" />
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={formik.handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="John"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Doe"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
                )}
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <select
                name="jobTitle"
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
              >
                <option value="">Select your job title</option>
                {JOB_CATEGORIES.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Preferred Location</label>
              <select
                name="preferredLocation"
                value={formik.values.preferredLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
              >
                <option value="">Select preferred location</option>
                <optgroup label="Kerala Districts (Preferred)">
                  {KERALA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  <option value="All India (Remote)">All India (Remote)</option>
                  <option value="Other Location">Other Location</option>
                </optgroup>
              </select>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your phone number"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="you@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={showPasswordFunction}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                >
                  {showPassword ? <PiEyeBold /> : <PiEyeSlashBold />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={showConfirmPasswordFunction}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <PiEyeBold /> : <PiEyeSlashBold />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </motion.button>
          </motion.form>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Right Section (Animation) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10"
      >
        <div className="max-w-md">
          <GrapeAnimation />
          <motion.h2
            variants={itemVariants}
            className="text-2xl lg:text-3xl font-semibold mb-4"
          >
            Find Jobs for Mobile Technicians
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-gray-200 mb-4"
          >
            Discover the best opportunities and connect with employers who value
            your skills.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
