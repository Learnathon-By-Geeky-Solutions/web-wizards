import React, { useState } from 'react';
import BloodPressureClassification from '../components/MedicalRecord/Charts/BloodPressureClassification';
import BloodPressureCharts from '../components/MedicalRecord/Charts/BloodPressureCharts';
import MenstruationStatistics from '../components/MedicalRecord/Charts/MenstruationStatistics';
import LabTestHistory from '../components/MedicalRecord/Charts/LabTestHistory';
import CBCTestChart from '../components/MedicalRecord/Charts/CBCTestChart';
import URETestChart from '../components/MedicalRecord/Charts/URETestChart';

const Charts = () => {
  const [isLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Medical Charts & Analytics</h1>
        <div className="flex items-center">
          <span className="mr-3">Time Range:</span>
          <select 
            className="border rounded px-3 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Lab test history timeline */}
      <LabTestHistory />
      
      {/* Lab test results section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold px-1">Lab Test Results</h2>
        <CBCTestChart />
        <URETestChart />
      </div>
      
      {/* Vital signs section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold px-1">Vital Signs</h2>
        <BloodPressureClassification />
        <BloodPressureCharts />
      </div>
      
      {/* Other health metrics */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold px-1">Other Health Metrics</h2>
        <MenstruationStatistics />
      </div>
    </div>
  );
};

export default Charts;