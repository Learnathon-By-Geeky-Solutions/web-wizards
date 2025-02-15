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
  XMarkIcon, // Close icon
} from '@heroicons/react/24/outline';
import { FaPlus, FaRegHeart } from 'react-icons/fa';

const Logbook = () => {
  const { user } = useContext(AuthContext);

  // State management
  const [fullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('LOGBOOK');

  // Sidebar & top navigation items
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

  // If loading, show a placeholder
  if (isLoading) return <div>Loading...</div>;

  // Navigation Handlers
  const handleEntryTypeClick = (entryType) =>
    setCurrentPage(entryType.toUpperCase().replace(/ /g, '_'));

  // Entry types for "Add new entry"
  const entryTypes = [
    'Blood pressure',
    'Urine pH',
    'Temperature',
    'Blood sugar',
    'Weight',
    'Height',
    'Hydration',
    'Ketones',
    'Cholesterol',
    'Respiratory rate',
    'Oxygen saturation',
    'HBA1c',
  ];

  // Close button component
  const CloseButton = () => (
    <button
      onClick={() => setCurrentPage('LOGBOOK')}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    >
      <XMarkIcon className="w-6 h-6" />
    </button>
  );

  // Generic measurement form for all entry types
  const GenericMeasurementForm = ({ title }) => {
    const inputPlaceholders = {
      'Temperature': 'Enter temperature (°C)',
      'Blood sugar': 'Enter blood sugar (mg/dL)',
      'Weight': 'Enter weight (kg)',
      'Height': 'Enter height (cm)',
      'Oxygen saturation': 'Enter oxygen saturation (%)',
      'Respiratory rate': 'Enter respiratory rate (breaths/min)',
    };

    return (
      <div className="relative p-4 bg-white rounded shadow">
        <CloseButton />
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{title} Value</label>
            <input
              type="text"
              placeholder={inputPlaceholders[title] || `Enter ${title} value`}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold">Amarhealth</h1>
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center p-3 space-x-3 w-full rounded-lg hover:bg-teal-700"
            >
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
              <button
                key={item.name}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold">{fullName}</span>
            <img
              src="/user-avatar.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Logbook Functionality */}
        <div className="mt-6">
          {/* Logbook Home */}
          {currentPage === 'LOGBOOK' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Logbook</h1>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center space-x-2 mb-6">
                <select className="border rounded px-3 py-2 bg-white">
                  <option>All Health Issues</option>
                  <option>Health Issue 1</option>
                  <option>Health Issue 2</option>
                </select>
                <select className="border rounded px-3 py-2 bg-white">
                  <option>All Entries</option>
                  <option>Blood Pressure</option>
                  <option>Weight</option>
                  <option>Temperature</option>
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

              {/* Floating Plus Button */}
              <button
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center"
                onClick={() => setCurrentPage('ADD_ENTRY')}
              >
                <FaPlus className="text-xl" />
              </button>
            </div>
          )}

          {/* Add New Entry Page */}
          {currentPage === 'ADD_ENTRY' && (
            <div className="relative p-4 bg-white rounded shadow">
              <CloseButton />
              <h2 className="text-xl font-semibold mb-4">Add new entry</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {entryTypes.map((item) => (
                  <div
                    key={item}
                    className="cursor-pointer p-4 border rounded text-center hover:bg-gray-50"
                    onClick={() => handleEntryTypeClick(item)}
                  >
                    <FaRegHeart className="mx-auto text-2xl mb-2" />
                    <span className="block font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generic Form for All Other Entry Types */}
          {entryTypes.map((entry) =>
            currentPage === entry.toUpperCase().replace(/ /g, '_') ? (
              <GenericMeasurementForm key={entry} title={entry} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Logbook;
