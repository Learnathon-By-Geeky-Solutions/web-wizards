import React from 'react';
import PropTypes from 'prop-types';

const DateTimeInput = ({ date, time, label, onDateChange, onTimeChange, required = false, disabled = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={date || ''}
            onChange={(e) => onDateChange(e.target.value)}
            required={required}
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">Date</p>
        </div>
        <div>
          <input
            type="time"
            className="w-full p-2 border rounded-md"
            value={time || ''}
            onChange={(e) => onTimeChange(e.target.value)}
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">Time (optional)</p>
        </div>
      </div>
    </div>
  );
};

DateTimeInput.propTypes = {
  date: PropTypes.string,
  time: PropTypes.string,
  label: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default DateTimeInput;