import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';

const GenericMeasurementForm = ({ title, setCurrentPage }) => {
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
      <CloseButton setCurrentPage={setCurrentPage} />
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-1 font-medium">Date</label>
          <input
            id="date"
            type="date"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="time" className="block mb-1 font-medium">Time</label>
          <input
            id="time"
            type="time"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="value" className="block mb-1 font-medium">{title} Value</label>
          <input
            id="value"
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

GenericMeasurementForm.propTypes = {
  title: PropTypes.string.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default GenericMeasurementForm;