import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import TestTypePanel from './TestTypePanel';

const GenericTestResult = ({ 
  testResults = [], // Array of test results with parameters
  isLoading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [groupedTests, setGroupedTests] = useState({});
  
  // Group test results by category and test type
  useEffect(() => {
    if (testResults && testResults.length) {
      const grouped = testResults.reduce((acc, test) => {
        const category = test.test_type.category || 'Uncategorized';
        
        if (!acc[category]) {
          acc[category] = [];
        }
        
        // Check if we already have this test type in the category
        const existingTestTypeIndex = acc[category].findIndex(
          t => t.id === test.test_type.id
        );
        
        if (existingTestTypeIndex >= 0) {
          // If this test type already exists, add parameters to it
          test.parameters.forEach(param => {
            const existingParamIndex = acc[category][existingTestTypeIndex].parameters.findIndex(
              p => p.parameter_code === param.parameter_code
            );
            
            if (existingParamIndex >= 0) {
              // Merge data points for existing parameter
              acc[category][existingTestTypeIndex].parameters[existingParamIndex].data_points = [
                ...acc[category][existingTestTypeIndex].parameters[existingParamIndex].data_points,
                ...param.data_points
              ].sort((a, b) => new Date(b.date) - new Date(a.date));
            } else {
              // Add new parameter
              acc[category][existingTestTypeIndex].parameters.push(param);
            }
          });
        } else {
          // Add new test type
          acc[category].push({
            id: test.test_type.id,
            name: test.test_type.name,
            code: test.test_type.code,
            description: test.test_type.description,
            category: test.test_type.category,
            parameters: test.parameters,
            dates: test.dates || []
          });
        }
        
        return acc;
      }, {});
      
      setGroupedTests(grouped);
    }
  }, [testResults]);
  
  // Get unique categories
  const categories = Object.keys(groupedTests);
  
  // Format a date string
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-500">
          Error loading test results: {error}
        </div>
      </div>
    );
  }
  
  if (!testResults || testResults.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Test Results</h2>
        <div className="mt-6 text-center text-gray-400 py-8">
          No Test Results Found
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Test Results</h2>
      
      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="mb-4 border-b">
          <div className="flex overflow-x-auto">
            <button
              key="all"
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 font-medium whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Categories
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`py-2 px-4 font-medium whitespace-nowrap ${
                  activeTab === category
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Test results by category */}
      {(activeTab === 'all' ? categories : [activeTab]).map(category => (
        <div key={category} className={activeTab === 'all' ? 'mb-8' : ''}>
          {activeTab === 'all' && (
            <h3 className="font-medium text-lg mb-3">{category}</h3>
          )}
          
          <div className="space-y-6">
            {groupedTests[category].map(testType => (
              <TestTypePanel
                key={testType.id}
                testType={testType}
                parameters={testType.parameters}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

GenericTestResult.propTypes = {
  testResults: PropTypes.arrayOf(
    PropTypes.shape({
      test_type: PropTypes.shape({
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
          reference_range: PropTypes.object,
          data_type: PropTypes.string,
          data_points: PropTypes.arrayOf(
            PropTypes.shape({
              date: PropTypes.string.isRequired,
              value: PropTypes.any.isRequired,
              is_abnormal: PropTypes.bool
            })
          ).isRequired
        })
      ).isRequired,
      dates: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default GenericTestResult;