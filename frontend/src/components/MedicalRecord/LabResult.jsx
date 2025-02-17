import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';
import TopNav from './TopNav';
import { FaPlus } from 'react-icons/fa';

const LabResult = () => {
  const { user } = useContext(AuthContext);
  const [fullName] = useState('Faysal Ahammed');
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <TopNav fullName={fullName} />
        <div className="mt-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">LabResult</h1>
            <div className="flex flex-wrap items-center space-x-2 mb-6">
              <select className="border rounded px-3 py-2 bg-white">
                <option>All laboratories</option>
                <option>1</option>
                <option>2</option>
              </select>
              <input type="date" className="border rounded px-3 py-2 bg-white" placeholder="From Date" />
              <input type="date" className="border rounded px-3 py-2 bg-white" placeholder="To Date" />
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
              <FaPlus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* ... existing modal content ... */}
        </div>
      )}
    </div>
  );
};

export default LabResult;
