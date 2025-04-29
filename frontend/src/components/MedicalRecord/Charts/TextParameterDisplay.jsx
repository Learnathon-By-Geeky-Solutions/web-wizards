import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaHistory, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGetParameterTextHistoryQuery } from '../../../services/testParameterApi';

const TextParameterDisplay = ({ 
  parameterId, 
  testResultId,
  parameterName, 
  textValue, 
  date, 
  showHistory 
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  
  const { 
    data: historyData, 
    isLoading: historyLoading, 
    isError: historyError 
  } = useGetParameterTextHistoryQuery(
    { parameterId, excludeCurrentId: testResultId },
    { skip: !showHistoryPanel }
  );

  // Check if the text is long enough to need expansion
  const isLongText = textValue && textValue.length > 300;
  const displayText = showFullText ? textValue : (textValue ? `${textValue.slice(0, 300)}...` : '');
  const formattedDate = date ? format(new Date(date), 'MMM d, yyyy') : 'Unknown date';

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">{formattedDate}</span>
          {showHistory && (
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FaHistory className="mr-1" />
              {showHistoryPanel ? 'Hide History' : 'Show History'}
            </button>
          )}
        </div>
        
        <div className="whitespace-pre-wrap text-sm text-gray-800">
          {displayText || <span className="italic text-gray-400">No text data available</span>}
        </div>
        
        {isLongText && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            {showFullText ? (
              <>
                <FaChevronUp className="mr-1" /> Show Less
              </>
            ) : (
              <>
                <FaChevronDown className="mr-1" /> Read More
              </>
            )}
          </button>
        )}
      </div>

      {/* History panel */}
      {showHistoryPanel && (
        <div className="border-t p-4 bg-gray-50">
          <h5 className="font-medium mb-3 text-gray-700">History</h5>
          
          {historyLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : historyError ? (
            <div className="text-red-500 text-center py-4">
              Failed to load history data
            </div>
          ) : !historyData || historyData.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No previous records found
            </div>
          ) : (
            <div className="space-y-4">
              {historyData.map((record) => (
                <div key={record.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {format(new Date(record.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {record.text_value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

TextParameterDisplay.propTypes = {
  parameterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  testResultId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parameterName: PropTypes.string.isRequired,
  textValue: PropTypes.string,
  date: PropTypes.string,
  showHistory: PropTypes.bool
};

export default TextParameterDisplay;