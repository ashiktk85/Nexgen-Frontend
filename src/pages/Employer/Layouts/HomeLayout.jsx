import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavbarEmp from "../../../components/Employer/NavbarEmp";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif] overflow-x-hidden">
      <div className="flex items-start">
        <section className="main-content w-full min-w-0 px-3 sm:px-4 lg:px-10">
          <NavbarEmp isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={`panel-main-content transition-all duration-300 lg:pt-8 min-w-0 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[250px]'}`}>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
