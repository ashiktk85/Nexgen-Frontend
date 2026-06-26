import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { logout } from "@/redux/slices/employer";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EmployerNameAvatar from "./EmployerNameAvatar";

const NavbarEmp = ({ isCollapsed, setIsCollapsed }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const dispatch = useDispatch();
  const employerData = useSelector((state) => state.employer.employer);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const confirmLogout = () => setIsLogoutDialogOpen(true);

  const handleLogout = async () => {
    try {
      const response = await employerAxiosInstance.post("/logout");
      console.log("logout response", response);
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logout!!");
        navigate("/employer/employer-login");
      }
    } catch (err) {
      console.error("error", err);
      toast.error("Failed to logout");
    }
  };

  const toggleSubmenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Adjust sidebar width based on mobile + desktop collapse state
  const getSidebarWidth = () => {
    if (isSidebarOpen) return "w-[250px] opacity-100"; // mobile open state
    // desktop states
    return `w-0 opacity-0 lg:opacity-100 ${isCollapsed ? "lg:w-[80px]" : "lg:w-[250px]"
      }`;
  };

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)" }}
        className={`text-white shadow-lg h-screen fixed top-0 left-0 overflow-auto z-10 transition-all duration-300 flex flex-col ${getSidebarWidth()}`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-4 py-4 min-h-[64px] z-20 sticky top-0 border-b border-white/20">
          {isCollapsed ? (
            <TechpathBrand
              {...BRAND_SIZES.compact}
              showText={false}
              className="mx-auto"
            />
          ) : (
            <TechpathBrand {...BRAND_SIZES.compact} textColor="#ffffff" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block text-white p-1 hover:bg-white/10 rounded-md transition duration-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
        </div>

        <div className="py-4 px-2 xl:px-4 flex-1">
          <ul className="space-y-2">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                url: "/employer/dashboard",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z"></path>
                  </svg>
                )
              },
              {
                id: "jobs",
                label: "Job Listing",
                url: "/employer/job_list",
                matchUrls: ["/employer/job_list", "/employer/applicants"],
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                  </svg>
                )
              },
              {
                id: "create_job",
                label: "Create Job",
                url: "/employer/create_job",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z" />
                    <path d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z" />
                    <path d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" />
                  </svg>
                )
              },
              {
                id: "company_details",
                label: "Shop Details",
                url: "/employer/company_details",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 10V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v6h2V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2zM5 18h4v-8H5v8zm6 0h4v-8h-4v8zM15 6v12h4V6h-4z" />
                  </svg>
                )
              },
              {
                id: "add_company",
                label: "Add Shop",
                url: "/employer/addcompany",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                )
              },
              {
                id: "account",
                label: "Account",
                url: "/employer/account",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                  </svg>
                )
              },
            ].map((item) => {
              const isActive = item.matchUrls
                ? item.matchUrls.some((u) => location.pathname.includes(u))
                : location.pathname.includes(item.url);
              return (
                <li key={item.id} title={isCollapsed ? item.label : ""}>
                  <Link
                    to={item.url}
                    className={`flex items-center text-white rounded-md transition-all duration-300 ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                      } ${isCollapsed ? "justify-center px-1 py-3" : "px-3 py-2.5 space-x-3"
                      }`}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Profile Section at bottom */}
        <div className="p-4 border-t border-white/20 pb-6">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <EmployerNameAvatar
                name={employerData?.name}
                size="md"
                className="border-2 border-white/50"
              />
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {employerData?.name && employerData.name
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>
                <button
                  onClick={confirmLogout}
                  className="text-xs text-red-300 hover:text-red-400 font-medium text-left mt-1"
                >
                  Logout
                </button>
              </div>
            )}
            {/* Show just logout icon if collapsed */}
            {isCollapsed && (
              <button
                onClick={confirmLogout}
                className="hidden lg:flex w-full absolute bottom-2 left-0 right-0 justify-center p-2 text-red-300 hover:text-red-400"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed top-4 right-4 z-[60]">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="bg-white p-2 text-gray-800 rounded-lg shadow-md border hover:bg-gray-50 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your employer dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NavbarEmp;
