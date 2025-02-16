import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftIcon,
  CalendarIcon,
  Cog6ToothIcon,
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
        onClick={() => {/* Add your schedule appointment logic here */}}
      >
        <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Schedule Appointment
      </button>
    </div>
  </output>
);

const Appointments = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Basic states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const isLoading = false;

  // Current user information
  const currentUser = 'Faysal0009';
  const currentDateTime = '2025-02-16 11:09:10';
  
  // Since we're not using setAppointments, we can just use a constant
  const appointments = [];

  const handleProfileInfoClick = () => {
    alert(`Profile Info\nName: ${user?.name}\nEmail: ${user?.email}`);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getFirstLetter = (name) => name?.[0].toUpperCase();

  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Medical record', icon: ClipboardDocumentIcon },
    { name: 'Health Issues', icon: HeartIcon },
    { name: 'Medications', icon: ClipboardDocumentIcon },
    { name: 'Clinicians', icon: UserGroupIcon },
    { name: 'Chat', icon: ChatBubbleOvalLeftIcon },
    { name: 'Appointments', icon: CalendarIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  if (isLoading) {
    return (
      <output className="p-4">
        Loading...
      </output>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-teal-900 text-white p-4 space-y-4" aria-label="Main navigation">
        <h1 className="text-2xl font-bold">Amarhealth</h1>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center p-3 space-x-3 w-full rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label={item.name}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Appointments</h2>
            <output className="text-sm text-gray-600">
              {currentDateTime}
            </output>
          </div>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label={`User menu for ${currentUser}`}
            >
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
                {getFirstLetter(currentUser)}
              </div>
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <output className="px-4 py-2 text-sm text-gray-900 border-b block font-medium">
                  {currentUser}
                </output>
                <button
                  onClick={handleProfileInfoClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  role="menuitem"
                >
                  Profile Info
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Filter Section */}
        <div className="flex justify-end items-center mb-6">
          <select 
            className="border rounded px-3 py-2 bg-white text-gray-700 w-48"
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value)}
            aria-label="Filter appointments"
          >
            <option value="all">All Appointments</option>
            <option value="completed">Completed Appointments</option>
            <option value="pending">Pending Appointments</option>
          </select>
        </div>

        {/* Appointments Content */}
        <section 
          className="bg-white rounded-lg shadow p-6"
          aria-label="Appointments list"
        >
          {appointments.length === 0 ? (
            <EmptyState 
              currentUser={currentUser}
              appointmentFilter={appointmentFilter}
            />
          ) : (
            <output className="block">
              {/* Appointments would be rendered here when available */}
            </output>
          )}
        </section>
      </main>
    </div>
  );
};

export default Appointments;