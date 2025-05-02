import React, { useState, useEffect } from 'react';
import { FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import ParameterHistory from './ParameterHistory';
import { useGetCommonParametersQuery } from '../../../store/api/medicalRecordsApi';

const ParameterDashboard = () => {
  const [filteredParameters, setFilteredParameters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  // Fetch parameters using RTK Query
  const { data: parameters = [], isLoading } = useGetCommonParametersQuery();

  // Extract unique categories from parameters
  useEffect(() => {
    if (parameters.length > 0) {
      const uniqueCategories = [...new Set(parameters.map(param => param.test_type?.category))].filter(Boolean);
      setCategories(uniqueCategories);
      setFilteredParameters(parameters);
    }
  }, [parameters]);

  // Apply filters when search query or category changes
  useEffect(() => {
    let filtered = parameters;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(param => 
        param.test_type?.category === selectedCategory
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(param => 
        param.name.toLowerCase().includes(query) || 
        param.code?.toLowerCase().includes(query) ||
        param.test_type?.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredParameters(filtered);
  }, [searchQuery, selectedCategory, parameters]);

  // Group parameters by test type
  const groupedParameters = filteredParameters.reduce((groups, parameter) => {
    const testTypeId = parameter.test_type?.id || 'unknown';
    if (!groups[testTypeId]) {
      groups[testTypeId] = {
        testType: parameter.test_type,
        parameters: []
      };
    }
    groups[testTypeId].parameters.push(parameter);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold">Parameter Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 block w-full"
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading parameters...</p>
        </div>
      ) : filteredParameters.length > 0 ? (
        <div className="space-y-8">
          {Object.values(groupedParameters).map(group => (
            <div key={group.testType?.id || 'unknown'} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                {group.testType?.name || 'Other Parameters'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.parameters.map(parameter => (
                  <div key={parameter.id} className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="bg-blue-50 p-3 border-b flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{parameter.name}</h4>
                        <p className="text-xs text-gray-500">
                          {parameter.code} • {parameter.unit}
                        </p>
                      </div>
                      {parameter.latest_value?.is_abnormal && (
                        <div className="text-amber-500" title="Latest value is abnormal">
                          <FaExclamationTriangle />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 h-[180px]">
                      <ParameterHistory parameterId={parameter.id} />
                    </div>
                    
                    <div className="bg-white p-3 border-t">
                      {parameter.latest_value ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Latest: {parameter.latest_value.value} {parameter.unit}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(parameter.latest_value.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-xs">
                            {parameter.reference_range && (
                              <p className="text-gray-500">Ref: {parameter.reference_range}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No data available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <p className="text-gray-500">No parameters found. Try changing your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default ParameterDashboard;