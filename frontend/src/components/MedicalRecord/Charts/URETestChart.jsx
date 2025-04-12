import React, { useState } from 'react';

const URETestChart = () => {
  // In a real implementation, this would be fetched from your API
  const [ureData, setUreData] = useState({
    hasData: false,
    results: [],
    latest: {
      date: '2025-03-28',
      sodium: 140,
      potassium: 4.2,
      chloride: 102,
      bicarbonate: 24,
      urea: 5.2,
      creatinine: 80,
      egfr: 90,
      calcium: 2.3,
      phosphate: 1.1,
    },
    reference: {
      sodium: [135, 145],
      potassium: [3.5, 5.0],
      chloride: [98, 107],
      bicarbonate: [22, 29],
      urea: [2.5, 7.1],
      creatinine: [60, 110],
      egfr: [90, 120],
      calcium: [2.1, 2.6],
      phosphate: [0.8, 1.5],
    }
  });

  const [selectedMetric, setSelectedMetric] = useState('sodium');
  const [selectedCategory, setSelectedCategory] = useState('electrolytes');

  // Toggle demo data for presentation purposes
  const toggleDemoData = () => {
    setUreData(prev => ({
      ...prev,
      hasData: !prev.hasData
    }));
  };

  const categories = [
    { 
      id: 'electrolytes', 
      label: 'Electrolytes',
      metrics: [
        { id: 'sodium', label: 'Sodium (mmol/L)' },
        { id: 'potassium', label: 'Potassium (mmol/L)' },
        { id: 'chloride', label: 'Chloride (mmol/L)' },
        { id: 'bicarbonate', label: 'Bicarbonate (mmol/L)' },
      ]
    },
    { 
      id: 'kidney', 
      label: 'Kidney Function',
      metrics: [
        { id: 'urea', label: 'Urea (mmol/L)' },
        { id: 'creatinine', label: 'Creatinine (μmol/L)' },
        { id: 'egfr', label: 'eGFR (mL/min/1.73m²)' },
      ]
    },
    { 
      id: 'minerals', 
      label: 'Minerals',
      metrics: [
        { id: 'calcium', label: 'Calcium (mmol/L)' },
        { id: 'phosphate', label: 'Phosphate (mmol/L)' },
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const getStatusColor = (value, referenceRange) => {
    if (!referenceRange) return 'text-gray-700';
    if (value < referenceRange[0]) return 'text-blue-600';
    if (value > referenceRange[1]) return 'text-red-600';
    return 'text-green-600';
  };

  const getPercentInRange = (value, range) => {
    if (!range) return 50;
    const [min, max] = range;
    const rangeSize = max - min;
    const buffer = rangeSize * 0.5; // Show values that are 50% outside the range
    
    if (value < min - buffer) return 0;
    if (value > max + buffer) return 100;
    
    if (value < min) {
      return ((value - (min - buffer)) / buffer) * 25;
    } else if (value > max) {
      return 75 + ((value - max) / buffer) * 25;
    } else {
      return 25 + ((value - min) / rangeSize) * 50;
    }
  };

  if (!ureData.hasData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Urea & Electrolytes</h2>
        <div className="mt-6 text-center text-gray-400 py-8">
          No URE Test Results Found
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
        <h2 className="text-lg font-semibold">Urea & Electrolytes</h2>
        <div className="text-sm text-gray-500">
          Latest: {ureData.latest.date}
        </div>
      </div>

      {/* Category selector */}
      <div className="mb-4">
        <div className="flex border-b">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedMetric(category.metrics[0].id);
              }}
              className={`py-2 px-4 font-medium ${
                selectedCategory === category.id
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
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
          {currentCategory.metrics.map(metric => (
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
              ureData.latest[selectedMetric], 
              ureData.reference[selectedMetric]
            )}`}>
              {ureData.latest[selectedMetric]}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Reference Range</div>
            <div className="text-lg">
              {ureData.reference[selectedMetric] ? 
                `${ureData.reference[selectedMetric][0]} - ${ureData.reference[selectedMetric][1]}` : 
                'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Visual indicator */}
      <div className="mb-6">
        <div className="h-6 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-md relative">
          {ureData.reference[selectedMetric] && (
            <>
              <div className="absolute top-0 bottom-0 border-l-2 border-white" 
                style={{ left: '25%' }}></div>
              <div className="absolute top-0 bottom-0 border-l-2 border-white" 
                style={{ left: '75%' }}></div>
              <div className="absolute top-full mt-1 text-xs text-gray-600" style={{ left: '25%', transform: 'translateX(-50%)' }}>
                {ureData.reference[selectedMetric][0]}
              </div>
              <div className="absolute top-full mt-1 text-xs text-gray-600" style={{ left: '75%', transform: 'translateX(-50%)' }}>
                {ureData.reference[selectedMetric][1]}
              </div>
              
              <div className="absolute top-0 h-6 w-4 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
                style={{ left: `${getPercentInRange(ureData.latest[selectedMetric], ureData.reference[selectedMetric])}%` }}>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Electrolyte balance - only shown for electrolytes */}
      {selectedCategory === 'electrolytes' && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Electrolyte Balance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <div className="text-sm text-gray-500">Sodium/Potassium Ratio</div>
              <div className="text-xl font-semibold">
                {(ureData.latest.sodium / ureData.latest.potassium).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Target: 30-35:1</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-sm text-gray-500">Anion Gap</div>
              <div className="text-xl font-semibold">
                {(ureData.latest.sodium - (ureData.latest.chloride + ureData.latest.bicarbonate)).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Normal: 8-16 mEq/L</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart placeholder - in a real implementation, you would use a charting library */}
      <div className="mt-6 h-64 bg-gray-50 rounded-lg p-4 mb-4">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">Trend Chart</div>
            <div className="text-sm text-gray-500">
              This would show a line chart of {selectedMetric} over time
            </div>
          </div>
        </div>
      </div>

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

export default URETestChart;