import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart, Label
} from 'recharts';
import { format, parseISO } from 'date-fns';

const CBCTestChart = () => {
  // Mock data - In a real implementation, this would be fetched from your API
  const [cbcData, setCbcData] = useState({
    hasData: false,
    results: [
      {
        date: '2025-01-15',
        hemoglobin: 13.8,
        red_blood_cells: 4.9,
        white_blood_cells: 7.2,
        platelets: 245,
        hematocrit: 41.3,
        neutrophils_percent: 60,
        lymphocytes_percent: 29,
        monocytes_percent: 6,
        eosinophils_percent: 4,
        basophils_percent: 1,
      },
      {
        date: '2025-02-20',
        hemoglobin: 14.0,
        red_blood_cells: 5.0,
        white_blood_cells: 7.4,
        platelets: 248,
        hematocrit: 41.8,
        neutrophils_percent: 61,
        lymphocytes_percent: 28,
        monocytes_percent: 6,
        eosinophils_percent: 4,
        basophils_percent: 1,
      },
      {
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
      }
    ],
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

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // Example: 
    // const fetchCBCData = async () => {
    //   try {
    //     const response = await fetch('/api/medical-records/cbc');
    //     const data = await response.json();
    //     setCbcData({ ...data, hasData: data.results.length > 0 });
    //   } catch (error) {
    //     console.error('Error fetching CBC data:', error);
    //   }
    // };
    // fetchCBCData();
    
    // For demo purposes, just set hasData to true
    setCbcData(prev => ({ ...prev, hasData: true }));
  }, []);

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
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">{formatDate(label)}</p>
          <p className={getStatusColor(
            data[selectedMetric], 
            cbcData.reference[selectedMetric]
          )}>
            {metrics.find(m => m.id === selectedMetric).label}: {data[selectedMetric]}
          </p>
        </div>
      );
    }
    return null;
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
          Latest: {formatDate(cbcData.latest.date)}
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

      {/* Chart implemented with Recharts */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cbcData.results}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={cbcData.reference[selectedMetric] ? 
                [
                  Math.min(cbcData.reference[selectedMetric][0] * 0.8, Math.min(...cbcData.results.map(item => item[selectedMetric])) * 0.9),
                  Math.max(cbcData.reference[selectedMetric][1] * 1.2, Math.max(...cbcData.results.map(item => item[selectedMetric])) * 1.1)
                ] : 
                'auto'
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Reference range area */}
            {cbcData.reference[selectedMetric] && (
              <Area 
                type="monotone" 
                dataKey={() => cbcData.reference[selectedMetric][1]} 
                stroke="none"
                fill="#d1fae5" 
                fillOpacity={0.3}
                activeDot={false}
                legendType="none"
                stackId="1"
              />
            )}
            
            {cbcData.reference[selectedMetric] && (
              <Area 
                type="monotone" 
                dataKey={() => cbcData.reference[selectedMetric][0]} 
                stroke="none"
                fill="#d1fae5" 
                fillOpacity={0}
                activeDot={false}
                legendType="none"
                stackId="1"
                baseValue={cbcData.reference[selectedMetric][0]}
              />
            )}
            
            {/* The actual data line */}
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#0ea5e9" 
              strokeWidth={2}
              animationDuration={750}
              dot={{ stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }}
              name={metrics.find(m => m.id === selectedMetric).label}
            />
            
            {/* Reference lines for min and max normal values */}
            {cbcData.reference[selectedMetric] && (
              <ReferenceLine 
                y={cbcData.reference[selectedMetric][0]} 
                stroke="#10b981" 
                strokeDasharray="3 3"
              >
                <Label value="Min" position="insideBottomLeft" fill="#10b981" fontSize={12} />
              </ReferenceLine>
            )}
            
            {cbcData.reference[selectedMetric] && (
              <ReferenceLine 
                y={cbcData.reference[selectedMetric][1]} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
              >
                <Label value="Max" position="insideTopLeft" fill="#10b981" fontSize={12} />
              </ReferenceLine>
            )}
          </AreaChart>
        </ResponsiveContainer>
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