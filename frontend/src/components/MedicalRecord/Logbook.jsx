import React, { useState } from 'react';
import { FaPlus, FaRegHeart } from 'react-icons/fa';
import CloseButton from './Logbook/CloseButton';
import GenericMeasurementForm from './Logbook/GenericMeasurementForm';
import VitalsModal from './Logbook/VitalsModal';

const Logbook = () => {
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('LOGBOOK');
  const [logs, setLogs] = useState([]);

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

  const handleSave = (newLog) => {
    setLogs([...logs, { ...newLog, id: logs.length + 1, createdAt: new Date() }]);
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

          <div className="mt-4">
            {logs.length === 0 ? (
              <p>No logs available. Click on "+ Add Entry" to create one.</p>
            ) : (
              <ul>
                {logs.map((log) => (
                  <li key={log.id} className="border p-2 mb-2 rounded">
                    <p><strong>Vital:</strong> {log.vital}</p>
                    <p><strong>Value:</strong> {log.value}</p>
                    <p><strong>Date:</strong> {log.date}</p>
                    <p><strong>Time:</strong> {log.time}</p>
                    <p><strong>Created At:</strong> {log.createdAt.toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {currentPage === 'ADD_ENTRY' && (
        <VitalsModal setCurrentPage={setCurrentPage} onSave={handleSave} />
      )}

      {entryTypes.map((entry) =>
        currentPage === entry.toUpperCase().replace(/ /g, '_') ? (
          <GenericMeasurementForm key={entry} title={entry} setCurrentPage={setCurrentPage} />
        ) : null
      )}
    </div>
  );
};

export default Logbook;
