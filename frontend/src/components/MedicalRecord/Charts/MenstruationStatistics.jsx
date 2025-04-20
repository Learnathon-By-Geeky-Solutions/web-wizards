import React from 'react';

const MenstruationStatistics = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Menstruation Statistics</h2>
      <div className="space-y-3">
        <div className="font-medium">Reporting period</div>
        <select className="border rounded px-3 py-2">
          <option>1 years</option>
          <option>2 years</option>
          <option>3 years</option>
          <option>4 years</option>
          <option>others</option>
        </select>
      </div>
      <div className="mt-6 text-center text-gray-400 py-8">
        No Results Found
      </div>
    </div>
  );
};

export default MenstruationStatistics;