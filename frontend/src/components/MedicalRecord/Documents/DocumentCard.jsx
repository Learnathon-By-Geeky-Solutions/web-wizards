import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const DocumentCard = ({ document }) => {
  // Format the document date
  const formattedDate = document.document_date ? 
    format(new Date(document.document_date), 'MMM d, yyyy') : 
    'No date';

  // Define icon based on document type
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'LAB_REPORT':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'MEDICAL_REPORT':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'PRESCRIPTION':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'IMAGING':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  // Handle document view/download
  const handleViewDocument = () => {
    if (document.file) {
      window.open(document.file, '_blank');
    }
  };

  // Get document type display name
  const getDocumentTypeDisplay = (type) => {
    const typeMap = {
      'LAB_REPORT': 'Laboratory Report',
      'MEDICAL_REPORT': 'Medical Report',
      'PRESCRIPTION': 'Prescription',
      'IMAGING': 'Imaging',
      'OTHER': 'Other Document'
    };
    return typeMap[type] || 'Document';
  };

  // Handle health issue display safely
  const renderHealthIssue = () => {
    // If health_issue is an object with title property
    if (document.health_issue && typeof document.health_issue === 'object' && document.health_issue.title) {
      return (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {document.health_issue.title}
          </span>
        </div>
      );
    }
    // If there's no health issue or it's just an ID, don't render anything
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="text-blue-500 mr-3">
              {getDocumentIcon(document.document_type)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 truncate max-w-xs" title={document.title}>
                {document.title}
              </h3>
              <p className="text-sm text-gray-500">{getDocumentTypeDisplay(document.document_type)}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">{formattedDate}</span>
        </div>

        {document.description && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2" title={document.description}>
              {document.description}
            </p>
          </div>
        )}

        {renderHealthIssue()}

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleViewDocument}
            className="text-sm inline-flex items-center text-blue-600 hover:text-blue-800"
            disabled={!document.file}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>

          {document.test_results && document.test_results.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              OCR Results
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

DocumentCard.propTypes = {
  document: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    document_type: PropTypes.string.isRequired,
    document_date: PropTypes.string,
    file: PropTypes.string,
    health_issue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired
      })
    ]),
    test_results: PropTypes.array
  }).isRequired
};

export default DocumentCard;