import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useGetTextParameterResultsQuery } from '../../services/testParameterApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const TextParameterViewer = ({ parameterId, timeframe = 30, patientId = null }) => {
  const [selectedResultId, setSelectedResultId] = useState(null);
  
  const { 
    data: results, 
    isLoading, 
    isError, 
    error 
  } = useGetTextParameterResultsQuery({ 
    parameterId, 
    days: timeframe,
    patientId
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.data?.message || 'Failed to load text results'} />;
  if (!results || results.length === 0) {
    return <div className="p-4 text-gray-500">No reports available for this parameter.</div>;
  }

  // Sort results by date, newest first
  const sortedResults = [...results].sort((a, b) => 
    new Date(b.performed_at) - new Date(a.performed_at)
  );
  
  // If no result is selected, select the most recent one
  const activeResultId = selectedResultId || sortedResults[0].id;
  const activeResult = sortedResults.find(r => r.id === activeResultId);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{activeResult.parameter_name}</h3>
        <div className="text-sm text-gray-600 mb-2">
          Test Type: <span className="font-medium">{activeResult.test_type_name}</span>
        </div>
      </div>

      {sortedResults.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Report Date:
          </label>
          <select 
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            value={activeResultId}
            onChange={(e) => setSelectedResultId(parseInt(e.target.value))}
          >
            {sortedResults.map(result => (
              <option key={result.id} value={result.id}>
                {format(new Date(result.performed_at), 'MMM d, yyyy')}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="border rounded-md p-4 bg-gray-50">
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-600">
            Date: {format(new Date(activeResult.performed_at), 'MMM d, yyyy')}
          </span>
          {activeResult.is_abnormal && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Abnormal
            </span>
          )}
        </div>
        
        <div className="prose max-w-none">
          {/* For simple text display */}
          {!activeResult.text_value.includes('<') && (
            <p className="whitespace-pre-wrap">{activeResult.text_value}</p>
          )}
          
          {/* For HTML content (if the system supports rich text) */}
          {activeResult.text_value.includes('<') && (
            <div 
              className="whitespace-pre-wrap" 
              dangerouslySetInnerHTML={{ __html: activeResult.text_value }}
            />
          )}
        </div>

        {activeResult.metadata && Object.keys(activeResult.metadata).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(activeResult.metadata).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="text-sm font-medium text-gray-500">{key}</dt>
                  <dd className="text-sm text-gray-900">{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

TextParameterViewer.propTypes = {
  parameterId: PropTypes.number.isRequired,
  timeframe: PropTypes.number,
  patientId: PropTypes.number
};

export default TextParameterViewer;