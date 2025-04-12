import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import { toast } from 'react-toastify';

const GenericMeasurementForm = ({ title, setCurrentPage, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    value: '',
    notes: ''
  });

  const inputPlaceholders = {
    'Temperature': 'Enter temperature (35-43 °C)',
    'Blood sugar': 'Enter blood sugar (20-600 mg/dL)',
    'Weight': 'Enter weight (0-500 kg)',
    'Height': 'Enter height (0-300 cm)',
    'Oxygen saturation': 'Enter oxygen saturation (0-100 %)',
    'Respiratory rate': 'Enter respiratory rate (0-60 breaths/min)',
  };

  const validationRanges = {
    'Temperature': { min: 35, max: 43 },
    'Blood sugar': { min: 20, max: 600 },
    'Weight': { min: 0, max: 500 },
    'Height': { min: 0, max: 300 },
    'Oxygen saturation': { min: 0, max: 100 },
    'Respiratory rate': { min: 0, max: 60 },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.date || !formData.time || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate value range
    const value = parseFloat(formData.value);
    const range = validationRanges[title];
    
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    if (range && (value < range.min || value > range.max)) {
      toast.error(`Value must be between ${range.min} and ${range.max}`);
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative p-4 bg-white rounded shadow">
      <CloseButton setCurrentPage={setCurrentPage} />
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-1 font-medium">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="time" className="block mb-1 font-medium">Time *</label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="value" className="block mb-1 font-medium">{title} Value *</label>
          <input
            id="value"
            name="value"
            type="text"
            value={formData.value}
            onChange={handleChange}
            placeholder={inputPlaceholders[title] || `Enter ${title} value`}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <small className="text-gray-500">
            {validationRanges[title] && `Range: ${validationRanges[title].min} - ${validationRanges[title].max}`}
          </small>
        </div>
        <div className="mb-4">
          <label htmlFor="notes" className="block mb-1 font-medium">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

GenericMeasurementForm.propTypes = {
  title: PropTypes.string.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default GenericMeasurementForm;