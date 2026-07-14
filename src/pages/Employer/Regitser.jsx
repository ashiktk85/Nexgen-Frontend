import React, { useState, useMemo, useEffect } from "react";
import GrapeAnimation from "../../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";
import { AUTH_PANEL_EMPLOYER } from "@/constants/authPanelCopy";
import { Autocomplete, TextField } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { getCountryName, getStateName } from "@/utils/formatLocation";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const countries = useMemo(() => Country.getAllCountries(), []);

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
      country: "",
      state: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .required("Name is required"),
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
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State / Province is required"),
      city: Yup.string().trim().required("City is required"),
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
          name: values.name,
          location,
          email: values.email,
          password: values.password,
          phone: values.phone,
        };
        const { data } = await employerAxiosInstance.post("/signup", payload);
        if (data) {
          localStorage.setItem("employer-email", values?.email);
          navigate("/employer/otp");
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

  const inputClass =
    "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const FieldError = ({ name }) => (
    <AnimatePresence>
      {formik.touched[name] && formik.errors[name] && (
        <motion.div
          className="text-red-500 text-[13px]"
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
      className="flex flex-col lg:flex-row h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Post Mobile Repair Jobs | Register as Employer on TechPath</title>
        <meta
          name="description"
          content="Register as an employer on TechPath. Post mobile repair job vacancies, find qualified technicians, and hire chip-level, Android, iPhone experts worldwide. Quick & easy setup."
        />
      </Helmet>
      {/* Left Section */}
      <motion.div
        className="hidden sm:hidden lg:flex lg:w-1/2 w-full bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md">
          <motion.div variants={itemVariants}>
            <GrapeAnimation className="sm:hidden" />
          </motion.div>
          <motion.h2
            className="text-2xl lg:text-3xl font-semibold mb-4"
            variants={itemVariants}
          >
            {AUTH_PANEL_EMPLOYER.title}
          </motion.h2>
          <motion.p
            className="text-base lg:text-lg text-gray-200 mb-4"
            variants={itemVariants}
          >
            {AUTH_PANEL_EMPLOYER.subtitle}
          </motion.p>
        </div>
      </motion.div>
      {/* Footer for Small Screens */}
      <motion.div
        className="block sm:block lg:hidden bg-primary text-white text-center p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {AUTH_PANEL_EMPLOYER.title}
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-3 mx-auto lg:mx-0">
          <TechpathBrand {...BRAND_SIZES.page} />
        </motion.div>
        <div className="w-full max-w-md px-2">
          <motion.h2
            className="text-2xl sm:text-3xl font-semibold mb-4 text-center lg:text-left"
            variants={itemVariants}
          >
            Post Mobile Repair Jobs Worldwide | Hire Top Technicians
          </motion.h2>
          <motion.p
            className="text-gray-500 mb-2 text-center lg:text-left"
            variants={itemVariants}
          >
            Join Us Today! Create Your Account to Get Started:
          </motion.p>

          <form onSubmit={formik.handleSubmit}>
            <motion.div className="md:flex gap-5" variants={itemVariants}>
              <div className="mb-3 md:w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company/Employer Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={inputClass}
                  placeholder="Enter your company name"
                  aria-required="true"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                />
                <FieldError name="name" />
              </div>
            </motion.div>

            {/* Worldwide location */}
            <motion.div className="mb-3 space-y-3" variants={itemVariants}>
              <p className="block text-sm font-medium text-gray-700">Location</p>

              <div>
                <label htmlFor="country" className="block text-xs text-gray-500 mb-1">
                  Country
                </label>
                <Autocomplete
                  id="country"
                  options={countries}
                  getOptionLabel={(o) => o.name}
                  value={selectedCountry}
                  onChange={(_, v) => {
                    formik.setFieldValue("country", v ? v.isoCode : "");
                    formik.setFieldValue("state", "");
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={() => formik.setFieldTouched("country", true)}
                  disablePortal
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select country"
                      error={formik.touched.country && Boolean(formik.errors.country)}
                    />
                  )}
                />
                <FieldError name="country" />
              </div>

              <div>
                <label htmlFor="state" className="block text-xs text-gray-500 mb-1">
                  State / Province
                </label>
                <Autocomplete
                  id="state"
                  options={states}
                  getOptionLabel={(o) => o.name}
                  value={selectedState}
                  disabled={!formik.values.country}
                  onChange={(_, v) => {
                    formik.setFieldValue("state", v ? v.isoCode : "");
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={() => formik.setFieldTouched("state", true)}
                  disablePortal
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={formik.values.country ? "Select state" : "Select country first"}
                      error={formik.touched.state && Boolean(formik.errors.state)}
                    />
                  )}
                />
                <FieldError name="state" />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs text-gray-500 mb-1">
                  City
                </label>
                <Autocomplete
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
                  disablePortal
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={formik.values.state ? "Search or type a city" : "Select state first"}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                    />
                  )}
                />
                <FieldError name="city" />
              </div>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className={inputClass}
                placeholder="Enter your phone number"
                aria-required="true"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="phone"
              />
              <FieldError name="phone" />
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={inputClass}
                placeholder="Enter your email"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              <FieldError name="email" />
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
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
                  className={inputClass}
                  placeholder="Enter your password"
                  aria-required="true"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {showPassword ? (
                    <PiEyeBold onClick={showPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showPasswordFunction} />
                  )}
                </motion.button>
              </div>
              <FieldError name="password" />
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
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
                  className={inputClass}
                  placeholder="Re-enter your password"
                  aria-required="true"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {showConfirmPassword ? (
                    <PiEyeBold onClick={showConfirmPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showConfirmPasswordFunction} />
                  )}
                </motion.button>
              </div>
              <FieldError name="confirmPassword" />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 mt-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign Up
            </motion.button>
          </form>

          <motion.p
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <motion.span
              onClick={() => navigate("/employer/employer-login")}
              className="text-blue-600 hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log in
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
