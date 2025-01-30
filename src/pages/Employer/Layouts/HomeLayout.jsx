import React, { useState } from "react";
import Header from "../../../components/Employer/Header";
import { useNavigate, Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSubmenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <nav id="sidebar" className="lg:min-w-[250px] w-max max-lg:min-w-8">
          <div
            className={`bg-white shadow-lg h-screen fixed top-0 left-0 overflow-auto z-[99] transition-all duration-500 ${
              isSidebarOpen
                ? "w-[250px] visible opacity-100"
                : "lg:w-[250px] lg:visible lg:opacity-100 w-0 invisible opacity-0"
            }`}
          >
            {/* Logo and Close Button */}
            <div className="flex items-center gap-2 pt-6 pb-2 px-4 sticky top-0 bg-white min-h-[64px] z-[100]">
    
                <h1 className="text-3xl font-bold text-primary">Nexgen</h1>
                <span className="text-sm text-gray-500">
                  Employer Dashboard
                </span>
             
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden ml-auto"
              >
                <svg
                  className="w-7 h-7"
                  fill="#000"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* { id: 'dashboard', label: 'Dashboard', icon: 'house' },
                  { id: 'posts', label: 'Posts', icon: 'post', subItems: ['Help center', 'Article', 'Education'] },
                  { id: 'schedules', label: 'Schedules', icon: 'clock' },
                  { id: 'audience', label: 'Audience', icon: 'users', subItems: ['Users', 'Leads', 'Visitors'] },
                  { id: 'actions', label: 'Actions', icon: 'plus', subItems: ['Profile', 'Logout'] } */}

            <div className="py-4 px-4">
              {/* Menu Items */}
              <ul className="space-y-2">
                {[
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: "house",
                    url: "/employer/dashboard",
                  },
                  {
                    id: "jobs",
                    label: "Jobs",
                    icon: "jobs",
                    subItems: [
                      { label: "Create Job", url: "/employer/create_job" },
                      { label: "Jobs", url: "/employer/job_list" },
                    ],
                  },
                  {
                    id: "applicants",
                    label: "Applicants",
                    icon: "applicants",
                    url: "/employer/applicants",
                  },
                  { id: "company_details", label: "Company Details", icon: "users", url: "/employer/company_details", },
                  { id: "actions", label: "Actions", icon: "plus" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.url) {
                          navigate(item.url);
                        } else {
                          toggleSubmenu(item.id);
                        }
                      }}
                      className="w-full text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300"
                    >
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.subItems && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-3 fill-current ml-auto transition-transform duration-500 ${
                            openMenus[item.id] ? "rotate-0" : "-rotate-90"
                          }`}
                          viewBox="0 0 451.847 451.847"
                        >
                          <path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" />
                        </svg>
                      )}
                    </button>
                    {item.subItems && (
                      <ul
                        className={`ml-8 space-y-2 overflow-hidden transition-all duration-500 ${
                          openMenus[item.id] ? "max-h-[500px]" : "max-h-0"
                        }`}
                      >
                        {item.subItems.map((subItem) => (
                          <Link to={subItem?.url}>
                            <li key={subItem}>
                              <p
                                
                                className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300"
                              >
                                {subItem?.label}
                              </p>
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              {/* Settings Section */}
              <div className="mt-6">
                <h6 className="text-blue-600 text-sm font-bold px-3">
                  General Settings
                </h6>
                <ul className="mt-3 space-y-2">
                  {[
                    { label: "Security", icon: "shield" },
                    { label: "Preferences", icon: "settings" },
                    { label: "Notification Settings", icon: "bell" },
                    { label: "Account Deactivation", icon: "ban" },
                  ].map((setting) => (
                    <li key={setting.label}>
                      <a
                        
                        className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300"
                      >
                        <span>{setting.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden ml-4 mt-4 fixed top-0 left-0 bg-white z-[50]"
        >
          <svg
            className="w-7 h-7"
            fill="#000"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Main Content */}
        <section className="main-content w-full px-6">
          <Header />

          <Outlet />

        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
