import React, { useState } from 'react';

const CBCTestChart = () => {
  // In a real implementation, this would be fetched from your API
  const [cbcData, setCbcData] = useState({
    hasData: false,
    results: [],
    latest: {
      date: '2025-03-28',
      hemoglobin: 14.2,
      red_blood_cells: 5.1,
      white_blood_cells: 7.6,
      platelets: 250,
      hematocrit: 42.1,
      neutrophils_percent: 62,
      lymphocytes_percent: 28,
      monocytes_percent: 5,
      eosinophils_percent: 4,
      basophils_percent: 1,
    },
    reference: {
      hemoglobin: [12.0, 16.0],
      red_blood_cells: [4.2, 5.4],
      white_blood_cells: [4.5, 11.0],
      platelets: [150, 450],
      hematocrit: [37.0, 47.0],
    }
  });

  const [selectedMetric, setSelectedMetric] = useState('hemoglobin');

  // Toggle demo data for presentation purposes
  const toggleDemoData = () => {
    setCbcData(prev => ({
      ...prev,
      hasData: !prev.hasData
    }));
  };

  const metrics = [
    { id: 'hemoglobin', label: 'Hemoglobin (g/dL)' },
    { id: 'red_blood_cells', label: 'Red Blood Cells (10^6/μL)' },
    { id: 'white_blood_cells', label: 'White Blood Cells (10^3/μL)' },
    { id: 'platelets', label: 'Platelets (10^3/μL)' },
    { id: 'hematocrit', label: 'Hematocrit (%)' },
  ];

  const getStatusColor = (value, referenceRange) => {
    if (!referenceRange) return 'text-gray-700';
    if (value < referenceRange[0]) return 'text-blue-600';
    if (value > referenceRange[1]) return 'text-red-600';
    return 'text-green-600';
  };

  if (!cbcData.hasData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Complete Blood Count (CBC)</h2>
        <div className="mt-6 text-center text-gray-400 py-8">
          No CBC Test Results Found
        </div>
        {/* This button is just for demo/development purposes */}
        <button 
          onClick={toggleDemoData}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Show Demo Data
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Complete Blood Count (CBC)</h2>
        <div className="text-sm text-gray-500">
          Latest: {cbcData.latest.date}
        </div>
      </div>

      {/* Metric selector */}
      <div className="mb-6">
        <label htmlFor="metric-select" className="block mb-2 text-sm font-medium text-gray-700">
          Select Metric
        </label>
        <select 
          id="metric-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          {metrics.map(metric => (
            <option key={metric.id} value={metric.id}>
              {metric.label}
            </option>
          ))}
        </select>
      </div>

      {/* Current value and reference range */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Current Value</div>
            <div className={`text-2xl font-bold ${getStatusColor(
              cbcData.latest[selectedMetric], 
              cbcData.reference[selectedMetric]
            )}`}>
              {cbcData.latest[selectedMetric]}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Reference Range</div>
            <div className="text-lg">
              {cbcData.reference[selectedMetric] ? 
                `${cbcData.reference[selectedMetric][0]} - ${cbcData.reference[selectedMetric][1]}` : 
                'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart placeholder - in a real implementation, you would use a charting library */}
      <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">Trend Chart</div>
            <div className="text-sm text-gray-500">
              This would show a line chart of {selectedMetric} over time
            </div>
          </div>
        </div>
      </div>

      {/* WBC Distribution - only shown when relevant */}
      {selectedMetric === 'white_blood_cells' && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">White Blood Cell Distribution</h3>
          <div className="h-10 flex rounded-md overflow-hidden">
            <div className="bg-red-500" style={{ width: `${cbcData.latest.neutrophils_percent}%` }}></div>
            <div className="bg-blue-500" style={{ width: `${cbcData.latest.lymphocytes_percent}%` }}></div>
            <div className="bg-green-500" style={{ width: `${cbcData.latest.monocytes_percent}%` }}></div>
            <div className="bg-yellow-500" style={{ width: `${cbcData.latest.eosinophils_percent}%` }}></div>
            <div className="bg-purple-500" style={{ width: `${cbcData.latest.basophils_percent}%` }}></div>
          </div>
          <div className="flex text-xs mt-2 justify-between">
            <span className="text-red-500">Neutrophils {cbcData.latest.neutrophils_percent}%</span>
            <span className="text-blue-500">Lymphocytes {cbcData.latest.lymphocytes_percent}%</span>
            <span className="text-green-500">Monocytes {cbcData.latest.monocytes_percent}%</span>
            <span className="text-yellow-500">Eosinophils {cbcData.latest.eosinophils_percent}%</span>
            <span className="text-purple-500">Basophils {cbcData.latest.basophils_percent}%</span>
          </div>
        </div>
      )}

      {/* This button is just for demo purposes */}
      <button 
        onClick={toggleDemoData} 
        className="mt-4 text-xs text-gray-400 hover:text-gray-600"
      >
        Hide Demo Data
      </button>
    </div>
  );
};

export default CBCTestChart;