# Sentry Integration Guide

This document explains how to use the Sentry error tracking and monitoring system integrated in this application.

## What is Sentry?

Sentry is an error tracking and performance monitoring platform that helps developers identify, fix, and optimize their code. It provides real-time error reporting, detailed error context, and performance metrics to help you understand how your application is performing.

Key features:
- Real-time error tracking with detailed stack traces
- Performance monitoring and transaction tracing
- Release tracking and source map integration
- User feedback and session replay
- Integration with development workflows
- Customizable alerts and notifications

## How We've Implemented Sentry

We've integrated Sentry in a modular way, making it easy to use throughout the application while also giving you control over what gets tracked. Our integration includes:

### 1. Core Sentry Utilities (`/src/utils/sentry.js`)

A central configuration file that handles Sentry initialization and provides utility functions for exception tracking, user identification, and more.

```javascript
// Import Sentry utilities
import { 
  captureException, 
  captureMessage, 
  addBreadcrumb, 
  setUser 
} from './utils/sentry';

// Track an error
captureException(error, { extra: { context: 'additional info' } });

// Log a message
captureMessage('User completed checkout', { level: 'info' });

// Add breadcrumb
addBreadcrumb({
  category: 'ui.click',
  message: 'User clicked checkout button',
  level: 'info'
});

// Set user information
setUser({
  id: '123',
  email: 'user@example.com',
  username: 'username'
});
```

### 2. Error Boundaries (`/src/components/common/SentryErrorBoundary.jsx`)

React error boundaries that catch and report errors, while showing a friendly fallback UI to users.

```jsx
// Wrap the entire app
<SentryErrorBoundary>
  <App />
</SentryErrorBoundary>

// Or use the HOC to wrap individual components
import { withSentryErrorBoundary } from '../components/common/withSentryErrorBoundary';

export default withSentryErrorBoundary(MyComponent);
```

### 3. Custom Hook for Tracking (`/src/hooks/useSentryTracking.js`)

A React hook that makes it easy to add standardized tracking to any component.

```jsx
import useSentryTracking from '../hooks/useSentryTracking';

function MyComponent() {
  // Initialize tracking
  const tracking = useSentryTracking('MyComponent', {
    metadata: { someContext: 'value' }
  });
  
  const handleButtonClick = () => {
    // Track user action
    tracking.trackAction('Button clicked', { buttonId: 'save' });
    
    // Track successful operation
    tracking.trackSuccess('Data saved');
  };
  
  // Rest of component...
}
```

### 4. Performance Monitoring (`/src/utils/performanceMonitoring.js`)

Utilities for tracking application performance.

```javascript
import PerformanceMonitoring from '../utils/performanceMonitoring';

// Track an operation's performance
async function fetchData() {
  return PerformanceMonitoring.trackOperation('fetchUserData', async () => {
    const result = await api.getUserData();
    return result;
  });
}

// Track component render performance
function MyComponent() {
  useEffect(() => {
    const finishTracking = PerformanceMonitoring.trackComponentRender('MyComponent');
    return finishTracking;
  }, []);
  
  // Rest of component...
}
```

### 5. API Client with Sentry Integration (`/src/utils/apiClient.js`)

An API client wrapper that automatically tracks requests and reports errors.

```javascript
import SentryApiClient from '../utils/apiClient';

// Make API requests with automatic error tracking
async function fetchUserData() {
  try {
    const data = await SentryApiClient.get('/api/users/profile');
    return data;
  } catch (error) {
    // Error already tracked by SentryApiClient
    console.error('Failed to fetch user data');
    throw error;
  }
}
```

## Configuration

Sentry is configured via environment variables in `.env` files:

```bash
# Required - Your Sentry DSN from sentry.io
VITE_SENTRY_DSN=https://your-dsn-from-sentry.io/project-id

# Optional - Enable Sentry in development (default: false)
VITE_SENTRY_ENABLE_DEV=false

# Optional - Sampling rate for performance monitoring (0.0 to 1.0)
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2

# Optional - Profiling sample rate (0.0 to 1.0)
VITE_SENTRY_PROFILES_SAMPLE_RATE=0.1

# Optional - Environment name (default: from import.meta.env.MODE)
VITE_SENTRY_ENVIRONMENT=development
```

## Recent Updates (March 2025)

We've updated our Sentry implementation to use the latest approaches from Sentry:

1. **Modern Integrations**: We now use `BrowserTracing`, `BrowserProfilingIntegration`, and `ReactIntegration` directly from `@sentry/react` instead of the deprecated `BrowserTracing` from `@sentry/tracing`.

2. **No Separate Tracing Package**: The `@sentry/tracing` package is no longer needed as all tracing functionality is now included in the main `@sentry/react` package.

3. **Enhanced Performance Monitoring**: Added profiling capabilities with configurable sample rates.

## Best Practices

1. **Error Boundaries**:
   - Use error boundaries around critical components
   - Provide meaningful fallback UIs

2. **Exception Tracking**:
   - Add context to errors with the `captureException` function
   - Use try/catch blocks to handle errors gracefully

3. **User Information**:
   - Set user information after login
   - Clear user information after logout

4. **Breadcrumbs**:
   - Add breadcrumbs for important user actions
   - Include relevant context data

5. **Performance**:
   - Use `PerformanceMonitoring` for critical operations
   - Keep sample rates lower in production

6. **Privacy**:
   - Don't log sensitive information (passwords, tokens)
   - Use the beforeSend hook to filter data if needed

## Troubleshooting

- **Sentry not capturing errors?** Check that `VITE_SENTRY_DSN` is set correctly
- **Too many events?** Adjust the `VITE_SENTRY_TRACES_SAMPLE_RATE` and `VITE_SENTRY_PROFILES_SAMPLE_RATE` to lower values
- **Need to test in development?** Set `VITE_SENTRY_ENABLE_DEV=true`

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [React SDK Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)