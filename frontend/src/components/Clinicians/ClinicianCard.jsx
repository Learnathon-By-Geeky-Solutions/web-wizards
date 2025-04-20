import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaVideo, FaUserMd, FaMapMarkerAlt, FaCalendarCheck } from 'react-icons/fa';

const ClinicianCard = ({ clinician, onViewDetails }) => {
  // Default image if not provided
  const profileImage = clinician.profile_image || '/assets/default-doctor.png';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={profileImage} 
          alt={`Dr. ${clinician.name}`} 
          className="w-full h-48 object-cover"
        />
        {clinician.is_accepting_patients && (
          <span className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
            Accepting patients
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{`Dr. ${clinician.name}`}</h3>
        
        <div className="mt-1 flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`${
                  i < Math.floor(clinician.average_rating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                } h-4 w-4`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">
            ({clinician.review_count || 0})
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <FaUserMd className="mt-1 mr-2 text-teal-500" />
            <div className="text-sm text-gray-600">
              {clinician.specializations?.map(spec => spec.name).join(', ') || 'General Medicine'}
            </div>
          </div>
          
          <div className="flex items-start">
            <FaMapMarkerAlt className="mt-1 mr-2 text-teal-500" />
            <div className="text-sm text-gray-600">
              {clinician.city}
              {clinician.address && `, ${clinician.address}`}
            </div>
          </div>
          
          {clinician.available_online && (
            <div className="flex items-center">
              <FaVideo className="mr-2 text-teal-500" />
              <span className="text-sm text-gray-600">Online consultations available</span>
            </div>
          )}
          
          {clinician.next_available && (
            <div className="flex items-center">
              <FaCalendarCheck className="mr-2 text-teal-500" />
              <span className="text-sm text-gray-600">Next available: {clinician.next_available}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-teal-600 font-semibold">
            {clinician.consultation_fee 
              ? `$${clinician.consultation_fee}`
              : 'Fee varies'
            }
          </span>
          <button
            onClick={() => onViewDetails(clinician.id)}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

ClinicianCard.propTypes = {
  clinician: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    profile_image: PropTypes.string,
    specializations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    average_rating: PropTypes.number,
    review_count: PropTypes.number,
    city: PropTypes.string,
    address: PropTypes.string,
    available_online: PropTypes.bool,
    is_accepting_patients: PropTypes.bool,
    next_available: PropTypes.string,
    consultation_fee: PropTypes.number,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ClinicianCard;