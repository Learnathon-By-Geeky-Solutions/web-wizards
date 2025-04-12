import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/MedicalRecord/TopNav';

const MedicalRecordLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <TopNav />
        <Outlet />
      </div>
    </div>
  );
};

export default MedicalRecordLayout;