import React, { useState } from 'react';

const LabTestHistory = () => {
  // In a real implementation, this would be fetched from your API
  const [testHistory, setTestHistory] = useState({
    hasData: false,
    tests: [
      {
        id: 1,
        date: '2025-03-28',
        testTypes: ['CBC', 'URE', 'LFT'],
        summary: {
          status: 'normal',
          abnormal: ['platelets', 'creatinine']
        }
      },
      {
        id: 2,
        date: '2025-02-14',
        testTypes: ['CBC', 'URE'],
        summary: {
          status: 'normal',
          abnormal: []
        }
      },
      {
        id: 3,
        date: '2025-01-05',
        testTypes: ['CBC', 'URE', 'LFT', 'TFT'],
        summary: {
          status: 'abnormal',
          abnormal: ['hemoglobin', 'iron', 'ferritin', 'TSH']
        }
      },
      {
        id: 4,
        date: '2024-11-20',
        testTypes: ['CBC'],
        summary: {
          status: 'abnormal',
          abnormal: ['hemoglobin', 'hematocrit', 'mcv']
        }
      }
    ]
  });

  // Toggle demo data for presentation purposes
  const toggleDemoData = () => {
    setTestHistory(prev => ({
      ...prev,
      hasData: !prev.hasData
    }));
  };

  const getStatusColor = (status) => {
    if (status === 'normal') return 'bg-green-100 text-green-800';
    if (status === 'abnormal') return 'bg-amber-100 text-amber-800';
    if (status === 'critical') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!testHistory.hasData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Lab Test History</h2>
        <div className="mt-6 text-center text-gray-400 py-8">
          No Lab Test History Found
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
      <h2 className="text-lg font-semibold mb-6">Lab Test History</h2>
      
      {/* Timeline visualization */}
      <div className="mb-8 relative">
        <div className="w-full h-2 bg-gray-200 rounded-full absolute top-3"></div>
        <div className="flex justify-between relative">
          {testHistory.tests.map((test, index) => (
            <div key={test.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full z-10 flex items-center justify-center
                ${test.summary.status === 'normal' ? 'bg-green-500' : 
                  test.summary.status === 'abnormal' ? 'bg-amber-500' : 'bg-red-500'}`}
              >
                <span className="text-white text-xs">{testHistory.tests.length - index}</span>
              </div>
              <div className="text-xs mt-1">{test.date.split('-')[1]}/{test.date.split('-')[2]}</div>
              <div className="text-xs text-gray-500">{test.date.split('-')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Test history table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Test Types</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Abnormal Values</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {testHistory.tests.map(test => (
              <tr key={test.id} className="text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{test.date}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {test.testTypes.map(type => (
                      <span 
                        key={type} 
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span 
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${getStatusColor(test.summary.status)}`}
                  >
                    {test.summary.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {test.summary.abnormal.length > 0 ? (
                    <span className="text-amber-600">
                      {test.summary.abnormal.join(', ')}
                    </span>
                  ) : (
                    <span className="text-green-600">None</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-teal-600 hover:text-teal-800">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* This button is just for demo purposes */}
      <button 
        onClick={toggleDemoData} 
        className="mt-6 text-xs text-gray-400 hover:text-gray-600"
      >
        Hide Demo Data
      </button>
    </div>
  );
};

export default LabTestHistory;