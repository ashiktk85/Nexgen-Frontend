import React, { useState } from "react";
import Header from "../../../components/Employer/Header";
import { useNavigate, Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <section
          className={`main-content px-5 transition-all duration-500 ${
            isSidebarOpen
              ? "ml-[250px] w-[calc(100%-250px)]"
              : "ml-0 w-full lg:ml-[250px] lg:w-[calc(100%-250px)]"
          }`}
        >
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
