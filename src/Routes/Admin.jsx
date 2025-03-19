import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Admin/SideBar';
import Dashboard from '../components/Admin/Dashboard';
import Users from '../components/Admin/Users';
import Employers from '../components/Admin/Employers';
import Jobs from '../components/Admin/Jobs';
import Header from '../components/Admin/Header';


function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
   
      <div className="flex h-screen bg-gray-100 font-inter">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/employers" element={<Employers />} />
              <Route path="/jobs" element={<Jobs />} />
            </Routes>
          </main>
        </div>
      </div>
    
  );
}

export default App;

