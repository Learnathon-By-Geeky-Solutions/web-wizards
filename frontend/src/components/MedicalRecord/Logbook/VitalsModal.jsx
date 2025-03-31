import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';

const VitalsModal = ({ setCurrentPage, onSave }) => {
  const [selectedVital, setSelectedVital] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', value: '' });

  const vitals = [
    'Temperature',
    'Blood sugar',
    'Weight',
    'Height',
    'Oxygen saturation',
    'Respiratory rate',
  ];

  const handleSave = () => {
    if (selectedVital && formData.date && formData.time && formData.value) {
      onSave({ ...formData, vital: selectedVital });
      setCurrentPage('LOGBOOK');
    }
  };

  return (
    <div className="relative p-4 bg-white rounded shadow">
      <CloseButton setCurrentPage={setCurrentPage} />
      {!selectedVital ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add new entry</h2>
          <div className="grid grid-cols-2 gap-4">
            {vitals.map((vital) => (
              <button
                key={vital}
                onClick={() => setSelectedVital(vital)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                {vital}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">{selectedVital}</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="date" className="block mb-1 font-medium">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block mb-1 font-medium">Time</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="value" className="block mb-1 font-medium">{selectedVital} Value</label>
              <input
                id="value"
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={`Enter ${selectedVital} value`}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

VitalsModal.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default VitalsModal;