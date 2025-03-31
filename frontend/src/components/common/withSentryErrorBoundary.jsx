import React from 'react';
import { withErrorBoundary } from '../../utils/sentry';
import SentryErrorBoundary from './SentryErrorBoundary';

/**
 * Higher-order component that wraps a component with Sentry error boundary
 * This makes it easy to add error boundaries to individual components
 * 
 * @param {Component} Component - The component to wrap
 * @param {Object} options - Additional options for the error boundary
 * @returns {Component} The wrapped component
 */
export const withSentryErrorBoundary = (Component, options = {}) => {
  const componentName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props) => {
    return (
      <SentryErrorBoundary 
        fallback={options.fallback}
      >
        <Component {...props} />
      </SentryErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `WithSentryErrorBoundary(${componentName})`;
  
  return WrappedComponent;
};

/**
 * Alternative approach using Sentry's built-in withErrorBoundary 
 * for more advanced configuration
 */
export const withAdvancedErrorBoundary = (Component, options = {}) => {
  return withErrorBoundary(Component, {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Component Error
        </h2>
        <p className="text-red-600 mb-4">
          {error.toString()}
          {process.env.NODE_ENV === 'development' && (
            <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
              {componentStack}
            </pre>
          )}
        </p>
        {options.fallback}
        <div className="mt-4">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    ),
    ...options,
  });
};

export default withSentryErrorBoundary;