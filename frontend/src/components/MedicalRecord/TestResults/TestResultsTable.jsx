import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaFileDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const TestResultsTable = () => {
  const [testResults, setTestResults] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    testType: '',
    startDate: '',
    endDate: '',
    showAbnormalOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch test types and results
  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const response = await axios.get('/api/medical-records/test-types/');
        setTestTypes(response.data);
      } catch (error) {
        console.error('Error fetching test types:', error);
      }
    };

    fetchTestTypes();
    fetchTestResults();
  }, []);

  // Fetch test results with applied filters
  const fetchTestResults = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.testType) params.test_type = filters.testType;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      
      const response = await axios.get('/api/medical-records/test-results/', { params });
      setTestResults(response.data);
    } catch (error) {
      console.error('Error fetching test results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchTestResults();
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      testType: '',
      startDate: '',
      endDate: '',
      showAbnormalOnly: false
    });
    fetchTestResults();
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get count of abnormal parameters in a test result
  const getAbnormalCount = (testResult) => {
    if (!testResult.parameters) return 0;
    return testResult.parameters.filter(param => param.is_abnormal).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Test Results</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          <FaFilter /> Filter Results
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
                Test Type
              </label>
              <select
                id="testType"
                className="w-full border-gray-300 rounded-md"
                value={filters.testType}
                onChange={(e) => setFilters({...filters, testType: e.target.value})}
              >
                <option value="">All Test Types</option>
                {testTypes.map(type => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full border-gray-300 rounded-md"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full border-gray-300 rounded-md"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input
              id="showAbnormalOnly"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={filters.showAbnormalOnly}
              onChange={(e) => setFilters({...filters, showAbnormalOnly: e.target.checked})}
            />
            <label htmlFor="showAbnormalOnly" className="ml-2 block text-sm text-gray-700">
              Show only results with abnormal parameters
            </label>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading test results...</p>
        </div>
      ) : testResults.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameters
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abnormal Values
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testResults
                  .filter(result => !filters.showAbnormalOnly || getAbnormalCount(result) > 0)
                  .map(result => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.test_type?.name}</div>
                        <div className="text-xs text-gray-500">{result.test_type?.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(result.performed_at)}</div>
                        {result.lab_name && <div className="text-xs text-gray-500">{result.lab_name}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.parameters?.length || 0} parameters</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getAbnormalCount(result) > 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {getAbnormalCount(result)} abnormal
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.document ? (
                          <Link 
                            to={`/documents/${result.document.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            {result.document.title} <FaExternalLinkAlt size={12} />
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">Manual entry</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            title="View details"
                          >
                            View
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            title="Export PDF"
                          >
                            <FaFileDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <p className="text-gray-500">No test results found. Try changing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default TestResultsTable;