import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ParameterLineChart from './ParameterLineChart';
import TextParameterDisplay from './TextParameterDisplay';

const TestTypePanel = ({ testType, parameters, initialExpandedState = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpandedState);
  
  // Group parameters by data type for organization
  const numericParameters = parameters.filter(p => p.parameter_data_type === 'numeric');
  const textParameters = parameters.filter(p => p.parameter_data_type === 'text');
  const otherParameters = parameters.filter(
    p => !['numeric', 'text'].includes(p.parameter_data_type)
  );
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Panel header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-medium text-lg">
            {testType.name}
          </h3>
          <p className="text-sm text-gray-600">
            {testType.code} {testType.category && `• ${testType.category}`}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      {/* Panel content - only shown when expanded */}
      {isExpanded && (
        <div className="border-t p-4">
          {testType.description && (
            <p className="text-gray-600 mb-4 text-sm">{testType.description}</p>
          )}
          
          {/* Numeric parameters with charts */}
          {numericParameters.length > 0 && (
            <div className="space-y-6">
              {numericParameters.map((param) => (
                <div key={param.parameter} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-700">
                    {param.parameter_name}
                    {param.parameter_unit && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({param.parameter_unit})
                      </span>
                    )}
                  </h4>
                  
                  <div className="h-64 bg-white rounded p-2 border">
                    <ParameterLineChart 
                      dataPoints={param.data_points}
                      parameterUnit={param.parameter_unit}
                      referenceRange={param.reference_range}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Text parameters */}
          {textParameters.length > 0 && (
            <div className="space-y-6 mt-6">
              <h4 className="font-medium text-gray-700 border-b pb-2">
                Text Reports
              </h4>
              
              {textParameters.map((param) => (
                <div key={param.parameter} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {param.parameter_name}
                  </h4>
                  
                  {param.data_points && param.data_points.length > 0 ? (
                    <TextParameterDisplay
                      parameterId={param.parameter}
                      testResultId={param.data_points[0].test_result_id}
                      parameterName={param.parameter_name}
                      textValue={param.data_points[0].value}
                      date={param.data_points[0].date}
                      showHistory={param.data_points.length > 1}
                    />
                  ) : (
                    <div className="bg-white p-4 border rounded text-center text-gray-500">
                      No report data available
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Other parameters */}
          {otherParameters.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2 border-b pb-2">
                Other Parameters
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherParameters.map((param) => (
                  <div key={param.parameter} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium">
                      {param.parameter_name}
                      {param.parameter_unit && (
                        <span className="text-gray-500 text-sm ml-1">
                          ({param.parameter_unit})
                        </span>
                      )}
                    </h5>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      {param.parameter_data_type === 'boolean' ? 'Yes/No value' : 
                       param.parameter_data_type === 'categorical' ? 'Category selection' :
                       'Custom data format'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {parameters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No parameters available for this test type
            </div>
          )}
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
      parameter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      parameter_name: PropTypes.string.isRequired,
      parameter_code: PropTypes.string,
      parameter_unit: PropTypes.string,
      parameter_data_type: PropTypes.string,
      reference_range: PropTypes.object,
      data_points: PropTypes.array
    })
  ).isRequired,
  initialExpandedState: PropTypes.bool
};

export default TestTypePanel;