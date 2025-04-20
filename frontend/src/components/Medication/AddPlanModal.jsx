import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTimeInput from './DateTimeInput';

const AddPlanModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    if (formData.description.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Add Medication Plan</h2>
        
        <div className="space-y-4">
          <DateTimeInput 
            date={formData.effectiveDate}
            time={formData.time}
            onDateChange={(value) => handleChange({ target: { name: 'effectiveDate', value } })}
            onTimeChange={(value) => handleChange({ target: { name: 'time', value } })}
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Medication name*
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter medication plan details"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.description.trim()}
            className={`px-4 py-2 rounded ${formData.description.trim() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

AddPlanModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddPlanModal;