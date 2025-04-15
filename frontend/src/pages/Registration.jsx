import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/authApi';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  
  const navigate = useNavigate();
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  // RTK Query hook for user registration
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await registerUser(data).unwrap();
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Watch the password field to detect changes
  const password = watch('password');

  return (
    <section className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="bg-blue-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
            <input
              id="fullName"
              type="text"
              {...register('fullName', { required: 'Full Name is required' })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Full Name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
            <input
              id="phone"
              type="tel"
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Phone number must be 10 digits',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Phone"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Password"
              onFocus={() => setShowPasswordRequirements(true)} // Show requirements when the field is focused
              onBlur={() => {
                if (!password || password.length === 0) {
                  setShowPasswordRequirements(false); // Hide requirements if the field is empty
                }
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            {showPasswordRequirements && (
              <p className="text-xs text-gray-600 mt-2">
                Password must contain:
                <ul className="list-disc list-inside">
                  <li>At least 8 characters</li>
                  <li>At least one Uppercase character (A-Z)</li>
                  <li>At least one Lowercase character (a-z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one Special character (+|!@#$%^&* etc.)</li>
                </ul>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium mb-2">Gender</label>
            <select
              id="gender"
              {...register('Gender', { required: 'Gender is required' })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Gender"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.Gender && (
              <p className="text-red-500 text-sm mt-1">{errors.Gender.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth', { required: 'Date of Birth is required' })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Date of Birth"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Updates Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('updates')}
                className="form-checkbox mr-2"
              />
              <span className="text-sm">
                Receive timely updates with the latest medical news and healthcare tips from us.
              </span>
            </label>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must agree to the terms' })}
                className="form-checkbox mr-2"
              />
              <span className="text-sm">
                By clicking here you agree with our Terms Of Use.
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
            )}
          </div>

          {/* Hidden User Type */}
          <input
            type="hidden"
            {...register('user_type')}
            value="Patient"
          />
          <input
            type="hidden"
            {...register('blood_group')}
            value="A+"
          />
          <input
            type="hidden"
            {...register('blood_pressure')}
            value="120"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
