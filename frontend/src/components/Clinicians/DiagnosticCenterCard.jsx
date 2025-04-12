import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaHospital, FaMapMarkerAlt, FaClock, FaAmbulance } from 'react-icons/fa';

const DiagnosticCenterCard = ({ center, onViewDetails }) => {
  // Default image if not provided
  const centerImage = center.image || '/assets/default-center.png';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={centerImage} 
          alt={center.name} 
          className="w-full h-48 object-cover"
        />
        {center.is_24_hours && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Open 24 Hours
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{center.name}</h3>
        
        <div className="mt-1 flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`${
                  i < Math.floor(center.average_rating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                } h-4 w-4`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">
            ({center.review_count || 0})
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <FaHospital className="mt-1 mr-2 text-blue-500" />
            <div className="text-sm text-gray-600">
              {center.services?.join(', ') || 'Laboratory Services'}
            </div>
          </div>
          
          <div className="flex items-start">
            <FaMapMarkerAlt className="mt-1 mr-2 text-blue-500" />
            <div className="text-sm text-gray-600">
              {center.city}
              {center.address && `, ${center.address}`}
            </div>
          </div>
          
          {!center.is_24_hours && center.operating_hours && (
            <div className="flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              <span className="text-sm text-gray-600">{center.operating_hours}</span>
            </div>
          )}
          
          {center.has_home_collection && (
            <div className="flex items-center">
              <FaAmbulance className="mr-2 text-blue-500" />
              <span className="text-sm text-gray-600">Home collection available</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            {center.price_range 
              ? center.price_range
              : 'Price varies by test'
            }
          </span>
          <button
            onClick={() => onViewDetails(center.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            View Center
          </button>
        </div>
      </div>
    </div>
  );
};

DiagnosticCenterCard.propTypes = {
  center: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    services: PropTypes.arrayOf(PropTypes.string),
    average_rating: PropTypes.number,
    review_count: PropTypes.number,
    city: PropTypes.string,
    address: PropTypes.string,
    is_24_hours: PropTypes.bool,
    operating_hours: PropTypes.string,
    has_home_collection: PropTypes.bool,
    price_range: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default DiagnosticCenterCard;