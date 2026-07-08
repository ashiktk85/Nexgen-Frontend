import React, { useState } from "react";
import Sidebar from "@/components/Admin/SideBar";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative bg-[#f7f6f9] min-h-screen font-[sans-serif] overflow-x-hidden">
      <div className="flex items-start">
        <section className="main-content w-full min-w-0 px-3 sm:px-6 lg:px-24">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div
            className={`panel-main-content transition-all duration-300 pb-6 lg:pb-4 lg:pt-3 ${
              isCollapsed ? "lg:ml-[80px]" : "lg:ml-[250px]"
            }`}
          >
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomeLayout;
