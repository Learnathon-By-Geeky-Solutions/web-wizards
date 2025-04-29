import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { format, parseISO } from 'date-fns';

const TestParameterChart = ({ 
  data, 
  label,
  unit, 
  referenceRange,
  color = '#0ea5e9',
  valueKey = 'value',
  dateKey = 'date',
  height = 200
}) => {
  const [showFullRange, setShowFullRange] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Define status color based on reference range
  const getStatusColor = (value) => {
    if (!referenceRange) return 'text-gray-700';
    if (value < referenceRange[0]) return 'text-blue-600';
    if (value > referenceRange[1]) return 'text-red-600';
    return 'text-green-600';
  };

  // Find latest value
  const sortedData = [...data].sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  const latestData = sortedData.length > 0 ? sortedData[0] : null;
  const latestValue = latestData ? latestData[valueKey] : null;

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">{formatDate(data[dateKey])}</p>
          <p className={getStatusColor(data[valueKey])}>
            {label}: {data[valueKey]} {unit}
          </p>
          {data.is_abnormal && (
            <p className="text-red-500 text-sm mt-1">Abnormal value</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate domain based on data and reference range
  const calculateYDomain = () => {
    if (!data || data.length === 0) return [0, 1];

    const values = data.map(item => item[valueKey]);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    
    if (showFullRange && referenceRange) {
      // Show full reference range plus some padding
      const rangeMin = referenceRange[0];
      const rangeMax = referenceRange[1];
      return [
        Math.min(dataMin, rangeMin) * 0.9,
        Math.max(dataMax, rangeMax) * 1.1
      ];
    } else {
      // Focus on data with some padding
      return [
        dataMin * 0.9, 
        dataMax * 1.1
      ];
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded text-gray-500 text-center">
        No data available for {label}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium">{label}</h3>
          <div className="text-xs text-gray-500">{unit}</div>
        </div>
        {latestValue && (
          <div className={`text-lg font-bold ${getStatusColor(latestValue)}`}>
            {latestValue} {unit}
          </div>
        )}
      </div>
      
      {/* Toggle for Y-axis scale */}
      <div className="flex justify-end mb-2">
        <button 
          className="text-xs text-gray-500 underline"
          onClick={() => setShowFullRange(!showFullRange)}
        >
          {showFullRange ? "Focus on data range" : "Show full reference range"}
        </button>
      </div>
      
      {/* Chart visualization */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey={dateKey} 
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={calculateYDomain()}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference range area */}
            {referenceRange && (
              <Area 
                dataKey={() => referenceRange[1]} 
                stroke="none"
                fill="#d1fae5" 
                fillOpacity={0.3}
                activeDot={false}
                legendType="none"
                stackId="1"
              />
            )}
            
            {referenceRange && (
              <Area 
                dataKey={() => referenceRange[0]} 
                stroke="none"
                fill="#d1fae5" 
                fillOpacity={0}
                activeDot={false}
                legendType="none"
                stackId="1"
                baseValue={referenceRange[0]}
              />
            )}
            
            {/* The actual data line */}
            <Line 
              type="monotone" 
              dataKey={valueKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ stroke: color, strokeWidth: 2, fill: '#fff', r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
            />
            
            {/* Reference lines */}
            {referenceRange && (
              <ReferenceLine 
                y={referenceRange[0]} 
                stroke="#10b981" 
                strokeDasharray="3 3"
                label={{ value: 'Min', position: 'insideBottomLeft', fill: '#10b981', fontSize: 10 }}
              />
            )}
            
            {referenceRange && (
              <ReferenceLine 
                y={referenceRange[1]} 
                stroke="#10b981" 
                strokeDasharray="3 3"
                label={{ value: 'Max', position: 'insideTopLeft', fill: '#10b981', fontSize: 10 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Reference range info */}
      {referenceRange && (
        <div className="mt-1 text-xs text-gray-500 text-center">
          Reference range: {referenceRange[0]} - {referenceRange[1]} {unit}
        </div>
      )}
    </div>
  );
};

TestParameterChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  referenceRange: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
  valueKey: PropTypes.string,
  dateKey: PropTypes.string,
  height: PropTypes.number
};

export default TestParameterChart;