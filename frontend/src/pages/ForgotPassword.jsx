import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../store/api/authApi';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // RTK Query hook for forgot password
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email).unwrap();
      setMessage(response.message || 'If an account with this email exists, a password reset link has been sent.');
      setErrorMessage('');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      setErrorMessage(error.data?.error || error.message || 'Something went wrong. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center font-mono">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-4">Enter your email, and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Success or Error Message */}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-lg transition duration-300`}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Remembered your password?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;