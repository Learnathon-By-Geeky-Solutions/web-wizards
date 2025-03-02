import React from 'react';

const DateTimeInput = ({ date, time, onDateChange, onTimeChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date*
        </label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time*
        </label>
        <input
          type="time"
          className="w-full p-2 border rounded-md"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateTimeInput;