import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import AdminAxiosInstance from "@/config/axiosConfig/AdminAxiosInstance";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "@/redux/slices/adminSlice";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await AdminAxiosInstance.post("/logout");
      console.log("logout response", response);
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logout!");
        navigate("/admin/admin-login");
      }
    } catch (err) {
      console.error("error", err);
      toast.error("Failed to login");
    }
  };

  return (
    <div
      className={`${
        open ? "translate-x-0 " : "-translate-x-full"
      } fixed inset-y-0 left-0 z-30 w-64  text-black transition duration-300 ease-in-out transform md:relative md:translate-x-0 bg-[#FFFFFF]`}
    >
      <div className="flex items-center justify-between p-4  border-gray-700 bg-[#FFFFFF]">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-primary">
            Nexgen Admin
          </span>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <button className="md:hidden" onClick={() => setOpen(false)}>
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
      </div>
      <nav className="mt-4">
        {/* <span className="text-sm text-gray-500 py-2 px-4">Navigation</span> */}
        <Link
          to="/admin"
          className={`block py-2 px-4 hover:scale-105 transition-transform duration-200 
        ${
          location.pathname === "/admin" ? "font-extrabold text-blue-900" : ""
        }`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/users"
          className={`block py-2 px-4 hover:scale-105 transition-transform duration-200 
        ${
          location.pathname === "/admin/users"
            ? "font-extrabold text-blue-900"
            : ""
        }`}
        >
          Users
        </Link>

        <Link
          to="/admin/employees"
          className={`block py-2 px-4 hover:scale-105 transition-transform duration-200 
        ${
          location.pathname === "/admin/employees"
            ? "font-extrabold text-blue-900"
            : ""
        }`}
        >
          Employees
        </Link>
        <Link
          to="/admin/jobs"
          className={`block py-2 px-4 hover:scale-105 transition-transform duration-200 
        ${
          location.pathname === "/admin/jobs"
            ? "font-extrabold text-blue-900"
            : ""
        }`}
        >
          Jobs
        </Link>
        <Link
          to="/admin/employer-verification"
          className={`block py-2 px-4 hover:scale-105 transition-transform duration-200 
        ${
          location.pathname === "/admin/employer-verification"
            ? "font-extrabold text-blue-900"
            : ""
        }`}
        >
          Verifications
        </Link>
        <button
          onClick={handleLogout}
          className="w-full rounded-md text-left py-2 px-4 hover:bg-gradient-to-t from-slate-200 to-slate-100 flex items-center space-x-2"
        >
          <span>Logout</span>
          <IoIosLogOut />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
