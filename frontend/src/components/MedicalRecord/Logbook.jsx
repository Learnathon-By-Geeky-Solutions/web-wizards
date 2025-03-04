import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaPlus, FaRegHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Logbook = () => {
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('LOGBOOK');

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

  const handleEntryTypeClick = (entryType) =>
    setCurrentPage(entryType.toUpperCase().replace(/ /g, '_'));

  const CloseButton = () => (
    <button
      onClick={() => setCurrentPage('LOGBOOK')}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    >
      <XMarkIcon className="w-6 h-6" />
    </button>
  );

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
  GenericMeasurementForm.propTypes = {
    title: PropTypes.string.isRequired,
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-6">
      {currentPage === 'LOGBOOK' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Logbook</h1>
          <div className="flex flex-wrap items-center gap-2 mb-6">
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

          <button
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center"
            onClick={() => setCurrentPage('ADD_ENTRY')}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
      )}

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

      {entryTypes.map((entry) =>
        currentPage === entry.toUpperCase().replace(/ /g, '_') ? (
          <GenericMeasurementForm key={entry} title={entry} />
        ) : null
      )}
    </div>
  );
};

export default Logbook;
