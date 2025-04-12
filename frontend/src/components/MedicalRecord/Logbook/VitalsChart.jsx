import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const VitalsChart = ({ data, type, unit }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Transform data for the chart
    const transformed = data.map(item => ({
      ...item,
      timestamp: new Date(`${item.measurement_date}T${item.measurement_time}`).getTime(),
      formattedDate: format(new Date(`${item.measurement_date}T${item.measurement_time}`), 'MMM d, yyyy HH:mm')
    }));

    // Sort by timestamp
    transformed.sort((a, b) => a.timestamp - b.timestamp);
    setChartData(transformed);
  }, [data]);

  const formatYAxis = (value) => `${value}${unit}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.formattedDate}</p>
          <p>{`${data.value}${unit}`}</p>
          {data.notes && <p className="text-sm text-gray-600">{data.notes}</p>}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            type="category"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4A90E2"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

VitalsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    measurement_date: PropTypes.string.isRequired,
    measurement_time: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    notes: PropTypes.string,
  })).isRequired,
  type: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
};

export default VitalsChart;