import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { FaExclamationTriangle } from 'react-icons/fa';

// Error fallback component that displays when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto my-8">
      <div className="flex items-center mb-4 text-red-600">
        <FaExclamationTriangle className="mr-2 text-2xl" />
        <h2 className="text-xl font-bold">Something went wrong</h2>
      </div>
      
      <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded">
        <p className="text-red-800 font-medium">{error.message}</p>
      </div>
      
      <p className="mb-4 text-gray-600">
        We apologize for the inconvenience. You can try the following:
      </p>
      
      <ul className="list-disc pl-5 mb-4 text-gray-700">
        <li>Refresh the page</li>
        <li>Go back and try again</li>
        <li>Contact support if the issue persists</li>
      </ul>
      
      <div className="flex space-x-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
};

// Reusable error boundary component
const ErrorBoundary = ({ children, onReset, ...props }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      {...props}
    >
      {children}
    </ReactErrorBoundary>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func
};

export default ErrorBoundary;