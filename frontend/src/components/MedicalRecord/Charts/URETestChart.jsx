import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';

const URETestChart = () => {
  // In a real implementation, this would be fetched from your API
  const [ureData, setUreData] = useState({
    hasData: false,
    results: [
      {
        date: '2025-01-15',
        sodium: 138,
        potassium: 4.0,
        chloride: 100,
        bicarbonate: 23,
        urea: 5.0,
        creatinine: 78,
        egfr: 92,
        calcium: 2.2,
        phosphate: 1.0,
      },
      {
        date: '2025-02-20',
        sodium: 139,
        potassium: 4.1,
        chloride: 101,
        bicarbonate: 24,
        urea: 5.1,
        creatinine: 79,
        egfr: 91,
        calcium: 2.2,
        phosphate: 1.1,
      },
      {
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
      }
    ],
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

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For demo purposes, just set hasData to true
    setUreData(prev => ({ ...prev, hasData: true }));
  }, []);

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
  
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const currentMetricLabel = currentCategory.metrics.find(m => m.id === selectedMetric).label;
      
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">{formatDate(label)}</p>
          <p className={getStatusColor(
            data[selectedMetric], 
            ureData.reference[selectedMetric]
          )}>
            {currentMetricLabel}: {data[selectedMetric]}
          </p>
          {selectedCategory === 'electrolytes' && (
            <div className="mt-2 pt-2 border-t text-xs">
              <p>Na/K Ratio: {(data.sodium / data.potassium).toFixed(1)}</p>
              <p>Anion Gap: {(data.sodium - (data.chloride + data.bicarbonate)).toFixed(1)}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // For electrolyte balance visualization
  const prepareElectrolyteData = () => {
    return ureData.results.map(result => ({
      ...result,
      anion_gap: result.sodium - (result.chloride + result.bicarbonate),
      na_k_ratio: result.sodium / result.potassium
    }));
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
          Latest: {formatDate(ureData.latest.date)}
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

      {/* Chart implemented with Recharts */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ureData.results}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={ureData.reference[selectedMetric] ? 
                [
                  Math.min(ureData.reference[selectedMetric][0] * 0.8, Math.min(...ureData.results.map(item => item[selectedMetric])) * 0.9),
                  Math.max(ureData.reference[selectedMetric][1] * 1.2, Math.max(...ureData.results.map(item => item[selectedMetric])) * 1.1)
                ] : 
                'auto'
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* The actual data line */}
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#0ea5e9" 
              strokeWidth={2}
              animationDuration={750}
              dot={{ stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }}
              name={currentCategory.metrics.find(m => m.id === selectedMetric).label}
            />
            
            {/* Reference lines for min and max normal values */}
            {ureData.reference[selectedMetric] && (
              <ReferenceLine 
                y={ureData.reference[selectedMetric][0]} 
                stroke="#10b981" 
                strokeDasharray="3 3"
                label={{ value: 'Min', position: 'insideBottomLeft', fill: '#10b981', fontSize: 12 }}
              />
            )}
            
            {ureData.reference[selectedMetric] && (
              <ReferenceLine 
                y={ureData.reference[selectedMetric][1]} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
                label={{ value: 'Max', position: 'insideTopLeft', fill: '#10b981', fontSize: 12 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
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
          
          {/* Electrolyte ratio chart */}
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={prepareElectrolyteData()}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="anion_gap" name="Anion Gap" fill="#6366f1" />
                <Line yAxisId="right" type="monotone" dataKey="na_k_ratio" name="Na/K Ratio" stroke="#e11d48" />
                <ReferenceLine yAxisId="left" y={8} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Min AG', position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
                <ReferenceLine yAxisId="left" y={16} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Max AG', position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
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

export default URETestChart;