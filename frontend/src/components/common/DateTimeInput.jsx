import React from 'react';
import PropTypes from 'prop-types';

const DateTimeInput = ({ date, time, onDateChange, onTimeChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date*
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time*
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
    </div>
  );
};

DateTimeInput.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default DateTimeInput;