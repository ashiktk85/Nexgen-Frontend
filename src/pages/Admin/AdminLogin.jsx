import React, { useState } from "react";
import GrapeAnimation from "../../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { adminLoginAction } from "@/redux/actions/AdminAction";
import { motion, AnimatePresence } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

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

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const loginResult = await dispatch(adminLoginAction(values)).unwrap();
        if (loginResult.success) {
          toast.success("Login successful");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          toast.error("Login failed");
        }
      } catch (err) {
        toast.error(err?.message || "An error occurred");
      }
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <motion.div
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="w-full max-w-md" variants={containerVariants}>
          {/* Logo */}
          <motion.h1
            className="text-2xl font-bold text-primary mb-8 text-center lg:text-left"
            variants={itemVariants}
          >
            Techpath
          </motion.h1>

          {/* Welcome Text */}
          <motion.h2
            className="text-3xl font-semibold mb-4 text-center lg:text-left"
            variants={itemVariants}
          >
            Admin Login
          </motion.h2>
          <motion.p
            className="text-gray-500 mb-6 text-center lg:text-left"
            variants={itemVariants}
          >
            Log in to access your dashboard and connect with top candidates.
            Let's build your dream team!
          </motion.p>

          {/* Email and Password Form */}
          <form onSubmit={formik.handleSubmit}>
            <motion.div className="mb-4" variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              <AnimatePresence>
                {formik.touched.email && formik.errors.email && (
                  <motion.div
                    className="text-red-500 text-sm"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div className="mb-4" variants={itemVariants}>
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
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <AnimatePresence>
                {formik.touched.password && formik.errors.password && (
                  <motion.div
                    className="text-red-500 text-sm"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me */}
            <motion.div
              className="flex items-center justify-between mb-4"
              variants={itemVariants}
            >
              {/* <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label> */}
              <motion.p
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                aria-label="Forgot Password"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Forgot Password?
              </motion.p>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Log in
            </motion.button>
          </form>

          {/* Create Account */}
          <motion.p
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            <a
              onClick={() => navigate("/admin/admin-register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create new Admin Account
            </a>
          </motion.p>
          <motion.p
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            Login as User?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              User Login
            </a>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="lg:w-1/2 w-full bg-primary flex flex-col justify-center items-center text-center text-white p-6 lg:p-10"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-md" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <GrapeAnimation className="sm:hidden" />
          </motion.div>
          <motion.h2
            className="text-2xl lg:text-3xl font-semibold mb-4"
            variants={itemVariants}
          >
            Connecting Talent with Opportunity—Post Jobs, Build Futures.
          </motion.h2>
          <motion.p
            className="text-base lg:text-lg text-gray-200 mb-4"
            variants={itemVariants}
          >
            Empowering Careers, One Opportunity at a Time.
          </motion.p>
          {/* <div className="flex justify-center gap-2">
            <span className="h-2 w-2 bg-white rounded-full"></span>
            <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
            <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;