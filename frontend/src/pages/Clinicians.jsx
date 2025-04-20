import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Clinicians = () => {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo clinicians data
  const [clinicians] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      hospital: 'Central Hospital',
      availability: 'Mon, Wed, Fri',
      rating: 4.8,
      image: null
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Endocrinologist',
      hospital: 'City Medical Center',
      availability: 'Tue, Thu',
      rating: 4.9,
      image: null
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialty: 'General Physician',
      hospital: 'Community Healthcare',
      availability: 'Mon-Fri',
      rating: 4.7,
      image: null
    }
  ]);

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
      
      <div className="flex-1 ml-64 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clinicians</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search clinicians..."
              className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clinicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicians.map((clinician) => (
            <div
              key={clinician.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                {clinician.image ? (
                  <img
                    src={clinician.image}
                    alt={clinician.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-16 h-16 text-gray-400" />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{clinician.name}</h2>
                  <p className="text-teal-600">{clinician.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Hospital:</span> {clinician.hospital}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Available:</span> {clinician.availability}
                </p>
                <div className="flex items-center">
                  <span className="font-medium text-gray-600">Rating:</span>
                  <span className="ml-2 text-yellow-500">{clinician.rating}/5.0</span>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors">
                Schedule Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clinicians;