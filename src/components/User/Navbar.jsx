import React from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, Home, Work, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.seekerInfo);

  return (
    <nav className="absolute bg-transparent z-50 w-full md:pt-4 lg:pt-8 flex items-start justify-between md:px-10 lg:px-20">
      {/* Left Section: Logo and Search Bar */}
      <div className="flex items-center space-x-4 ">
        {/* Logo */}
        <div
          className="md:text-3xl lg:text-5xl  font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          Nexgen
        </div>
        {/* Search Bar */}
      </div>

      {/* Right Section: Navigation Links */}
      <div className="flex flex-col items-end lg:gap-4 space-x-6 md:text-sm lg:text-lg font-bold">
        {/* Home */}
        <div className="flex items-center space-x-1 cursor-pointer text-white hover:text-blue-300">
          {/* <Home fontSize="small" /> */}
          <span className="hidden md:inline">Home</span>
        </div>

        {/* Browse Jobs */}
        <div className="flex items-center space-x-1 cursor-pointer text-white hover:text-blue-300">
          {/* <Work fontSize="small" /> */}
          <span className="hidden md:inline">Browse Jobs</span>
        </div>

        {/* Login/Sign Up */}
        <div className="flex items-center space-x-1 cursor-pointer text-white hover:text-blue-300">
          {Object.keys(user).length > 0 ? (
            <Person fontSize="small" onClick={() => navigate("/profile")} />
          ) : (
            <span
              className="hidden md:inline"
              onClick={() => navigate("/login")}
            >
              Login/Sign Up
            </span>
          )}
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
