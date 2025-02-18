import React from 'react';

const TimeField = ({ id, label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="time"
        className="block w-full border border-gray-300 rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
};

export default TimeField;