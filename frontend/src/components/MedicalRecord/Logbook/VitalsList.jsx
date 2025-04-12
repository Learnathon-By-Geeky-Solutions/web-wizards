import React, { useState, useEffect } from 'react';
import { fetchVitalMeasurements } from '../../../api/vitalsApi';
import { format } from 'date-fns';
import VitalsChart from './VitalsChart';

const VitalsList = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('table'); // 'table' or 'chart'

  const measurementTypes = [
    { value: 'all', label: 'All Measurements' },
    { value: 'temperature', label: 'Temperature', unit: '°C' },
    { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { value: 'weight', label: 'Weight', unit: 'kg' },
    { value: 'height', label: 'Height', unit: 'cm' },
    { value: 'oxygen_saturation', label: 'Oxygen Saturation', unit: '%' },
    { value: 'respiratory_rate', label: 'Respiratory Rate', unit: 'breaths/min' },
  ];

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const data = await fetchVitalMeasurements();
      setMeasurements(data);
    } catch (error) {
      console.error('Failed to load measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeasurements = filter === 'all' 
    ? measurements 
    : measurements.filter(m => m.chart_type === filter);

  const selectedType = measurementTypes.find(t => t.value === filter);

  if (loading) {
    return <div className="text-center py-4">Loading measurements...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vital Measurements</h2>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            {measurementTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setView('table')}
              className={`px-4 py-2 text-sm font-medium border ${
                view === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-l-lg`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('chart')}
              className={`px-4 py-2 text-sm font-medium border ${
                view === 'chart' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-r-lg`}
            >
              Chart
            </button>
          </div>
        </div>
      </div>

      {view === 'chart' && filter !== 'all' ? (
        <VitalsChart 
          data={filteredMeasurements}
          type={filter}
          unit={selectedType.unit}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Measurement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMeasurements.map((measurement) => (
                <tr key={measurement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(`${measurement.measurement_date}T${measurement.measurement_time}`), 'PPp')}
                  </td>
                  <td className="px-6 py-4">
                    {measurement.title}
                  </td>
                  <td className="px-6 py-4">
                    {measurement.value} {measurement.unit}
                  </td>
                  <td className="px-6 py-4">
                    {measurement.health_issue?.title || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {measurement.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMeasurements.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No measurements found
        </div>
      )}
    </div>
  );
};

export default VitalsList;