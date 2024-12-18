import React from "react";
import Navbar from "../components/User/Navbar";


const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome Nexgen
          </h1>
          <p className="text-gray-600 text-lg">
            Explore thousands of job opportunities and find your dream career.
          </p>
          <div className="mt-6">
            <button className="px-6 py-2 bg-primary text-white rounded hover:bg-red-500">
              Browse Jobs
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <div className="max-w-7xl mx-auto">
          <p>&copy; 2024 Evanios Jobs Private Limited. All Rights Reserved.</p>
          <p className="text-gray-400 text-sm">
            Designed with ❤️ using React, Tailwind CSS, and Material UI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
