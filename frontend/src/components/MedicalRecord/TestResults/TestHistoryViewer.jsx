import React, { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import ParameterHistory from './ParameterHistory';
import { useGetTestTypesQuery, useGetParametersQuery } from '../../../store/api/medicalRecordsApi';

const TestHistoryViewer = () => {
  const [selectedTestType, setSelectedTestType] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 6), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Fetch test types using RTK Query
  const { 
    data: testTypes = [], 
    isLoading: isLoadingTestTypes 
  } = useGetTestTypesQuery();

  // Fetch parameters for selected test type using RTK Query
  const { 
    data: parameters = [], 
    isLoading: isLoadingParameters 
  } = useGetParametersQuery(
    { test_type: selectedTestType }, 
    { skip: !selectedTestType }
  );

  // Set initial selected test type when data is loaded
  useEffect(() => {
    if (testTypes.length > 0 && !selectedTestType) {
      setSelectedTestType(testTypes[0].code);
    }
  }, [testTypes, selectedTestType]);

  // Set initial selected parameter when parameters are loaded
  useEffect(() => {
    if (parameters.length > 0 && !selectedParameter) {
      setSelectedParameter(parameters[0].code);
    } else if (parameters.length === 0) {
      setSelectedParameter('');
    }
  }, [parameters, selectedParameter]);

  const handleTestTypeChange = (e) => {
    setSelectedTestType(e.target.value);
    setSelectedParameter(''); // Reset parameter selection when test type changes
  };

  const handleParameterChange = (e) => {
    setSelectedParameter(e.target.value);
  };

  const getParameterName = () => {
    const param = parameters.find(p => p.code === selectedParameter);
    return param ? param.name : selectedParameter;
  };

  const isLoading = isLoadingTestTypes || isLoadingParameters;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-4">Test Result History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
              Test Type
            </label>
            <select
              id="testType"
              className="w-full border rounded-md p-2"
              value={selectedTestType}
              onChange={handleTestTypeChange}
              disabled={isLoading || testTypes.length === 0}
            >
              {testTypes.map(type => (
                <option key={type.code} value={type.code}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="parameter" className="block text-sm font-medium text-gray-700 mb-1">
              Parameter
            </label>
            <select
              id="parameter"
              className="w-full border rounded-md p-2"
              value={selectedParameter}
              onChange={handleParameterChange}
              disabled={isLoading || parameters.length === 0}
            >
              {parameters.map(param => (
                <option key={param.code} value={param.code}>{param.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="w-full border rounded-md p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="w-full border rounded-md p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {selectedParameter && (
        <ParameterHistory
          parameterCode={selectedParameter}
          testTypeCode={selectedTestType}
          title={getParameterName()}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
};

export default TestHistoryViewer;