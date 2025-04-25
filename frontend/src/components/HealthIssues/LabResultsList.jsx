import React from 'react';
import PropTypes from 'prop-types';
import { FaFlask, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetHealthIssueLabResultsQuery } from '../../store/api/healthIssuesApi';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Component to display a list of laboratory results for a health issue
 */
const LabResultsList = ({ healthIssueId }) => {
  const { data: labResults, isLoading, error } = useGetHealthIssueLabResultsQuery(healthIssueId, {
    skip: !healthIssueId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading laboratory results data.</p>
      </div>
    );
  }

  if (!labResults || labResults.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col items-center justify-center py-8">
          <FaFlask className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">No laboratory results added yet.</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Add your lab test results to keep track of important health metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labResults.map((labResult) => (
              <tr key={labResult.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{labResult.test_name}</div>
                  <div className="text-sm text-gray-500">{labResult.lab_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {labResult.result} {labResult.unit}
                  </div>
                  {labResult.reference_range && (
                    <div className="text-xs text-gray-500">
                      Reference: {labResult.reference_range}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {new Date(labResult.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Link
                      to={`/health-issues/${healthIssueId}/labs/${labResult.id}/edit`}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <FaEdit />
                    </Link>
                    {labResult.file_url && (
                      <a
                        href={labResult.file_url}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload />
                      </a>
                    )}
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {/* Delete functionality */ }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LabResultsList.propTypes = {
  healthIssueId: PropTypes.string.isRequired
};

export default LabResultsList;