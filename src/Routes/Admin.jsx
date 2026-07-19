import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RouteFallback from "@/components/RouteFallback";
import { AdminProtectedRoute } from "@/services/adminProtecter";

const Dashboard = lazy(() => import("../components/Admin/Dashboard"));
const BannerManagement = lazy(() => import("../components/Admin/Banner"));
const Users = lazy(() => import("../components/Admin/Users"));
const Employers = lazy(() => import("../components/Admin/Employers"));
const Shops = lazy(() => import("../components/Admin/Shops"));
const Jobs = lazy(() => import("../components/Admin/Jobs"));
const AdminCreateJob = lazy(() => import("../pages/Admin/Outlets/AdminCreateJob"));
const JobTitles = lazy(() => import("../components/Admin/JobTitles"));
const HomeLayout = lazy(() => import("@/pages/Admin/Layout/HomeLayout"));
const AdminLogin = lazy(() => import("@/pages/Admin/AdminLogin"));
const OtpVerification = lazy(() => import("@/pages/Admin/OtpVerification"));
const Admins = lazy(() => import("@/components/Admin/Admins"));
const EmployerVerification = lazy(() => import("@/components/Admin/EmployerVerification"));
const AppliedStudents = lazy(() => import("@/components/Admin/AppliedStudents"));
const ReportsDownloads = lazy(() => import("@/components/Admin/Reports"));
const PlacementTracking = lazy(() => import("@/components/Admin/PlacementTracking"));

function Admin() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route
          path="/"
          element={
            <AdminProtectedRoute>
              <HomeLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/employers"
            element={
              <AdminProtectedRoute>
                <Employers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/shops"
            element={
              <AdminProtectedRoute>
                <Shops />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <AdminProtectedRoute>
                <Jobs />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <AdminProtectedRoute>
                <AdminCreateJob />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/job-titles"
            element={
              <AdminProtectedRoute>
                <JobTitles />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/applied-students"
            element={
              <AdminProtectedRoute>
                <AppliedStudents />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <AdminProtectedRoute>
                <ReportsDownloads />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/placement-tracking"
            element={
              <AdminProtectedRoute>
                <PlacementTracking />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/banner"
            element={
              <AdminProtectedRoute>
                <BannerManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/employer-verification"
            element={
              <AdminProtectedRoute>
                <EmployerVerification />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <AdminProtectedRoute>
                <Admins />
              </AdminProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default Admin;
