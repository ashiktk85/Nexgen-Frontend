import React, { useRef, useState, useEffect } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";
import { AUTH_PANEL_OTP_JOB_SEEKER } from "@/constants/authPanelCopy";
import NextUiShell from "@/components/NextUiShell";
import { useAuth } from "@/hooks/useAuth";

const RegisterOtp = () => {
  const OTP_LENGTH = 4;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { applyAuth } = useAuth();

  const email = location.state?.email || localStorage.getItem("email");

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

    if (value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    const otpArray = pastedData.slice(0, OTP_LENGTH).split("");
    setOtp([...otpArray, ...new Array(OTP_LENGTH - otpArray.length).fill("")]);
    inputRefs.current[Math.min(otpArray.length, OTP_LENGTH - 1)].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      const storedEmail = localStorage.getItem("email") || email;
      const joinedOtp = otp.join("");
      const payload = {
        email: storedEmail,
        otp: joinedOtp,
      };

      const { data } = await userAxiosInstance.post("/verify-otp", payload);

      if (data.status) {
        localStorage.removeItem("email");
        if (data.token && data.user) {
          applyAuth(data.token, {
            ...data.user,
            ...(data.cred || {}),
            userId: data.user.userId || data.cred?.userId,
          });
        }
        toast.success("Registration successful");
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "OTP verification failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NextUiShell>
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            {AUTH_PANEL_OTP_JOB_SEEKER.title}
          </h2>
          <p className="text-base lg:text-lg text-gray-200 mb-4">
            {AUTH_PANEL_OTP_JOB_SEEKER.subtitle}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10 pt-20 lg:p-10 font-sans">
        <div className="w-full max-w-md">
          <TechpathBrand {...BRAND_SIZES.page} className="mb-8 mx-auto lg:mx-0" />
          <h2 className="text-3xl font-bold mb-4 text-center lg:text-left">
            Verify your email
          </h2>
          <p className="text-gray-500 mb-6 text-center lg:text-left">
            We've sent a code to <span className="font-semibold">{email}</span>{" "}
            . Please enter it below to verify your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 lg:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 lg:w-14 lg:h-14 text-center text-2xl font-semibold border ${
                    document.activeElement === inputRefs.current[index]
                      ? "border-blue-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
              ))}
            </div>
            <button
              className={`w-full bg-primary hover:bg-blue-700 text-white py-2 rounded-lg mt-6 transition-colors ${
                otp.some((digit) => digit === "") || submitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={otp.some((digit) => digit === "") || submitting}
              type="submit"
            >
              {submitting ? "Verifying…" : "Verify Email"}
            </button>
          </form>

          <div className="text-center mt-4 flex justify-center gap-3">
            <p className="text-gray-600">Didn't receive the code?</p>
            <button type="button" className="text-blue-600 hover:text-blue-700 text-sm hover:underline">
              Resend Code
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            Back to{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    </NextUiShell>
  );
};

export default RegisterOtp;
