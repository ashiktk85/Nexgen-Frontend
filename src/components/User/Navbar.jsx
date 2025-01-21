import React from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, Home, Work, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.seekerInfo)
  console.log("user red" , user);
  
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-10">
      {/* Left Section: Logo and Search Bar */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">Nexgen</div>
        {/* Search Bar */}
        
        
      </div>

      {/* Right Section: Navigation Links */}
      <div className="flex items-center space-x-6">
        {/* Home */}
        <div className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-blue-500">
          <Home fontSize="small" />
          <span className="hidden md:inline">Home</span>
        </div>

        {/* Browse Jobs */}
        <div className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-blue-500">
          <Work fontSize="small" />
          <span className="hidden md:inline">Browse Jobs</span>
        </div>

        {/* Login/Sign Up */}
        <div className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-blue-500">
          {
            user ? <Person fontSize="small"
            onClick={() => navigate('/profile')}
            /> 
            : 
             <span className="hidden md:inline"
            onClick={() => navigate('/login')}
            >Login/Sign Up</span>
          }
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;