import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';

const TextParameter = ({ name, value, date, isAbnormal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date string
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Check if text is long and needs a "show more" option
  const isLongText = value && value.length > 300;
  const displayText = isLongText && !isExpanded 
    ? value.substring(0, 300) + '...' 
    : value;

  return (
    <div className={`border rounded p-4 mb-4 ${isAbnormal ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{name}</h4>
        <div className="text-sm text-gray-500">
          {formatDate(date)}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-gray-700 whitespace-pre-wrap">{displayText}</div>
        
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      {isAbnormal && (
        <div className="mt-3 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          Abnormal finding
        </div>
      )}
    </div>
  );
};

TextParameter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isAbnormal: PropTypes.bool
};

export default TextParameter;