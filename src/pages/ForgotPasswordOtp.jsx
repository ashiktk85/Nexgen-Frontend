import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import GrapeAnimation from "@/components/GrapeAnimation";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";
import NextUiShell from "@/components/NextUiShell";
import { getApiErrorMessage } from "@/utils/apiError";
import { AUTH_PANEL_RESET_PASSWORD } from "@/constants/authPanelCopy";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";

const OTP_LENGTH = 4;

const ForgotPasswordOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userType = "user", token } = location.state || {};

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef([]);

  const client = userType === "employer" ? employerAxiosInstance : userAxiosInstance;
  const loginPath = userType === "employer" ? "/employer/employer-login" : "/login";

  useEffect(() => {
    if (!email || !token) {
      toast.error("Session expired. Please request a new OTP.");
      navigate("/forgot-password", { replace: true });
    }
  }, [email, token, navigate]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    setOtp((prev) => prev.map((digit, idx) => (idx === index ? value : digit)));

    if (value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    const otpArray = pastedData.slice(0, OTP_LENGTH).split("");
    setOtp([...otpArray, ...new Array(OTP_LENGTH - otpArray.length).fill("")]);
    inputRefs.current[Math.min(otpArray.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const joinedOtp = otp.join("");
    if (joinedOtp.length !== OTP_LENGTH) {
      toast.error("Please enter the full OTP");
      return;
    }

    setVerifying(true);
    try {
      await client.post("/forgot-password-otp", { token, otp: joinedOtp });
      setOtpVerified(true);
      toast.success("OTP verified. Set your new password.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "OTP verification failed"));
    } finally {
      setVerifying(false);
    }
  };

  const passwordForm = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
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
        const { data } = await client.post("/reset-password", {
          token,
          password: values.password,
        });

        if (data?.status) {
          toast.success("Password reset successful");
          navigate(loginPath);
        } else {
          toast.error(data?.message || "Failed to reset password");
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to reset password"));
      }
    },
  });

  if (!email || !token) {
    return null;
  }

  return (
    <NextUiShell>
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10">
          <div className="max-w-md">
            <GrapeAnimation className="sm:hidden" />
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
              {AUTH_PANEL_RESET_PASSWORD.title}
            </h2>
            <p className="text-base lg:text-lg text-gray-200 mb-4">
              {AUTH_PANEL_RESET_PASSWORD.subtitle}
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-8 pt-20 lg:p-10">
          <div className="w-full max-w-md">
            <TechpathBrand {...BRAND_SIZES.page} className="mb-8 mx-auto lg:mx-0" />

            {!otpVerified ? (
              <>
                <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
                  Enter OTP
                </h2>
                <p className="text-gray-500 mb-6 text-center lg:text-left">
                  We sent a code to <span className="font-semibold">{email}</span>
                </p>

                <form onSubmit={handleVerifyOtp}>
                  <div className="flex justify-center gap-2 lg:gap-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        value={digit}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className="w-12 h-12 lg:w-14 lg:h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={verifying || otp.some((digit) => digit === "")}
                    className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
                  New password
                </h2>
                <p className="text-gray-500 mb-6 text-center lg:text-left">
                  Choose a strong password for your account.
                </p>

                <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New password
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={passwordForm.values.password}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <PiEyeSlashBold /> : <PiEyeBold />}
                      </button>
                    </div>
                    {passwordForm.touched.password && passwordForm.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm password
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.values.confirmPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <PiEyeSlashBold /> : <PiEyeBold />}
                      </button>
                    </div>
                    {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordForm.errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={passwordForm.isSubmitting}
                    className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {passwordForm.isSubmitting ? "Saving..." : "Reset password"}
                  </button>
                </form>
              </>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">
              Back to{" "}
              <Link to={loginPath} className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </NextUiShell>
  );
};

export default ForgotPasswordOtp;
