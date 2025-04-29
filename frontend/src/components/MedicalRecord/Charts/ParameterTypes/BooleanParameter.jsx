import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';

const BooleanParameter = ({ name, value, date, isAbnormal }) => {
  // Format date string
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const booleanValue = typeof value === 'boolean' ? value : 
                        value === 'true' || value === 'yes' || value === '1' || value === 1;

  return (
    <div className={`border rounded p-4 ${isAbnormal ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <h4 className="font-medium">{name}</h4>
      <div className="mt-3 flex justify-between items-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          booleanValue 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {booleanValue ? 'Yes' : 'No'}
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(date)}
        </div>
      </div>
      {isAbnormal && (
        <div className="mt-2 text-sm text-red-600">
          Abnormal result
        </div>
      )}
    </div>
  );
};

BooleanParameter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  date: PropTypes.string.isRequired,
  isAbnormal: PropTypes.bool
};

export default BooleanParameter;