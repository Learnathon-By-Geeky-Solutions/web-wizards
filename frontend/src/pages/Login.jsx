import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useLoginMutation } from '../store/api/authApi';
import { useInitiateGoogleLoginMutation } from '../store/api/oauthApi';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  
  // RTK Query mutation hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [initiateGoogleLogin, { isLoading: isGoogleLoading }] = useInitiateGoogleLoginMutation();
  
  // Combined loading state
  const isLoading = isLoginLoading || isGoogleLoading;

  const onSubmit = async (data) => {
    try {
      // Use RTK Query login mutation instead of authService
      const result = await login(data).unwrap();
      
      // Explicitly update authentication state in context
      if (result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.data?.detail || error.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    
    // Use RTK Query mutation for Google login
    const redirectUri = `${window.location.origin}/google-callback`;
    initiateGoogleLogin(redirectUri).catch(error => {
      console.error('Failed to initiate Google login:', error);
      setErrorMessage('Failed to initiate Google login. Please try again.');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center font-mono">Log in</h2>
        {isLoading && (
          <div className="text-center mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Type your email address"
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

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Type your password"
              className={`w-full p-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Link to Registration Page */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/registration" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>

        {/* Social Login Buttons */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition duration-300"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-500">
          Forgot your password?
          <br />
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms Of Use
          </a>{' '}
          |{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          <br />
        </p>
      </div>
    </div>
  );
};

export default Login;