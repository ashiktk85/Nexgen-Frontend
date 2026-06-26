import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RouteFallback from "@/components/RouteFallback";
import { EmployerProtectedRoute } from "@/services/employerProtector";

const HomeLayout = lazy(() => import("../pages/Employer/Layouts/HomeLayout"));
const EmployerLogin = lazy(() => import("../pages/Employer/EmployerLogin"));
const Register = lazy(() => import("../pages/Employer/Regitser"));
const Profile = lazy(() => import("../pages/Employer/Profile"));
const Dashboard = lazy(() => import("../pages/Employer/Outlets/Dashboard"));
const CreateJob = lazy(() => import("../pages/Employer/Outlets/CreateJob"));
const JobList = lazy(() => import("../pages/Employer/Outlets/JobList"));
const Applicants = lazy(() => import("../pages/Employer/Outlets/Applicants"));
const CompanyDetails = lazy(() => import("../pages/Employer/Outlets/CompanyDetails"));
const RegisterOtp = lazy(() => import("@/pages/Employer/OtpVerification"));
const NotFound = lazy(() => import("@/pages/Employer/NotFound"));
const AddorEditCompany = lazy(() => import("@/pages/Employer/Outlets/AddorEditCompany"));
const UpdateJob = lazy(() => import("@/pages/Employer/Outlets/UpdateJob"));
const Settings = lazy(() => import("@/pages/Employer/Outlets/Settings"));

function Employer() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/otp" element={<RegisterOtp />} />
        <Route path="/" element={<EmployerProtectedRoute><HomeLayout /></EmployerProtectedRoute>}>
          <Route path="dashboard" element={<EmployerProtectedRoute><Dashboard /></EmployerProtectedRoute>} />
          <Route path="create_job" element={<EmployerProtectedRoute><CreateJob /></EmployerProtectedRoute>} />
          <Route path="job/edit" element={<UpdateJob />} />
          <Route path="job_list" element={<EmployerProtectedRoute><JobList /></EmployerProtectedRoute>} />
          <Route path="applicants/:jobId" element={<EmployerProtectedRoute><Applicants /></EmployerProtectedRoute>} />
          <Route path="company_details" element={<EmployerProtectedRoute><CompanyDetails /></EmployerProtectedRoute>} />
          <Route path="addCompany" element={<EmployerProtectedRoute><AddorEditCompany /></EmployerProtectedRoute>} />
          <Route path="addCompany/:companyId" element={<EmployerProtectedRoute><AddorEditCompany /></EmployerProtectedRoute>} />
          <Route path="account" element={<EmployerProtectedRoute><Settings /></EmployerProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default Employer;
