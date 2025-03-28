import { Routes, Route } from "react-router-dom";
import HomeLayout from "../pages/Employer/Layouts/HomeLayout";
import EmployerLogin from "../pages/Employer/EmployerLogin";
import Register from "../pages/Employer/Regitser";
import Profile from "../pages/Employer/Profile";
import Dashboard from "../pages/Employer/Outlets/Dashboard";
import CreateJob from "../pages/Employer/Outlets/CreateJob";
import JobList from "../pages/Employer/Outlets/JobList";
import Applicants from "../pages/Employer/Outlets/Applicants";
import CompanyDetails from "../pages/Employer/Outlets/CompanyDetails";
import RegisterOtp from "@/pages/Employer/OtpVerification";
import VerificationForm from "@/pages/Employer/Outlets/VerificationForm";
import NotFound from "@/pages/Employer/NotFound";
import AddorEditCompany from "@/pages/Employer/Outlets/AddorEditCompany";

function Employer() {
  return (
    <Routes>
      <Route path="/employer-login" element={<EmployerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/otp" element={<RegisterOtp />} />
      <Route path="Verification" element={<VerificationForm />} />
      <Route path="/" element={<HomeLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create_job" element={<CreateJob />} />
        <Route path="job_list" element={<JobList />} />
        <Route path="applicants/:jobId" element={<Applicants />} />
        <Route path="company_details" element={<CompanyDetails />} />
        <Route path="addCompany" element={<AddorEditCompany />} />
        <Route path="addCompany/:companyId" element={<AddorEditCompany />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default Employer;
