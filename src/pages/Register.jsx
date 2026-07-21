import React, { useEffect, useMemo, useState } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleButton } from "@/components/GoogleButton";
import { useAuth } from "@/hooks/useAuth";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { Helmet } from "react-helmet-async";
import { JOB_CATEGORIES } from "@/constants/options";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";
import { AUTH_PANEL_JOB_SEEKER } from "@/constants/authPanelCopy";
import { Country, State, City } from "country-state-city";
import { getCountryName, getStateName } from "@/utils/formatLocation";
import SearchablePlaceSelect from "@/components/common/SearchablePlaceSelect";

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

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { loginWithGoogle, user } = useAuth();

  const countries = useMemo(() => Country.getAllCountries(), []);

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
      country: "",
      state: "",
      city: "",
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
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State / Province is required"),
      city: Yup.string().trim().required("City / District is required"),
    }),
    onSubmit: async (values) => {
      try {
        const location = [
          values.city,
          getStateName(values.country, values.state),
          getCountryName(values.country),
        ]
          .filter(Boolean)
          .join(", ");

        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          location,
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

  useEffect(() => {
    if (formik.values.country) {
      setStates(State.getStatesOfCountry(formik.values.country));
    } else {
      setStates([]);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      setCities(City.getCitiesOfState(formik.values.country, formik.values.state));
    } else {
      setCities([]);
    }
  }, [formik.values.country, formik.values.state]);

  const selectedCountry =
    countries.find((c) => c.isoCode === formik.values.country) || null;
  const selectedState =
    states.find((s) => s.isoCode === formik.values.state) || null;
  const selectedCity =
    cities.find((c) => c.name === formik.values.city) ||
    (formik.values.city ? formik.values.city : null);

  const FieldError = ({ name }) => (
    <AnimatePresence>
      {formik.touched[name] && formik.errors[name] && (
        <motion.div
          className="text-red-500 text-xs mt-1"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {formik.errors[name]}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row min-h-[100dvh] lg:h-screen lg:overflow-hidden"
    >
      <Helmet>
        <title>Register as Mobile Technician | TechPath Job Platform</title>
        <meta
          name="description"
          content="Register as a mobile phone technician on TechPath. Create your profile, get matched with repair jobs worldwide, and grow your career. Chip-level, Android, iPhone experts welcome."
        />
      </Helmet>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 w-full bg-white flex flex-col justify-start lg:justify-center items-center px-4 py-8 sm:p-6 lg:p-10 lg:overflow-y-auto"
      >
        <div className="w-full max-w-md pb-8 lg:pb-0">
          <motion.div variants={itemVariants}>
            <Link to="/">
              <TechpathBrand {...BRAND_SIZES.page} className="mb-6 mx-auto lg:mx-0" />
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-semibold mb-2 text-center lg:text-left"
          >
            Register as Mobile Technician
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            Join Techpath to discover mobile repair careers and connect with top employers worldwide.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row gap-4 mb-6"
          >
            <div className="flex justify-center">
              <GoogleButton onClick={loginWithGoogle} label="Sign up with Google" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative my-4">
            <span className="absolute bg-white px-4 -top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              or sign up with email
            </span>
            <hr className="border-gray-200" />
          </motion.div>

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
                <FieldError name="firstName" />
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
                <FieldError name="lastName" />
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

            <motion.div variants={itemVariants} className="mb-4 space-y-3">
              <p className="block text-sm font-medium text-gray-700">Preferred Location</p>

              <div>
                <label htmlFor="country" className="block text-xs text-gray-500 mb-1">
                  Country
                </label>
                <SearchablePlaceSelect
                  id="country"
                  options={countries}
                  value={selectedCountry}
                  onChange={(_, v) => {
                    formik.setFieldValue("country", v ? v.isoCode : "");
                    formik.setFieldValue("state", "");
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={() => formik.setFieldTouched("country", true)}
                  placeholder="Search country..."
                  error={formik.touched.country && Boolean(formik.errors.country)}
                />
                <FieldError name="country" />
              </div>

              <div>
                <label htmlFor="state" className="block text-xs text-gray-500 mb-1">
                  State / Province
                </label>
                <SearchablePlaceSelect
                  id="state"
                  options={states}
                  value={selectedState}
                  disabled={!formik.values.country}
                  onChange={(_, v) => {
                    formik.setFieldValue("state", v ? v.isoCode : "");
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={() => formik.setFieldTouched("state", true)}
                  placeholder={formik.values.country ? "Search state..." : "Select country first"}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                />
                <FieldError name="state" />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs text-gray-500 mb-1">
                  City / District
                </label>
                <SearchablePlaceSelect
                  id="city"
                  freeSolo
                  options={cities}
                  getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
                  value={selectedCity}
                  disabled={!formik.values.state}
                  onChange={(_, v) => {
                    const name = typeof v === "string" ? v.trim() : v?.name || "";
                    formik.setFieldValue("city", name);
                  }}
                  onInputChange={(_, value, reason) => {
                    if (reason === "input") formik.setFieldValue("city", value);
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  placeholder={formik.values.state ? "Search or type a city / district..." : "Select state first"}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                />
                <FieldError name="city" />
              </div>
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
              <FieldError name="phone" />
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
              <FieldError name="email" />
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
              <FieldError name="password" />
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
              <FieldError name="confirmPassword" />
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
            {AUTH_PANEL_JOB_SEEKER.title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-gray-200 mb-4"
          >
            {AUTH_PANEL_JOB_SEEKER.subtitle}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
