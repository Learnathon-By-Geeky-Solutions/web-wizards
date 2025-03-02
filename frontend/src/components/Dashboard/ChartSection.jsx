import React from 'react';
import HealthDataChart from './HealthDataChart';

const ChartSection = () => {
  // Generate chart data for multiple charts
  const generateChartData = (count) => {
    return Array(count).fill(null).map((_, index) => ({
      id: `chart-${index}`,
      title: `Health Data Chart ${index + 1}`,
      label: `Health Data ${index + 1}`,
    }));
  };

  const charts = generateChartData(6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {charts.map((chart) => (
        <HealthDataChart key={chart.id} title={chart.title} dataLabel={chart.label} />
      ))}
    </div>
  );
};

export default ChartSection;