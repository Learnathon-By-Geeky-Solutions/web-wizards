import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authUser';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      
      const response = await loginUser(data);
      // Save token in localStorage (or sessionStorage)
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh); 
      console.log('Login successful:', response);
      login(response.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center font-mono">Log in</h2>
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
          <button className="w-full bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition duration-300">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
          <button className="w-full bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition duration-300">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />
            Sign in with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-500">
          <Link to="/terms" className="text-blue-500 hover:underline">
            Terms Of Use
          </Link>{' '}
          |{' '}
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
