import React from 'react';

const HealthIssuesHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Health Issues</h1>
      <div className="flex items-center space-x-4">
        <select className="border rounded px-3 py-2">
          <option>All Health Issues</option>
          <option>Current Health Issues</option>
          <option>Past Health Issues</option>
        </select>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded pl-8 pr-3 py-2 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HealthIssuesHeader;