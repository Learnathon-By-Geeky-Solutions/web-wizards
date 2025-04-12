import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const LabResult = () => {
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Lab Results</h1>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <select className="border rounded px-3 py-2 bg-white">
            <option>All laboratories</option>
            <option>1</option>
            <option>2</option>
          </select>
          <input 
            type="date" 
            className="border rounded px-3 py-2 bg-white" 
            placeholder="From Date" 
          />
          <input 
            type="date" 
            className="border rounded px-3 py-2 bg-white" 
            placeholder="To Date" 
          />
        </div>

        {/* Empty State Message */}
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <p className="text-gray-500 text-lg">
            No lab results found.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaPlus className="h-6 w-6" />
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Lab Result</h2>
            <div className="space-y-4">
              {/* Add your form fields here */}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResult;