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
  ClipboardList,
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
      await adminAxiosInstance.post("/logout");
    } catch (err) {
      console.error("error", err);
    } finally {
      dispatch(logout());
      toast.success("Logged out");
      navigate("/admin/admin-login");
    }
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSidebarOpen]);

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
    if (isSidebarOpen) return "w-[min(280px,88vw)] opacity-100 pointer-events-auto translate-x-0";
    return `w-0 opacity-0 -translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0 lg:opacity-100 ${
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
      id: "applied-students",
      label: "Applied Students",
      url: "/admin/applied-students",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "placement-tracking",
      label: "Placement Tracking",
      url: "/admin/placement-tracking",
      icon: <ClipboardList className="w-4 h-4" />,
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
      label: "Hero Banners",
      url: "/admin/banner",
      icon: <ImageIcon className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        
        className={`text-white bg-zinc-900 shadow-lg h-screen fixed top-0 left-0 overflow-hidden z-50 lg:z-30 transition-all duration-300 flex flex-col ${getSidebarWidth()}`}
      >
        <div
          className={`flex items-center min-h-[64px] z-20 shrink-0 bg-zinc-900 border-b border-white/20 ${
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
              <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                <TechpathBrand
                  {...BRAND_SIZES.compact}
                  textColor="#ffffff"
                  className="mb-0.5"
                />
                <p className="text-xs text-indigo-100/80 font-medium">Admin</p>
              </div>
              {/* Mobile: close drawer (right side, not over logo) */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden inline-flex items-center justify-center text-white p-2 hover:bg-white/10 rounded-md transition duration-200 focus:outline-none shrink-0"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Desktop: collapse sidebar */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:inline-flex text-white p-1 hover:bg-white/10 rounded-md transition duration-200 focus:outline-none shrink-0"
                aria-label="Collapse sidebar"
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

        <div className="py-4 px-2 xl:px-4 flex-1 overflow-y-auto min-h-0">
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

        <div className="p-4 border-t border-white/20 pb-6 shrink-0 bg-zinc-900">
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

      {/* Mobile open button — hidden while drawer is open (close is inside sidebar) */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed top-3 left-3 z-[60]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="bg-white p-2.5 text-gray-800 rounded-xl shadow-md border hover:bg-gray-50 focus:outline-none flex items-center justify-center w-11 h-11"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

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
