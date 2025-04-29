import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';

const CategoricalParameter = ({ name, value, date, isAbnormal, possibleValues = [] }) => {
  // Format date string
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Define color based on abnormal flag and possible values
  const getValueColorClass = () => {
    if (isAbnormal) return 'text-red-600 bg-red-100';
    
    // If we have possible values, we can color-code normal vs abnormal values
    if (possibleValues.length > 0) {
      const isNormal = possibleValues.some(v => 
        typeof v === 'object' 
          ? v.value === value && v.is_normal 
          : v === value
      );
      return isNormal ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
    }
    
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="border rounded p-4">
      <h4 className="font-medium">{name}</h4>
      <div className="mt-3 flex justify-between items-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getValueColorClass()}`}>
          {value}
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(date)}
        </div>
      </div>
      
      {possibleValues.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          Possible values: {possibleValues.map(v => typeof v === 'object' ? v.value : v).join(', ')}
        </div>
      )}
      
      {isAbnormal && (
        <div className="mt-2 text-sm text-red-600">
          Abnormal result
        </div>
      )}
    </div>
  );
};

CategoricalParameter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isAbnormal: PropTypes.bool,
  possibleValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        is_normal: PropTypes.bool
      })
    ])
  )
};

export default CategoricalParameter;