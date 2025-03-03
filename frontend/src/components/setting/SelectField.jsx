import React from 'react';

const SelectField = ({ id, label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="block w-full border border-gray-300 rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;