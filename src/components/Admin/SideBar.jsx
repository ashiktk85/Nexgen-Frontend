import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
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
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ShieldCheck,
  Image as ImageIcon,
  Store,
  Tags,
} from "lucide-react";
import { logout } from "@/redux/slices/adminSlice";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";
import TechpathBrand, { BRAND_SIZES } from "@/components/TechpathBrand";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const sidebarRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  const confirmLogout = () => setIsLogoutDialogOpen(true);

  const handleLogout = async () => {
    try {
      const response = await adminAxiosInstance.post("/logout");
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logged out");
        navigate("/admin/admin-login");
      }
    } catch (err) {
      console.error("error", err);
      toast.error("Failed to logout");
    }
  };

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

  const getSidebarWidth = () => {
    if (isSidebarOpen) return "w-[280px] opacity-100";
    return `w-0 opacity-0 lg:opacity-100 ${
      isCollapsed ? "lg:w-[80px]" : "lg:w-[250px]"
    }`;
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "users",
      label: "Users",
      url: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "employers",
      label: "Employers",
      url: "/admin/employers",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "shops",
      label: "Shops",
      url: "/admin/shops",
      icon: <Store className="w-4 h-4" />,
    },
    {
      id: "jobs",
      label: "Jobs",
      url: "/admin/jobs",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "job-titles",
      label: "Job Titles",
      url: "/admin/job-titles",
      icon: <Tags className="w-4 h-4" />,
    },
    {
      id: "verifications",
      label: "Verifications",
      url: "/admin/employer-verification",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "admins",
      label: "Admins",
      url: "/admin/admins",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "banner",
      label: "Banner",
      url: "/admin/banner",
      icon: <ImageIcon className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <div
        ref={sidebarRef}
        
        className={`text-white bg-zinc-900 shadow-lg h-screen fixed top-0 left-0 overflow-auto z-30 transition-all duration-300 flex flex-col ${getSidebarWidth()}`}
      >
        <div
          className={`flex items-center min-h-[64px] z-20 sticky top-0 border-b border-white/20 ${
            isCollapsed ? "justify-center px-2 py-3" : "justify-between px-4 py-4"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="rounded-md p-1 hover:bg-white/10 transition duration-200 focus:outline-none"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <TechpathBrand logoHeight={32} showText={false} showIcon />
            </button>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <TechpathBrand
                  {...BRAND_SIZES.compact}
                  textColor="#ffffff"
                  className="mb-0.5"
                />
                <p className="text-xs text-indigo-100/80 font-medium">Admin</p>
              </div>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="py-4 px-2 xl:px-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.url);
              return (
                <li
                  key={item.id}
                  title={isCollapsed ? item.label : ""}
                  className="group"
                >
                  <Link
                    to={item.url}
                    className={`flex items-center rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    } ${
                      isCollapsed
                        ? "justify-center px-1 py-3"
                        : "px-4 py-2.5 space-x-3"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-white/20 pb-6">
          {isCollapsed ? (
            <div className="hidden lg:flex flex-col items-center gap-3">
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-white p-1.5 hover:bg-white/10 rounded-md transition duration-200 focus:outline-none"
                title="Expand sidebar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={confirmLogout}
                className="text-red-300 hover:text-red-400 p-1.5"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full border-2 border-white/50 bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {adminInfo?.name
                  ? adminInfo.name.charAt(0).toUpperCase()
                  : "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {adminInfo?.name || "Admin"}
                </span>
                <button
                  onClick={confirmLogout}
                  className="text-xs text-red-300 hover:text-red-400 font-medium text-left mt-1"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
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

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
