import React from 'react';
import Card from './Card';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-blue-100">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">1,234</p>
      </Card>
      <Card className="bg-green-100">
        <h2 className="text-xl font-semibold mb-2">Active Employees</h2>
        <p className="text-3xl font-bold">567</p>
      </Card>
      <Card className="bg-yellow-100">
        <h2 className="text-xl font-semibold mb-2">Open Jobs</h2>
        <p className="text-3xl font-bold">89</p>
      </Card>
    </div>
  );
};

export default Dashboard;

