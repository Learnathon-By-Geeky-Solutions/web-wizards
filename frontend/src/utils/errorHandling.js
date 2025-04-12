import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';

/**
 * Global error handler for API requests
 * @param {Error} error - The error object
 * @param {String} source - Source of the error (component name, API call, etc.)
 * @param {Object} context - Additional context information
 */
export const handleError = (error, source, context = {}) => {
  console.error(`Error in ${source}:`, error);
  
  // Capture the error with Sentry
  Sentry.captureException(error, {
    tags: {
      source: source,
    },
    contexts: {
      errorInfo: {
        ...context,
        message: error.message,
        stack: error.stack,
      },
    },
  });
  
  // Return user-friendly error message
  if (error.response) {
    // Server responded with error status
    if (error.response.status === 401) {
      return 'Authentication error. Please log in again.';
    } else if (error.response.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.response.status === 500) {
      return 'Server error. Please try again later.';
    } else if (error.response.data && error.response.data.detail) {
      return error.response.data.detail;
    }
  } else if (error.request) {
    // Request made but no response received (network error)
    return 'Network error. Please check your connection and try again.';
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 */
const ErrorBoundary = ({ children, fallback }) => {
  return (
    <Sentry.ErrorBoundary 
      fallback={fallback || DefaultErrorFallback}
      beforeCapture={(scope) => {
        scope.setLevel('error');
        scope.setTag('component', 'ErrorBoundary');
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

const DefaultErrorFallback = ({ error, resetError }) => {
  return (
    <div className="bg-red-50 border border-red-100 p-6 rounded-lg my-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-red-600 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="bg-white p-4 rounded border border-red-100 mb-4 overflow-auto max-h-40">
        <pre className="text-xs text-gray-700">{error.stack}</pre>
      </div>
      <button
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        onClick={resetError}
      >
        Try again
      </button>
    </div>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
};

DefaultErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetError: PropTypes.func.isRequired,
};

export default ErrorBoundary;