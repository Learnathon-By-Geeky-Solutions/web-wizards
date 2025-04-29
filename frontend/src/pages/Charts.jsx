import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BloodPressureClassification from '../components/MedicalRecord/Charts/BloodPressureClassification';
import BloodPressureCharts from '../components/MedicalRecord/Charts/BloodPressureCharts';
import MenstruationStatistics from '../components/MedicalRecord/Charts/MenstruationStatistics';
import LabTestHistory from '../components/MedicalRecord/Charts/LabTestHistory';
import TestParameterDashboard from '../components/MedicalRecord/Charts/TestParameterDashboard';

const Charts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30');
  const location = useLocation();

  useEffect(() => {
    // Check if we should open a specific tab based on URL
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Medical Charts & Analytics</h1>
        
        {/* Tab Navigation */}
        <div className="border-b mb-4">
          <nav className="flex flex-wrap -mb-px">
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'lab-tests'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('lab-tests')}
            >
              Lab Tests
            </button>
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'vitals'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('vitals')}
            >
              Vital Signs
            </button>
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'health-metrics'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('health-metrics')}
            >
              Health Metrics
            </button>
          </nav>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center mb-4">
          <span className="mr-3">Time Range:</span>
          <select 
            className="border rounded px-3 py-2"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">365 days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          <LabTestHistory />
          {/* Using our new TestParameterDashboard component */}
          <TestParameterDashboard />
          <BloodPressureCharts />
        </>
      )}

      {activeTab === 'lab-tests' && (
        <TestParameterDashboard />
      )}
      
      {activeTab === 'vitals' && (
        <>
          <BloodPressureClassification />
          <BloodPressureCharts />
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Heart Rate</h2>
            <div className="text-center text-gray-500 py-8">
              Heart rate data visualizations will appear here
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Body Temperature</h2>
            <div className="text-center text-gray-500 py-8">
              Body temperature data visualizations will appear here
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'health-metrics' && (
        <>
          <MenstruationStatistics />
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Weight & BMI</h2>
            <div className="text-center text-gray-500 py-8">
              Weight and BMI trend charts will appear here
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Physical Activity</h2>
            <div className="text-center text-gray-500 py-8">
              Physical activity metrics will appear here
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Charts;