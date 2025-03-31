import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';

/**
 * Initialize Sentry with your DSN and configuration options
 * @param {Object} options - Configuration options to override defaults
 */
export const initSentry = (options = {}) => {
  // Read configuration from environment variables
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development';
  const dsn = import.meta.env.VITE_SENTRY_DSN || '';
  const tracesSampleRate = parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) || (environment === 'production' ? 0.2 : 1.0);
  const enableInDev = import.meta.env.VITE_SENTRY_ENABLE_DEV === 'true';
  
  // Check if Sentry should be enabled
  const enabled = environment === 'production' || enableInDev;
  
  // If DSN is not provided and not in production, disable Sentry
  if (!dsn && environment !== 'production') {
    console.info('Sentry is disabled because no DSN is provided');
    return;
  }
  
  // Default configuration
  const defaultConfig = {
    dsn: dsn,
    environment,
    // Modern way to configure integrations for Sentry v9.8.0
    integrations: [
      // Performance integrations
      browserTracingIntegration({
        tracingOrigins: ['localhost', 'amarhealth.tech', /^\//],
      }),
      Sentry.replayIntegration(),
    ],
    // Configure performance tracing
    tracesSampleRate: tracesSampleRate,
    // Configure profiling
    profilesSampleRate: environment === 'production' ? 0.1 : 0.5,
    enabled: enabled,
    
    // Only collect data from specified domains
    allowUrls: ['amarhealth.tech', 'localhost:5173', '127.0.0.1:5173'],
    
    // Prevent collection of user IP addresses
    ipAnonymization: true,
    
    // Release version
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Configure beforeSend to customize or drop events
    beforeSend(event) {
      // Don't send events related to browser extensions
      if (event.request && event.request.url && event.request.url.match(/^chrome-extension:\/\//)) {
        return null;
      }
      
      // Remove sensitive data from the event
      if (event.request && event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }
      
      return event;
    },
  };
  
  // Initialize Sentry with merged configuration
  Sentry.init({
    ...defaultConfig,
    ...options,
  });
  
  // Log initialization in development
  if (environment !== 'production') {
    console.info(`Sentry initialized with environment: ${environment}`);
  }
};

/**
 * Capture an exception in Sentry
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context to add to the error
 */
export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    // Add any additional context
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    
    // Capture the exception
    Sentry.captureException(error);
  });
};

/**
 * Capture a message in Sentry
 * @param {string} message - The message to capture
 * @param {Object} context - Additional context to add to the message
 * @param {string} level - The severity level (info, warning, error)
 */
export const captureMessage = (message, context = {}, level = 'info') => {
  Sentry.withScope((scope) => {
    // Add any additional context
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    
    // Set the level
    scope.setLevel(level);
    
    // Capture the message
    Sentry.captureMessage(message);
  });
};

/**
 * Add breadcrumb to the current scope
 * @param {Object} breadcrumb - The breadcrumb to add
 */
export const addBreadcrumb = (breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Set user information for the current scope
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  Sentry.setUser(user);
};

/**
 * Creates an error boundary component
 * @param {Object} options - Configuration options
 * @returns {Component} - Error boundary component
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

/**
 * Wraps a component with error boundary
 * @param {Component} component - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {Component} - Wrapped component
 */
export const withErrorBoundary = Sentry.withErrorBoundary;

// Export all of Sentry for direct use if needed
export { Sentry };