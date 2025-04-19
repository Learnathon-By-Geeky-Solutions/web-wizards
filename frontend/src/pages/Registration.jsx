import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation, useCheckEmailExistsMutation } from '../store/api/authApi';
import debounce from 'lodash.debounce';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    setError,
    clearErrors,
    trigger
  } = useForm({
    mode: 'onChange' // Enable real-time validation
  });
  
  const navigate = useNavigate();
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  
  // Password validation states
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  // RTK Query hooks for registration and email checking
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [checkEmail] = useCheckEmailExistsMutation();

  // Initialize gender field with an empty string to prevent null
  useEffect(() => {
    setValue('gender', '');
  }, [setValue]);

  // Handle form submission with error handling
  const onSubmit = async (data) => {
    try {
      // Clear any previous registration errors
      setRegistrationError('');
      
      // Remove frontend_url as it's now handled by backend environment variables
      
      // Save email for confirmation screen
      setUserEmail(data.email);
      
      // If email is not available, prevent submission
      if (isEmailAvailable === false) {
        setError('email', { 
          type: 'manual', 
          message: 'This email is already registered' 
        });
        return;
      }
      
      // Ensure confirmPassword is properly named for backend
      if (!data.confirmPassword) {
        data.confirmPassword = data.password;
      }
      
      // Fix potential gender field naming issue - the backend expects "gender" rather than "Gender"
      if (data.Gender && !data.gender) {
        data.gender = data.Gender;
      }
      
      // Log the data being sent to help with debugging
      console.log('Submitting registration data:', data);
      
      const response = await registerUser(data).unwrap();
      console.log('Registration successful:', response);
      
      // Show success message
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages from the backend
      if (error?.data?.error) {
        setRegistrationError(error.data.error);
      } else if (error?.data?.detail) {
        setRegistrationError(error.data.detail);
      } else if (error?.status === 400) {
        setRegistrationError('Please check your information and try again.');
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
      
      // Set field-specific errors if returned from backend
      if (error?.data?.email) {
        setError('email', { type: 'manual', message: error.data.email });
      }
      if (error?.data?.password) {
        setError('password', { type: 'manual', message: error.data.password });
      }
      if (error?.data?.name) {
        setError('fullName', { type: 'manual', message: error.data.name });
      }
    }
  };

  // Watch the password and confirmPassword fields
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  
  // Debounced function to check email existence
  const debouncedCheckEmail = useCallback(
    debounce(async (email) => {
      if (!email || email.length < 5 || !email.includes('@')) {
        setIsEmailChecking(false);
        setIsEmailAvailable(null);
        return;
      }
      
      try {
        setIsEmailChecking(true);
        const result = await checkEmail(email).unwrap();
        setIsEmailAvailable(!result.exists);
        
        // Set or clear email error
        if (result.exists) {
          setError('email', { 
            type: 'manual', 
            message: 'This email is already registered' 
          });
        } else {
          clearErrors('email');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setIsEmailAvailable(null);
      } finally {
        setIsEmailChecking(false);
      }
    }, 500),
    [checkEmail, setError, clearErrors]
  );
  
  // Effect to check email availability when user types
  const email = watch('email');
  useEffect(() => {
    if (email) {
      debouncedCheckEmail(email);
    } else {
      setIsEmailAvailable(null);
    }
    
    return () => {
      debouncedCheckEmail.cancel();
    };
  }, [email, debouncedCheckEmail]);
  
  // Check password requirements whenever the password changes
  useEffect(() => {
    if (password) {
      setShowPasswordRequirements(true);
      setPasswordRequirements({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      });
      
      // Validate confirm password if it exists
      if (confirmPassword) {
        setPasswordsMatch(password === confirmPassword);
      }
    } else if (!password) {
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword]);
  
  // Check if passwords match whenever confirmPassword changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
      
      if (password !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [confirmPassword, password, setError, clearErrors]);

  // Validate form before submission
  const validateFormBeforeSubmit = async () => {
    const result = await trigger();
    return result;
  };

  // If registration successful, show verification screen
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <span className="font-semibold">{userEmail}</span>.
            Please check your inbox and follow the link to verify your email address.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-blue-700">
              <span className="font-bold">Note:</span> You need to verify your email before you can log in.
            </p>
          </div>
          <Link 
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Your Account</h1>
        <p className="text-center text-gray-600 mb-6">Fill in your information to get started</p>
        
        {/* Display registration error if any */}
        {registrationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {registrationError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error('Validation errors:', errors);
          setRegistrationError('Please fix the highlighted errors before submitting.');
        })} noValidate>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Smith"
                {...register('fullName', { required: 'Full Name is required' })}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                  {isEmailChecking && (
                    <span className="ml-2 inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
                  )}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 
                    ${isEmailAvailable === true ? 'border-green-500' : 
                      isEmailAvailable === false ? 'border-red-500' : 'border-gray-300'}`}
                />
                {isEmailAvailable === true && !errors.email && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email is available
                  </p>
                )}
                {isEmailAvailable === false && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Email is already registered
                  </p>
                )}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="12345678900"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^\d{11}$/,
                      message: '11 digits required',
                    },
                  })}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Password must meet all requirements below',
                  },
                })}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onFocus={() => setShowPasswordRequirements(true)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="grid grid-cols-2 gap-1">
                    <div className={`flex items-center text-xs ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordRequirements.length ? '✓' : '○'}</span>
                      8+ characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordRequirements.uppercase ? '✓' : '○'}</span>
                      Uppercase (A-Z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordRequirements.lowercase ? '✓' : '○'}</span>
                      Lowercase (a-z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordRequirements.number ? '✓' : '○'}</span>
                      Number (0-9)
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordRequirements.special ? '✓' : '○'}</span>
                      Special (@$!%*?&)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500
                  ${passwordsMatch === true ? 'border-green-500' : 
                    passwordsMatch === false ? 'border-red-500' : 'border-gray-300'}`}
              />
              {passwordsMatch === true && confirmPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Passwords match
                </p>
              )}
              {passwordsMatch === false && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Passwords do not match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender - Fixed field name for consistency with backend */}
              <div>
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  {...register('gender', { required: 'Please select a gender' })}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            {/* Updates Checkbox */}
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('updates')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Receive medical news and healthcare tips from us
                </span>
              </label>
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must agree to the terms' })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 mt-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading || isEmailAvailable === false}
              onClick={() => validateFormBeforeSubmit()}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
