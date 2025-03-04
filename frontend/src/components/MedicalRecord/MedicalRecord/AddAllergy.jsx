import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddAllergy = ({ onClose, onConfirm }) => {
  const [allergyType, setAllergyType] = useState('None');
  const [dateDiagnosed, setDateDiagnosed] = useState('');
  const [description, setDescription] = useState('');

  const allergyTypes = [
    'None',
    'Dust Allergy',
    'Food Allergy',
    'Insect Allergy',
    'Latex Allergy',
    'Mold Allergy',
    'Pet Allergy',
    'Pollen Allergy',
    'Drug Allergy',
    'Other Allergy',
  ];

  const handleConfirm = () => {
    if (!allergyType || !dateDiagnosed.trim()) {
      alert('Please fill in all required fields (Allergy Type and Date Diagnosed).');
      return;
    }
    const allergyData = {
      allergyType,
      dateDiagnosed,
      description,
    };
    onConfirm(allergyData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Add Allergy</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="allergyType" className="block text-sm font-medium mb-1">
              Allergy Type
            </label>
            <select
              id="allergyType"
              value={allergyType}
              onChange={(e) => setAllergyType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {allergyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dateDiagnosed" className="block text-sm font-medium mb-1">
              Date Diagnosed
            </label>
            <input
              type="date"
              id="dateDiagnosed"
              value={dateDiagnosed}
              onChange={(e) => setDateDiagnosed(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
        </form>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

AddAllergy.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AddAllergy;