import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVerifyEmailQuery, useResendVerificationEmailMutation } from '../store/api/authApi';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState('');
  
  // RTK Query hooks
  const { data, error, isLoading } = useVerifyEmailQuery(token, {
    skip: !token,
  });
  const [resendVerificationEmail, { isLoading: isResending, isSuccess: isResendSuccess }] = 
    useResendVerificationEmailMutation();

  // Determine the state to display
  const isSuccess = data && data.message;
  const isError = error && (error.status === 400 || error.status === 404);
  const errorMessage = error?.data?.error || "We couldn't verify your email. The link may be invalid or expired.";
  
  // Handle resend verification
  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    try {
      // Remove frontend_url as it's now handled by backend environment variables
      await resendVerificationEmail({ 
        email: emailAddress
      });
    } catch (err) {
      console.error("Error resending verification email:", err);
    }
  };
  
  useEffect(() => {
    // If no token is provided, probably user came directly to this page
    if (!token) {
      // Could redirect to login or show resend form directly
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Verifying your email address...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        {isSuccess ? (
          <>
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p>{data.message}</p>
            </div>
            <Link 
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Proceed to Login
            </Link>
          </>
        ) : isError ? (
          <>
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p>{errorMessage}</p>
            </div>
            
            {/* Resend verification form */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Need a new verification link?</h3>
              {isResendSuccess ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                  <p>Verification email has been sent. Please check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          // Fallback UI if neither success nor error state
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Invalid Request</h2>
            <p>Something went wrong while processing your verification.</p>
            <Link 
              to="/login"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;