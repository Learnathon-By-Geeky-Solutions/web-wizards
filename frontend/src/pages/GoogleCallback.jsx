import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcessGoogleCallbackMutation } from '../store/api/oauthApi';
import LoadingScreen from '../components/common/LoadingScreen';
import { AuthContext } from '../context/authContextDefinition';

/**
 * Component to handle Google OAuth callback
 * Extracts the code from the URL and processes it using oauthApi
 */
const GoogleCallback = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [processGoogleCallback] = useProcessGoogleCallbackMutation();
  const { loginWithGoogle } = useContext(AuthContext);
  const codeProcessed = useRef(false); // Use ref to track if code has been processed

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Prevent double processing
        if (codeProcessed.current) {
          return;
        }

        // Extract authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('error');
          setError('No authorization code found in the URL.');
          return;
        }

        // Mark code as being processed
        codeProcessed.current = true;

        console.log("Processing Google OAuth callback...");

        // Get the current redirect URI (needed for OAuth verification)
        const redirectUri = `${window.location.origin}/google-callback`;
        console.log("Using redirect URI:", redirectUri);

        // Process the callback code using AuthContext
        await loginWithGoogle({
          code: code,
          redirectUri: redirectUri
        });
        
        setStatus('success');
        
        // Navigate to dashboard or intended destination
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } catch (err) {
        console.error("Google OAuth callback error:", err);
        setStatus('error');
        setError(err.data?.detail || err.message || 'Failed to process Google login');
        
        // Navigate back to login after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, loginWithGoogle]);

  // Component rendering based on status
  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <LoadingScreen size="large" />
        <h2 className="mt-4 text-xl font-medium">Processing Google login...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-medium text-red-600">Authentication Failed</h2>
        <p className="mt-2 text-gray-600">{error || 'An unexpected error occurred'}</p>
        <p className="mt-1 text-gray-500">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-medium text-green-600">Login Successful!</h2>
      <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
};

export default GoogleCallback;