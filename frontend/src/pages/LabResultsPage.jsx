import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaTags, FaTable, FaChartLine } from 'react-icons/fa';
import ParameterDashboard from '../components/MedicalRecord/TestResults/ParameterDashboard';
import TestResultsTable from '../components/MedicalRecord/TestResults/TestResultsTable';

const LabResultsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recentTests, setRecentTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/medical-records/test-results/', {
          params: { limit: 5 }
        });
        setRecentTests(response.data);
      } catch (error) {
        console.error('Error fetching recent tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTests();
  }, []);

  return (
    <>
      <Helmet>
        <title>Lab Results | Ibn Sina Health Portal</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaChevronLeft className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Results</h1>
          <p className="mt-1 text-gray-500">View and track your lab test results over time</p>
        </div>
        
        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center`}
            >
              <FaChartLine className="mr-2" />
              Parameter Dashboard
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center`}
            >
              <FaTable className="mr-2" />
              All Results
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center`}
            >
              <FaTags className="mr-2" />
              Test Categories
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && (
            <ParameterDashboard />
          )}
          
          {activeTab === 'results' && (
            <TestResultsTable />
          )}
          
          {activeTab === 'categories' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Test Categories</h2>
              <p className="text-gray-500 mb-6">
                Browse lab results by test category
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['HEMATOLOGY', 'BIOCHEMISTRY', 'ENDOCRINOLOGY', 'IMMUNOLOGY', 'MICROBIOLOGY', 'URINALYSIS'].map(category => (
                  <div 
                    key={category} 
                    className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium text-lg">{category}</h3>
                    <p className="text-sm text-gray-500 mt-1">View all {category.toLowerCase()} tests</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Recent uploads section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recent Lab Documents</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading recent documents...</p>
              </div>
            ) : recentTests.length > 0 ? (
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
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTests.map(test => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{test.test_type.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(test.performed_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {test.document ? (
                            <Link 
                              to={`/documents/${test.document.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {test.document.title}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">No document</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Processed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No recent lab documents found.</p>
                <Link 
                  to="/documents" 
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                >
                  Upload lab document
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LabResultsPage;