import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftIcon,
  CalendarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentIcon,
  BeakerIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FaPlus } from 'react-icons/fa';

const LabResult = () => {
  const { user } = useContext(AuthContext);

  // State management
  const [fullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('LabResult');
  const [showModal, setShowModal] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Medical record', icon: ClipboardDocumentIcon },
    { name: 'Health Issues', icon: HeartIcon },
    { name: 'Medications', icon: ClipboardDocumentIcon },
    { name: 'Clinicians', icon: UserGroupIcon },
    { name: 'Chat', icon: ChatBubbleOvalLeftIcon },
    { name: 'Appointments', icon: CalendarIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  const topNavItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Logbook', icon: BookOpenIcon },
    { name: 'Symptoms', icon: HeartIcon },
    { name: 'Charts', icon: ChartBarIcon },
    { name: 'Documents', icon: DocumentIcon },
    { name: 'Lab Results', icon: BeakerIcon },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold">Amarhealth</h1>
        <nav>
          {sidebarItems.map((item) => (
            <button key={item.name} className="flex items-center p-3 space-x-3 w-full rounded-lg hover:bg-teal-700">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg">
          <div className="flex space-x-6">
            {topNavItems.map((item) => (
              <button key={item.name} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold">{fullName}</span>
            <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* LabResult Functionality */}
        <div className="mt-6">
          {currentPage === 'LabResult' && (
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
              {/* Floating Plus Button */}
              <button 
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
              >
                <FaPlus className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Import Lab Result</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  All Laboratories
                </label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Select Laboratory</option>
                  <option>LabCorp</option>
                  <option>Quest Diagnostics</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResult;
