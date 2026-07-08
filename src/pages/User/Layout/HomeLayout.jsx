import React from 'react'
import Navbar from "@/components/User/Navbar";
import WhatsAppFab from "@/components/common/WhatsAppFab";
import { Outlet } from 'react-router-dom';

function HomeLayout() {
  return (
    <div className="relative z-0 flex flex-col min-h-screen w-full overflow-x-hidden font-rubik">
      <Navbar/>
      <Outlet />
      <WhatsAppFab />
    </div>
  )
}

export default HomeLayout
