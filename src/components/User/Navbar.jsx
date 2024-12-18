import React from "react";
import { Button, TextField } from "@mui/material";
import { FiLogIn, FiMapPin } from "react-icons/fi";
import { MdOutlineAddBox } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="w-full">
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        {/* Logo */}
        <div className="text-[#0950a0] font-bold text-lg flex items-center">
           {/* Placeholder Logo */}
          Nexgen 
        </div>

        {/* Search Input */}
        <div className="flex flex-1 mx-4">
          <TextField
            variant="outlined"
            placeholder="SEARCH JOB"
            size="small"
            className="w-1/2 mr-2"
          />
          <TextField
            variant="outlined"
            placeholder="Search Location"
            size="small"
            className="w-1/2 mr-2"
          />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<FiLogIn />}
            className="text-black"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            startIcon={<MdOutlineAddBox />}
            className="text-black"
          >
            Register
          </Button>
          <Button variant="contained" color="error">
            FREE JOB POST
          </Button>
          <Button
            variant="contained"
            startIcon={<FiMapPin />}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            KERALA
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-primary text-white py-2">
        <ul className="flex space-x-6 justify-center text-sm font-semibold">
          <li className="cursor-pointer hover:underline">Home</li>
          <li className="cursor-pointer hover:underline">Find Jobs</li>
          <li className="cursor-pointer hover:underline">Job By Categories</li>
          <li className="cursor-pointer hover:underline">Job Id Search</li>
          <li className="cursor-pointer hover:underline">
            Jobs By District ▼
          </li>
          <li className="cursor-pointer hover:underline">Services</li>
          <li className="cursor-pointer hover:underline">Contact Us</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
