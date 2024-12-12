import React, {useState} from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate, useLocation, Link } from 'react-router-dom';


const LoginPage = () => {
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

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Right Section */}
      
      {/* Left Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-700 mb-8 text-center lg:text-left">
            Nexgen
          </h1>

          {/* Welcome Text */}
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
            Log in to your Account
          </h2>
          <p className="text-gray-500 mb-6 text-center lg:text-left">
            Welcome back! Select a method to log in:
          </p>

          {/* Social Login Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <button
              className=" font-poppins py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-gray-700 w-full font-semibold"
              aria-label="Log in with Google"
            >
              <img
                src="https://img.icons8.com/color/24/google-logo.png"
                alt="Google"
                loading="lazy"
              />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <span className="absolute bg-white px-4 -top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              or continue with email
            </span>
            <hr className="border-gray-300" />
          </div>

          {/* Email and Password Form */}
          <form>
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                required
                aria-required="true"
              />
            </div>
            <div className="mb-4">
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
                  required
                  aria-required="true"
                />
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

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
                aria-label="Forgot Password"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Log in
            </button>
          </form>

          {/* Create Account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-[#0950a0] flex flex-col justify-center items-center text-center text-white p-6 lg:p-10">
  <div className="max-w-md">
   
    {/* <img
      src="https://undraw.co/api/illustrations/random?color=ffffff&theme=teamwork"
      alt="Mobile Technician Illustration"
      className="mb-6 max-h-64 w-full object-contain"
      loading="lazy"
    /> */}
          <GrapeAnimation className="sm:hidden" />

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Find Jobs Tailored for Mobile Technicians
          </h2>

          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Discover the best opportunities and connect with employers who value
            your skills.
          </p>

          {/* <div className="flex justify-center gap-2">
      <span className="h-2 w-2 bg-white rounded-full"></span>
      <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
      <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
    </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;