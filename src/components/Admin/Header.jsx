import React from 'react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-xl font-semibold text-gray-700">Welcome, Admin</div>
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">John Doe</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://via.placeholder.com/150"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

