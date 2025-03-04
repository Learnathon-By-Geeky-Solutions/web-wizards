import React from 'react';

const BloodPressureCharts = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Blood Pressure per day interval</h2>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          <div className="flex items-end h-full gap-2">
            {[210, 180, 150, 120, 90, 60, 30].map((val) => (
              <div key={val} className="w-8 bg-blue-200" style={{ height: `${val / 3}px` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Blood Pressure per hour</h2>
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
      </div>
    </div>
  );
};

export default BloodPressureCharts;