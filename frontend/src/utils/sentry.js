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
  
  // Configure replay sample rates with defaults if not set in env
  const replaysSessionSampleRate = parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) || 0.1;
  const replaysOnErrorSampleRate = parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE) || 1.0;
  
  // Check if Sentry should be enabled
  const enabled = environment === 'production' || enableInDev;
  
  // Default configuration
  const defaultConfig = {
    dsn: dsn,
    environment,
    enabled,
    integrations: [
      browserTracingIntegration({
        tracingOrigins: ['localhost', 'amarhealth.tech', /^\//],
      }),
      Sentry.replayIntegration({
        sessionSampleRate: replaysSessionSampleRate,
        onErrorSampleRate: replaysOnErrorSampleRate,
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: tracesSampleRate,
    replaysSessionSampleRate: replaysSessionSampleRate,
    replaysOnErrorSampleRate: replaysOnErrorSampleRate,
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
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
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