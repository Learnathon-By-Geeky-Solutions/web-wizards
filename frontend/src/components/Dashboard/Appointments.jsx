import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';
import UserProfile from '../Navbar/UserProfile';
import {
  CalendarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

// EmptyState Component
const EmptyState = ({ currentUser, appointmentFilter }) => (
  <output className="block text-center py-12">
    <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      No appointments for {currentUser}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {appointmentFilter === 'all' 
        ? "You don't have any appointments scheduled yet."
        : `No ${appointmentFilter.toLowerCase()} appointments found.`}
    </p>
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Schedule Appointment
      </button>
    </div>
  </output>
);

const Appointments = () => {
  const { user } = useContext(AuthContext);
  
  // States
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [isLoading] = useState(false);

  const currentDateTime = '2025-02-16 11:09:10';
  const appointments = [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
            <output className="text-sm text-gray-600">
              {currentDateTime}
            </output>
          </div>
          
          {/* Replace the old profile dropdown with UserProfile component */}
          <UserProfile />
        </header>

        {/* Filter Section */}
        <div className="flex justify-end items-center mb-6">
          <select 
            className="border rounded-lg px-4 py-2 bg-white text-gray-700 w-48 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value)}
          >
            <option value="all">All Appointments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Appointments Content */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          {appointments.length === 0 ? (
            <EmptyState 
              currentUser={user?.name}
              appointmentFilter={appointmentFilter}
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Appointments would be rendered here when available */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Appointments;