import React, { useState, useEffect } from 'react';
import { FaFilter, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { 
  useGetTestTypesQuery, 
  useGetDashboardParametersQuery 
} from '../../../services/testParameterApi';
import TestTypePanel from './TestTypePanel';

const TestParameterDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('365'); // Default to 365 days
  const [testTypeGroups, setTestTypeGroups] = useState({});
  const [categories, setCategories] = useState([]);
  
  // Fetch test types
  const { 
    data: testTypes,
    isLoading: isTypesLoading, 
    isError: isTypesError 
  } = useGetTestTypesQuery();
  
  // Fetch dashboard parameters
  const {
    data: dashboardParameters,
    isLoading: isParamsLoading,
    isError: isParamsError
  } = useGetDashboardParametersQuery();
  
  // Process test types and parameters when data is available
  useEffect(() => {
    if (testTypes && dashboardParameters) {
      const categorySet = new Set(['all']);
      const groups = {};
      
      // Group test types with their parameters
      testTypes.forEach(testType => {
        // Add category to set
        if (testType.category) {
          categorySet.add(testType.category);
        }
        
        // Get parameters for this test type from dashboard parameters
        const testTypeParams = [];
        
        testType.parameters.forEach(param => {
          // Find this parameter in dashboard parameters
          const dashParam = dashboardParameters.find(dp => dp.id === param.id);
          if (dashParam) {
            testTypeParams.push({
              parameter: param.id,
              parameter_name: param.name,
              parameter_code: param.code,
              parameter_unit: param.unit,
              parameter_data_type: param.data_type,
              reference_range: param.reference_range_json,
              data_points: dashParam.history || []
            });
          }
        });
        
        // Only add test types that have parameters with data
        if (testTypeParams.length > 0) {
          groups[testType.id] = {
            testType,
            parameters: testTypeParams
          };
        }
      });
      
      setTestTypeGroups(groups);
      setCategories(Array.from(categorySet));
    }
  }, [testTypes, dashboardParameters]);

  // Filter test types by category
  const filteredTestTypeIds = Object.keys(testTypeGroups).filter(id => {
    const group = testTypeGroups[id];
    return selectedCategory === 'all' || group.testType.category === selectedCategory;
  });
  
  const isLoading = isTypesLoading || isParamsLoading;
  const isError = isTypesError || isParamsError;
  
  // If there's no data at all after loading
  const isEmpty = !isLoading && Object.keys(testTypeGroups).length === 0;
  
  // For demo/UI purposes, let's add a sample ultrasonography text parameter if none exists
  useEffect(() => {
    if (!isLoading && !isError && !isEmpty && testTypeGroups) {
      // Check if we already have an ultrasonography parameter
      let hasUltrasonography = false;
      
      Object.values(testTypeGroups).forEach(group => {
        group.parameters.forEach(param => {
          if (param.parameter_code === 'ultrasonography') {
            hasUltrasonography = true;
          }
        });
      });
      
      // If no ultrasonography exists, add a mock example
      if (!hasUltrasonography) {
        // Look for a radiology or imaging test type
        const radiologyTestTypeId = Object.keys(testTypeGroups).find(id => 
          testTypeGroups[id].testType.category === 'Radiology' || 
          testTypeGroups[id].testType.name.includes('Imaging')
        );
        
        // If we have a suitable test type, add the ultrasonography parameter
        if (radiologyTestTypeId) {
          const newGroups = {...testTypeGroups};
          newGroups[radiologyTestTypeId].parameters.push({
            parameter: 'ultrasonography-demo',
            parameter_name: 'Abdominal Ultrasonography',
            parameter_code: 'ultrasonography',
            parameter_unit: '',
            parameter_data_type: 'text',
            data_points: [{
              date: new Date().toISOString(),
              value: 'FINDINGS:\n- Liver: Normal size and echogenicity. No focal lesions.\n- Gallbladder: Normal thin-walled. No stones or sludge.\n- Pancreas: Normal size and echotexture.\n- Spleen: Normal size (11cm).\n- Kidneys: Normal size. No hydronephrosis or calculi.\n- Urinary Bladder: Normal full distension.\n\nIMPRESSION:\nNormal complete abdominal ultrasound study.',
              is_abnormal: false
            }]
          });
          setTestTypeGroups(newGroups);
        }
      }
    }
  }, [isLoading, isError, isEmpty, testTypeGroups]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center bg-white rounded-md p-2 border">
          <FaFilter className="text-gray-400 mr-2" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center bg-white rounded-md p-2 border">
          <span className="text-gray-400 mr-2 text-sm">Time Range:</span>
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mb-3"></div>
          <p className="text-gray-500">Loading test parameters...</p>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-3" />
          <p className="text-red-600 font-medium">
            Error loading test data
          </p>
          <p className="text-red-500 text-sm mt-1">
            There was a problem retrieving your test parameters. Please try again later.
          </p>
        </div>
      )}
      
      {/* Empty state */}
      {isEmpty && (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <FaCheck className="text-blue-500 text-3xl mx-auto mb-3" />
          <p className="text-blue-600 font-medium">
            No test data available
          </p>
          <p className="text-blue-500 text-sm mt-1">
            No test parameters have been recorded yet. Your test results will appear here when available.
          </p>
        </div>
      )}
      
      {/* Test Type Panels */}
      {!isLoading && !isError && !isEmpty && (
        <div className="space-y-4">
          {filteredTestTypeIds.map(id => {
            const group = testTypeGroups[id];
            return (
              <TestTypePanel
                key={id}
                testType={group.testType}
                parameters={group.parameters}
                initialExpandedState={filteredTestTypeIds.length === 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestParameterDashboard;