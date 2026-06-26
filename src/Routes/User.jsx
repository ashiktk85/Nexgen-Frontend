import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RouteFallback from "@/components/RouteFallback";
import { UserProtectedRoute } from "@/services/userProtector";

const LoginPage = lazy(() => import("./../pages/Login"));
const ForgotPassword = lazy(() => import("./../pages/ForgotPassword"));
const RegisterOtp = lazy(() => import("./../pages/RegisterOtp"));
const Register = lazy(() => import("../pages/Register"));
const AuthCallback = lazy(() => import("../pages/AuthCallback"));
const Profile = lazy(() => import("../pages/User/Outlets/Profile"));
const JobApplication = lazy(() => import("../pages/User/Outlets/JobApplication"));
const Home = lazy(() => import("../pages/User/Outlets/Home"));
const ApplicationSubmitted = lazy(() => import("../pages/User/Outlets/ApplicationSubmitted"));
const NotFound = lazy(() => import("@/pages/User/NotFound"));
const AllJobsPage = lazy(() => import("../pages/User/Outlets/AllJobs"));
const JobDetailPage = lazy(() => import("../pages/User/Outlets/JobDetails"));
const ShopDetails = lazy(() => import("../pages/User/Outlets/ShopDetails"));
const HomeLayout = lazy(() => import("@/pages/User/Layout/HomeLayout"));
const JobApplicationHistory = lazy(() => import("@/pages/User/Outlets/JobApplicationHistory"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));

function User() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/otp-verification" element={<RegisterOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/all-jobs" element={<AllJobsPage />} />
          <Route path="/job-details/:id" element={<JobDetailPage />} />
          <Route path="/shop-details/:id" element={<ShopDetails />} />
          <Route path="/job-application/:id" element={<UserProtectedRoute><JobApplication /></UserProtectedRoute>} />
          <Route path="/application-submitted" element={<UserProtectedRoute><ApplicationSubmitted /></UserProtectedRoute>} />
          <Route path="/job-application-history" element={<UserProtectedRoute><JobApplicationHistory /></UserProtectedRoute>} />
          <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default User;
