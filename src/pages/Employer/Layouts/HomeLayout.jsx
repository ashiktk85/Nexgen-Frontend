import React, { useState } from "react";
import Header from "../../../components/Employer/Header";
import { useNavigate, Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <section className="main-content w-full  px-10">
          <Header />
          <Outlet/>
        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
