import React, { useState } from 'react';
import BloodPressureClassification from './Charts/BloodPressureClassification';
import BloodPressureCharts from './Charts/BloodPressureCharts';
import MenstruationStatistics from './Charts/MenstruationStatistics';

const Charts = () => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Charts</h1>
        <select className="border rounded px-3 py-2">
          <option>7 days</option>
          <option>14 days</option>
          <option>30 days</option>
          <option>90 days</option>
          <option>Custom</option>
        </select>
      </div>

      <BloodPressureClassification />
      <BloodPressureCharts />
      <MenstruationStatistics />
    </div>
  );
};

export default Charts;
