import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaChartLine, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetHealthIssueChartsQuery } from '../../store/api/healthIssuesApi';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Component to display a list of charts/measurements for a health issue
 */
const ChartsList = ({ healthIssueId }) => {
  const { data: charts, isLoading, error } = useGetHealthIssueChartsQuery(healthIssueId, {
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
        <p className="text-red-700">Error loading charts data.</p>
      </div>
    );
  }

  if (!charts || charts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col items-center justify-center py-8">
          <FaChartLine className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">No measurements or charts added yet.</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Track your health metrics by adding measurements.
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
                Measurement Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
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
            {charts.map((chart) => (
              <tr key={chart.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{chart.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {chart.value} {chart.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {new Date(chart.date).toLocaleDateString()}
                    {chart.time && ` at ${chart.time}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Link
                      to={`/health-issues/${healthIssueId}/charts/${chart.id}/edit`}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <FaEdit />
                    </Link>
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

ChartsList.propTypes = {
  healthIssueId: PropTypes.string.isRequired
};

export default ChartsList;