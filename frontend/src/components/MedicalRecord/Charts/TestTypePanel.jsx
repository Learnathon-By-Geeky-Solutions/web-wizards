import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import ParameterVisualizer from './ParameterVisualizer';

const TestTypePanel = ({ 
  testType,
  parameters = [], 
  initialExpandedState = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpandedState);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Find all unique dates from all parameters
  const allDates = React.useMemo(() => {
    const dates = new Set();
    parameters.forEach(param => {
      param.data_points.forEach(point => {
        dates.add(point.date);
      });
    });
    return [...dates].sort((a, b) => new Date(b) - new Date(a));
  }, [parameters]);
  
  // Set initial selected date to the most recent one
  useEffect(() => {
    if (allDates.length > 0 && !selectedDate) {
      setSelectedDate(allDates[0]);
    }
  }, [allDates, selectedDate]);
  
  // Format a date string
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Get latest values for summary view
  const getKeyParameters = () => {
    // Return up to 3 numeric parameters for the summary
    return parameters
      .filter(param => param.data_type === 'numeric')
      .slice(0, 3)
      .map(param => {
        const latestPoint = param.data_points.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )[0];
        
        const isAbnormal = latestPoint.is_abnormal;
        
        return {
          name: param.parameter_name,
          value: latestPoint.value,
          unit: param.parameter_unit,
          isAbnormal,
          date: latestPoint.date
        };
      });
  };
  
  // Group parameters by type for better organization
  const groupedParameters = React.useMemo(() => {
    return parameters.reduce((acc, param) => {
      const dataType = param.data_type || 'numeric';
      if (!acc[dataType]) {
        acc[dataType] = [];
      }
      acc[dataType].push(param);
      return acc;
    }, {});
  }, [parameters]);

  // Check if any parameter has abnormal values
  const hasAbnormalValues = parameters.some(param => 
    param.data_points.some(point => point.is_abnormal)
  );
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className={`p-4 ${hasAbnormalValues ? 'bg-red-50' : 'bg-gray-50'} cursor-pointer flex justify-between items-center`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-medium text-lg">{testType.name}</h3>
          <div className="text-sm text-gray-500">{testType.description}</div>
          
          {!isExpanded && (
            <div className="mt-2 flex flex-wrap gap-4">
              {getKeyParameters().map((param, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-600">{param.name}:</span>
                  <span 
                    className={`ml-1 font-semibold ${param.isAbnormal ? 'text-red-600' : 'text-gray-800'}`}
                  >
                    {param.value} {param.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          {hasAbnormalValues && (
            <span className="mr-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Abnormal
            </span>
          )}
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* Date selector */}
          {allDates.length > 1 && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Test Date
              </label>
              <select 
                className="border rounded px-3 py-2 w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {allDates.map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Parameters section */}
          <div className="space-y-8">
            {/* Numeric parameters */}
            {groupedParameters.numeric && groupedParameters.numeric.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Measurements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedParameters.numeric.map(param => (
                    <ParameterVisualizer
                      key={param.parameter_code}
                      parameter={param}
                      selectedDate={selectedDate}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Text parameters */}
            {groupedParameters.text && groupedParameters.text.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Reports</h4>
                {groupedParameters.text.map(param => (
                  <ParameterVisualizer 
                    key={param.parameter_code}
                    parameter={param}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            )}
            
            {/* Boolean parameters */}
            {groupedParameters.boolean && groupedParameters.boolean.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Yes/No Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedParameters.boolean.map(param => (
                    <ParameterVisualizer 
                      key={param.parameter_code}
                      parameter={param}
                      selectedDate={selectedDate}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Categorical parameters */}
            {groupedParameters.categorical && groupedParameters.categorical.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Categorical Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedParameters.categorical.map(param => (
                    <ParameterVisualizer 
                      key={param.parameter_code}
                      parameter={param}
                      selectedDate={selectedDate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

TestTypePanel.propTypes = {
  testType: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      parameter_name: PropTypes.string.isRequired,
      parameter_code: PropTypes.string.isRequired,
      parameter_unit: PropTypes.string,
      data_type: PropTypes.string,
      reference_range: PropTypes.object,
      data_points: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
          is_abnormal: PropTypes.bool
        })
      ).isRequired
    })
  ),
  initialExpandedState: PropTypes.bool
};

export default TestTypePanel;