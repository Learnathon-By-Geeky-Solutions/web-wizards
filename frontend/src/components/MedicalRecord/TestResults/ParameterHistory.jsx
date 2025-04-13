import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const ParameterHistory = ({ parameterId, height = "100%", showLegend = false }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/medical-records/parameters/${parameterId}/history/`);
        
        // Transform data for chart
        const transformedData = response.data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          value: parseFloat(item.value),
          isAbnormal: item.is_abnormal,
          // Store original date for sorting
          originalDate: new Date(item.date)
        }));
        
        // Sort chronologically
        transformedData.sort((a, b) => a.originalDate - b.originalDate);
        
        setHistory(transformedData);
      } catch (err) {
        console.error('Error fetching parameter history:', err);
        setError('Failed to load parameter history');
      } finally {
        setIsLoading(false);
      }
    };

    if (parameterId) {
      fetchHistory();
    }
  }, [parameterId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No historical data available</p>
      </div>
    );
  }

  // Find min and max values for reference
  const minValue = Math.min(...history.map(item => item.value));
  const maxValue = Math.max(...history.map(item => item.value));
  
  // Calculate domain padding (10% of range)
  const range = maxValue - minValue;
  const padding = range * 0.1;
  const yDomain = [
    Math.max(0, minValue - padding), // Don't go below 0 for most medical values
    maxValue + padding
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={history}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10 }}
          tickFormatter={(tick, index) => {
            // Show fewer ticks on small charts
            return index % Math.ceil(history.length / 3) === 0 ? tick : '';
          }}
        />
        <YAxis 
          domain={yDomain}
          tick={{ fontSize: 10 }}
          width={25}
        />
        <Tooltip 
          contentStyle={{ fontSize: '12px' }}
          formatter={(value) => [`${value}`, 'Value']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1 }}
          activeDot={{ r: 5, strokeWidth: 1 }}
          isAnimationActive={false}
        />
        
        {/* Conditional markers for abnormal values */}
        {history.filter(item => item.isAbnormal).map((point, index) => (
          <ReferenceLine
            key={`abnormal-${index}`}
            x={point.date}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

ParameterHistory.propTypes = {
  parameterId: PropTypes.number.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showLegend: PropTypes.bool
};

export default ParameterHistory;