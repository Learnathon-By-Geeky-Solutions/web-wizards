import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import TestParameterChart from './TestParameterChart';
import BooleanParameter from './ParameterTypes/BooleanParameter';
import TextParameter from './ParameterTypes/TextParameter';
import CategoricalParameter from './ParameterTypes/CategoricalParameter';

const ParameterVisualizer = ({ parameter, selectedDate }) => {
  // Get appropriate data points based on data type and selected date
  const getFilteredDataPoints = () => {
    if (!parameter.data_points || parameter.data_points.length === 0) {
      return [];
    }
    
    // If we're showing a trend chart for numeric data, return all points
    if (parameter.data_type === 'numeric') {
      return parameter.data_points.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // For non-numeric data or when a date is selected, return only the point for that date
    if (selectedDate) {
      const point = parameter.data_points.find(p => p.date === selectedDate);
      return point ? [point] : [];
    }
    
    // Default: return the most recent point
    return [parameter.data_points.sort((a, b) => new Date(b.date) - new Date(a.date))[0]];
  };
  
  const dataPoints = getFilteredDataPoints();
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // If no data points, show empty state
  if (dataPoints.length === 0) {
    return (
      <div className="border rounded p-4 mb-4">
        <h4 className="font-medium">{parameter.parameter_name}</h4>
        <div className="text-gray-500 text-sm mt-2">No data available for this date</div>
      </div>
    );
  }
  
  // Render different visualizations based on parameter type
  switch (parameter.data_type) {
    case 'numeric':
      return (
        <div>
          <TestParameterChart 
            data={dataPoints}
            label={parameter.parameter_name}
            unit={parameter.parameter_unit || ''}
            referenceRange={
              parameter.reference_range && 
              parameter.reference_range.min !== undefined && 
              parameter.reference_range.max !== undefined
                ? [parameter.reference_range.min, parameter.reference_range.max]
                : null
            }
          />
        </div>
      );
      
    case 'boolean':
      return (
        <BooleanParameter 
          name={parameter.parameter_name}
          value={dataPoints[0].value}
          date={dataPoints[0].date}
          isAbnormal={dataPoints[0].is_abnormal}
        />
      );
      
    case 'text':
      return (
        <TextParameter 
          name={parameter.parameter_name}
          value={dataPoints[0].value}
          date={dataPoints[0].date}
          isAbnormal={dataPoints[0].is_abnormal}
        />
      );
      
    case 'categorical':
      return (
        <CategoricalParameter 
          name={parameter.parameter_name}
          value={dataPoints[0].value}
          date={dataPoints[0].date}
          isAbnormal={dataPoints[0].is_abnormal}
          possibleValues={parameter.reference_range?.possible_values || []}
        />
      );
      
    default:
      return (
        <div className="border rounded p-4 mb-4">
          <h4 className="font-medium">{parameter.parameter_name}</h4>
          <div className="mt-2">
            <div className="text-lg">
              {dataPoints[0].value} 
              {parameter.parameter_unit ? ` ${parameter.parameter_unit}` : ''}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatDate(dataPoints[0].date)}
            </div>
          </div>
        </div>
      );
  }
};

ParameterVisualizer.propTypes = {
  parameter: PropTypes.shape({
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
  }).isRequired,
  selectedDate: PropTypes.string
};

export default ParameterVisualizer;