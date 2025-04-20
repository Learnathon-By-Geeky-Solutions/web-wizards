import React from 'react';

const BloodPressureClassification = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Blood Pressure Classification</h2>
      <div className="space-y-3">
        {['Grade 3', 'Grade 2', 'Grade 1', 'High Normal Normal', 'Optimal', 'Low'].map((item, idx) => (
          <div key={item} className="flex justify-between items-center">
            <span className={`${idx === 0 ? 'text-red-600' : idx === 1 ? 'text-orange-500' : 'text-gray-700'}`}>
              {item}
            </span>
            <span className="text-gray-500">
              {['7 days', '7 days', '14 days', '30 days', '90 days', 'Custom'][idx]}
            </span>
          </div>
        ))}
      </div>

      <hr className="my-6 border-t-2" />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Systolic</h3>
          <div className="flex gap-4 mt-2">
            {['40', '80', '120'].map((num) => (
              <span key={num} className="text-gray-600">{num}</span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium">Diastolic</h3>
          <div className="mt-2 h-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BloodPressureClassification;