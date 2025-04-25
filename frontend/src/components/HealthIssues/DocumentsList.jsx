import React from 'react';
import PropTypes from 'prop-types';
import { FaFileAlt, FaEdit, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetHealthIssueDocumentsQuery } from '../../store/api/healthIssuesApi';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Component to display a list of medical documents for a health issue
 */
const DocumentsList = ({ healthIssueId }) => {
  const { data: documents, isLoading, error } = useGetHealthIssueDocumentsQuery(healthIssueId, {
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
        <p className="text-red-700">Error loading documents.</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col items-center justify-center py-8">
          <FaFileAlt className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">No documents added yet.</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Upload medical reports, prescriptions, or other relevant documents.
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
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{document.title}</div>
                  {document.description && (
                    <div className="text-sm text-gray-500">{document.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {document.document_type || 'Document'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {new Date(document.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-3">
                    <a
                      href={document.file_url}
                      className="text-blue-600 hover:text-blue-900"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download"
                    >
                      <FaDownload />
                    </a>
                    {document.can_preview && (
                      <Link
                        to={`/documents/${document.id}/preview`}
                        className="text-teal-600 hover:text-teal-900"
                        title="Preview"
                      >
                        <FaEye />
                      </Link>
                    )}
                    <Link
                      to={`/health-issues/${healthIssueId}/documents/${document.id}/edit`}
                      className="text-teal-600 hover:text-teal-900"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {/* Delete functionality */ }}
                      title="Delete"
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

DocumentsList.propTypes = {
  healthIssueId: PropTypes.string.isRequired
};

export default DocumentsList;