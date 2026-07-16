import React from 'react'
import Navbar from "@/components/User/Navbar";
import LegalFooter from "@/components/LegalFooter";
import { Outlet, useLocation } from 'react-router-dom';

function HomeLayout() {
  const { pathname } = useLocation();
  const showLegalFooter = pathname !== "/";

  return (
    <div className="relative z-0 flex flex-col min-h-screen w-full overflow-x-hidden font-rubik">
      <Navbar/>
      <div className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </div>
      {showLegalFooter && <LegalFooter />}
    </div>
  )
}

export default HomeLayout
