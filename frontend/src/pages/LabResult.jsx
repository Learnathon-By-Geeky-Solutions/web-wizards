import React, { useState } from 'react';
import { FaPlus, FaFilter, FaChartLine } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import TestHistoryViewer from '../components/MedicalRecord/TestResults/TestHistoryViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  useGetTestTypesQuery, 
  useGetTestResultsQuery,
  useCreateTestResultMutation,
  useUploadLabDocumentMutation 
} from '../store/api/labResultsApi';

const LabResult = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [newTestData, setNewTestData] = useState({
    testType: '',
    testDate: '',
    document: null
  });
  
  const user = useSelector((state) => state.user.user);
  
  // RTK Query hooks
  const { data: testTypes = [], isLoading: isLoadingTestTypes } = useGetTestTypesQuery();
  const { 
    data: testResults = [], 
    isLoading: isLoadingTestResults,
    refetch: refetchTestResults
  } = useGetTestResultsQuery({
    test_type: selectedTestType,
    start_date: startDate,
    end_date: endDate
  });
  
  const [createTestResult] = useCreateTestResultMutation();
  const [uploadLabDocument] = useUploadLabDocumentMutation();

  const handleFilterChange = () => {
    refetchTestResults();
  };

  const handleSubmitTestResult = async (e) => {
    e.preventDefault();
    
    if (newTestData.document) {
      const formData = new FormData();
      formData.append('document', newTestData.document);
      formData.append('test_type', newTestData.testType);
      formData.append('test_date', newTestData.testDate);
      
      try {
        await uploadLabDocument(formData).unwrap();
        setShowModal(false);
        setNewTestData({
          testType: '',
          testDate: '',
          document: null
        });
      } catch (error) {
        console.error('Failed to upload document:', error);
      }
    } else {
      try {
        await createTestResult({
          test_type: newTestData.testType,
          performed_at: newTestData.testDate,
        }).unwrap();
        setShowModal(false);
        setNewTestData({
          testType: '',
          testDate: '',
          document: null
        });
      } catch (error) {
        console.error('Failed to create test result:', error);
      }
    }
  };

  const renderParameterValue = (parameter) => {
    const value = parameter.value;
    const unit = parameter.unit;
    const isAbnormal = parameter.is_abnormal;
    
    return (
      <div key={parameter.name} className={`mb-2 ${isAbnormal ? 'text-red-600 font-bold' : ''}`}>
        <span className="font-medium">{parameter.name}:</span>{' '}
        {value} {unit}
        {isAbnormal && <span className="ml-2 text-sm">(Abnormal)</span>}
      </div>
    );
  };

  const isLoading = isLoadingTestTypes || isLoadingTestResults;

  if (isLoading) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lab Results</h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <FaChartLine /> {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
        
        {/* Show test history viewer when showHistory is true */}
        {showHistory && (
          <div className="mb-8">
            <TestHistoryViewer />
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-2 mb-6 p-4 border rounded bg-white">
          <div className="flex items-center gap-1">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <select 
            className="border rounded px-3 py-2 bg-white"
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
          >
            <option value="">All test types</option>
            {testTypes.map(type => (
              <option key={type.code} value={type.code}>{type.name}</option>
            ))}
          </select>
          
          <input 
            type="date" 
            className="border rounded px-3 py-2 bg-white" 
            placeholder="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <input 
            type="date" 
            className="border rounded px-3 py-2 bg-white" 
            placeholder="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} 
          />
          
          <button 
            onClick={handleFilterChange}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply
          </button>
        </div>

        {testResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <p className="text-gray-500 text-lg">
              No lab results found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testResults.map(result => (
              <div key={result.test_id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{result.test_type}</h2>
                    <p className="text-gray-500">
                      Test Date: {new Date(result.performed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {result.test_code}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Parameters:</h3>
                  <div className="space-y-1">
                    {Object.values(result.parameters).map(param => renderParameterValue(param))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaPlus className="h-6 w-6" />
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Lab Result</h2>
            <form onSubmit={handleSubmitTestResult} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Test Type</label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={newTestData.testType}
                  onChange={(e) => setNewTestData({...newTestData, testType: e.target.value})}
                  required
                >
                  <option value="">Select a test type</option>
                  {testTypes.map(type => (
                    <option key={type.code} value={type.code}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Test Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2"
                  value={newTestData.testDate}
                  onChange={(e) => setNewTestData({...newTestData, testDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Upload Document</label>
                <input 
                  type="file" 
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => setNewTestData({...newTestData, document: e.target.files[0]})}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a lab report for automatic data extraction
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResult;