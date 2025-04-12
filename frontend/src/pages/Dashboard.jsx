import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ChartSection from '../components/Dashboard/ChartSection';
import SummarySection from '../components/Dashboard/SummarySection';
import withSentryErrorBoundary from '../components/common/withSentryErrorBoundary';
import useSentryTracking from '../hooks/useSentryTracking';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Initialize Sentry tracking
  useSentryTracking('Dashboard', {
    metadata: {
      userId: user?.id,
      userName: user?.name
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <DashboardHeader user={user} />
        <ChartSection />
        <SummarySection />
      </div>
    </div>
  );
};

export default withSentryErrorBoundary(Dashboard);