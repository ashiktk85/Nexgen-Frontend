import React, { useState } from "react";
import Sidebar from "@/components/Admin/SideBar";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative bg-[#f7f6f9] min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <section className="main-content w-full px-10 lg:px-24">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div
            className={`transition-all duration-300 pt-3 pb-4 ${
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
