import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import MainLayout from '../layouts/MainLayout';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ChartSection from '../components/Dashboard/ChartSection';
import SummarySection from '../components/Dashboard/SummarySection';
import withSentryErrorBoundary from '../components/common/withSentryErrorBoundary';
import useSentryTracking from '../hooks/useSentryTracking';

const Dashboard = () => {
  // Safe destructuring with default empty object to prevent null errors
  const { user = {} } = useContext(AuthContext) || {};
  
  // Initialize Sentry tracking
  useSentryTracking('Dashboard', {
    metadata: {
      userId: user?.id,
      userName: user?.name
    }
  });

  return (
    <MainLayout>
      <div className="p-6">
        <DashboardHeader user={user} />
        <ChartSection />
        <SummarySection />
      </div>
    </MainLayout>
  );
};

export default withSentryErrorBoundary(Dashboard);