import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/MedicalRecord/TopNav';
import MainLayout from './MainLayout';

const MedicalRecordLayout = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <TopNav />
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default MedicalRecordLayout;