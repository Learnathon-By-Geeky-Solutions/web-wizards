import React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '../../utils/sentry';

/**
 * A custom error boundary component that uses Sentry
 * Shows a fallback UI when an error occurs in its children
 */
const SentryErrorBoundary = ({ children, fallback }) => {
  return (
    <ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto my-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-red-600 mb-4">
            {error.toString()}
            {process.env.NODE_ENV === 'development' && (
              <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
                {componentStack}
              </pre>
            )}
          </p>
          
          {/* If there's a custom fallback, render it */}
          {fallback}
          
          <div className="mt-4">
            <button
              onClick={resetError}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

SentryErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default SentryErrorBoundary;