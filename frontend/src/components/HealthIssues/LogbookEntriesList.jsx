import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';
import { useGetHealthIssueLogbookEntriesQuery } from '../../store/api/healthIssuesApi';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Component to display logbook entries for a health issue
 */
const LogbookEntriesList = ({ healthIssueId }) => {
  const { data: entries, isLoading, error } = useGetHealthIssueLogbookEntriesQuery(healthIssueId, {
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
        <p className="text-red-700">Error loading logbook entries.</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col items-center justify-center py-8">
          <FaBook className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">No logbook entries found.</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Track your health journey by adding notes, observations, and daily health status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{entry.title || 'Entry'}</h3>
              <p className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
                {entry.time && ` at ${entry.time}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/health-issues/${healthIssueId}/logbook/${entry.id}/edit`}
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
          </div>
          
          {entry.mood && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-700 mr-2">Mood:</span>
              <span className="text-sm font-medium">{entry.mood}</span>
            </div>
          )}
          
          {entry.pain_level && (
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-700 mr-2">Pain level:</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{entry.pain_level}/10</span>
                <div className="bg-gray-200 h-2 w-24 rounded-full">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(entry.pain_level / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {entry.content && (
            <div className="mt-3">
              <p className="text-gray-800 whitespace-pre-line">{entry.content}</p>
            </div>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {entry.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

LogbookEntriesList.propTypes = {
  healthIssueId: PropTypes.string.isRequired
};

export default LogbookEntriesList;