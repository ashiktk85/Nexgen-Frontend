import React, { useState } from "react";
import GrapeAnimation from "../../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const keralaDistricts = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad"
  ];

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
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      district: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .required(" name is required"),

      phone: Yup.string()
        .min(10, "Phone number must be at least 10 characters")
        .matches(/^\+?[1-9]\d{1,14}$/, "Phone number is not valid")
        .required("Phone number is required"),

      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
        
      district: Yup.string()
        .required("District is required")
    }),
    onSubmit: async (values) => {
      try {
        const paylaod = {
          name: values.name,
          location: values.district,
          email: values.email,
          password: values.password,
          phone: values.phone,
        }
        console.log(values);
        const {data} = await employerAxiosInstance.post('/signup' ,paylaod)
        console.log(data);
        if(data) {
          localStorage.setItem("employer-email" , values?.email)
          navigate('/employer/otp')
        }
        
        
      } catch (err) {
        toast.error(err.message || "An error occurred");
      }
    },
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <div className="hidden sm:hidden lg:flex lg:w-1/2 w-full bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10 ">
        <div className="max-w-md ">
          <GrapeAnimation className="sm:hidden" />

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Connecting Talent with Opportunity—Post Jobs, Build Futures.
          </h2>

          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Empowering Careers, One Opportunity at a Time.
          </p>
        </div>
      </div>
      {/* Footer for Small Screens */}
      <div className="block sm:block lg:hidden bg-primary text-white text-center p-4">
        Connecting Talent with Opportunity—Post Jobs, Build Futures.
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10 ">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-3 text-center lg:text-left">
            Nexgen
          </h1>

          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
            Register as an Employer
          </h2>
          <p className="text-gray-500 mb-2 text-center lg:text-left">
            Join Us Today! Create Your Account to Get Started:
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="md:flex gap-5  ">
              <div className="mb-3 md:w-full ">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company/Employer Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your company name"
                  aria-required="true"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                District
              </label>
              <select
                id="district"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="district"
              >
                <option value="">Select a district</option>
                {keralaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district ? (
                <div className="text-red-500 text-[13px]">
                  {formik.errors.district}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="phone-number"
                id="phone"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your phone number"
                aria-required="true"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="phone"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-[13px]">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your email"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-[13px]">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your password"
                  aria-required="true"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.password}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <PiEyeBold onClick={showPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showPasswordFunction} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Re-enter your password"
                  aria-required="true"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <PiEyeBold onClick={showConfirmPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showConfirmPasswordFunction} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 mt-2"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/employer/employer-login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;