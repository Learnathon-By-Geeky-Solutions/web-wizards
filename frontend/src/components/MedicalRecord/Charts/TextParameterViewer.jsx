import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { useGetTextParameterResultsQuery } from '../../../services/testParameterApi';

const TextParameterViewer = ({ parameterId, testName }) => {
  const {
    data: parameterData,
    isLoading,
    isError,
    error
  } = useGetTextParameterResultsQuery(parameterId);

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{testName || 'Text Parameter Result'}</h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{testName || 'Text Parameter Result'}</h2>
        </div>
        <div className="bg-red-50 p-4 rounded text-red-600">
          Failed to load results: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!parameterData || !parameterData.data_points || parameterData.data_points.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{testName || 'Text Parameter Result'}</h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          No results available
        </div>
      </div>
    );
  }

  // Sort data points by date (newest first)
  const sortedDataPoints = [...parameterData.data_points].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {testName || parameterData.parameter_name}
        </h2>
        {sortedDataPoints.length > 0 && (
          <div className="text-sm text-gray-500">
            Latest: {formatDate(sortedDataPoints[0].date)}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sortedDataPoints.map((result, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between mb-2">
              <div className="font-medium">{formatDate(result.date)}</div>
              {result.is_abnormal && (
                <span className="text-red-600 text-sm">Abnormal</span>
              )}
            </div>
            
            {/* Render the text value with proper formatting */}
            <div className="whitespace-pre-wrap text-gray-700">
              {result.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination for many results */}
      {sortedDataPoints.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-teal-600 text-sm hover:underline">
            Show all {sortedDataPoints.length} results
          </button>
        </div>
      )}
    </div>
  );
};

TextParameterViewer.propTypes = {
  parameterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  testName: PropTypes.string,
};

export default TextParameterViewer;