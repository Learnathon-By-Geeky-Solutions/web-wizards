import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  useGetDiagnosticCenterByIdQuery,
  useGetReviewsForDiagnosticCenterQuery,
  useSubmitReviewMutation
} from '../store/api/cliniciansApi';
import ReviewList from '../components/Clinicians/ReviewList';
import ReviewForm from '../components/Clinicians/ReviewForm';
import Spinner from '../components/common/Spinner';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaClock, 
  FaHospital,
  FaArrowLeft 
} from 'react-icons/fa';
import hospitalPlaceholder from '../assets/hospital-placeholder.png';

const DiagnosticCenterDetail = () => {
  const { id } = useParams();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Use RTK Query hooks instead of direct API calls
  const { 
    data: center, 
    isLoading: isCenterLoading, 
    error: centerError 
  } = useGetDiagnosticCenterByIdQuery(id);
  
  const { 
    data: reviews = [], 
    isLoading: isReviewsLoading 
  } = useGetReviewsForDiagnosticCenterQuery(id);
  
  const [submitReviewMutation, { isLoading: isSubmittingReview }] = useSubmitReviewMutation();

  // Handle submitting a new review
  const handleSubmitReview = async (reviewData) => {
    try {
      // Add diagnostic center ID to the review data
      const reviewToSubmit = {
        ...reviewData,
        diagnostic_center: id
      };
      
      // Submit the review using the RTK Query mutation
      await submitReviewMutation(reviewToSubmit).unwrap();
      
      // Close the review form
      setShowReviewForm(false);
      
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      return false;
    }
  };

  // Display rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  const isLoading = isCenterLoading || isReviewsLoading;
  const error = centerError ? centerError.data?.detail || 'Failed to load diagnostic center details' : null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 p-6 flex justify-center items-center">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !center) {
    return (
      <MainLayout>
        <div className="flex-1 p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Diagnostic center not found'}
          </div>
          <Link to="/clinicians" className="text-teal-500 hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Diagnostic Centers
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 p-6">
        {/* Back navigation */}
        <Link to="/clinicians" className="text-teal-500 hover:underline flex items-center mb-4">
          <FaArrowLeft className="mr-2" /> Back to Diagnostic Centers
        </Link>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section with basic info */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row">
              {/* Center logo */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <img 
                  src={center.logo_url || hospitalPlaceholder} 
                  alt={center.name}
                  className="w-32 h-32 rounded object-cover mx-auto md:mx-0"
                />
              </div>
              
              {/* Basic info */}
              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{center.name}</h1>
                    <p className="text-teal-600 font-medium">Diagnostic Center</p>
                  </div>
                  
                  {/* Center highlights */}
                  <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                    {center.is_24_hours && (
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                        24 Hours
                      </span>
                    )}
                    {center.has_home_collection && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Home Collection
                      </span>
                    )}
                    {center.accepts_insurance && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        Insurance Accepted
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderRatingStars(center.average_rating || 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {typeof center.average_rating === 'number' ? center.average_rating.toFixed(1) : '0.0'} ({center.rating_count || 0} reviews)
                  </span>
                </div>
                
                {/* Opening hours */}
                {center.opening_hours && (
                  <div className="flex items-center mt-2">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{center.opening_hours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact & additional info */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
              
              {center.address && (
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                  <span className="text-gray-700">{center.address}</span>
                </div>
              )}
              
              {center.city && (
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 ml-6">{center.city}</span>
                </div>
              )}
              
              {center.phone && (
                <div className="flex items-center mb-2">
                  <FaPhone className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{center.phone}</span>
                </div>
              )}
              
              {center.email && (
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{center.email}</span>
                </div>
              )}
              
              {center.website && (
                <div className="flex items-center mb-2">
                  <FaGlobe className="text-gray-400 mr-2" />
                  <a 
                    href={center.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline"
                  >
                    {center.website}
                  </a>
                </div>
              )}
            </div>
            
            {/* Insurance info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Insurance Information</h2>
              
              <div className="mb-2">
                <span className="font-medium">Accepts Insurance:</span> {center.accepts_insurance ? 'Yes' : 'No'}
              </div>
              
              {center.insurance_details && (
                <div className="mb-2">
                  <span className="font-medium">Insurance Details:</span>
                  <p className="text-gray-700 mt-1">{center.insurance_details}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Services section */}
          {center.services && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-3">Services Offered</h2>
              <p className="text-gray-700 whitespace-pre-line">{center.services}</p>
            </div>
          )}
          
          {/* Description section */}
          {center.description && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{center.description}</p>
            </div>
          )}
          
          {/* Reviews section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Reviews ({reviews.length})</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>
            
            {/* Review form */}
            {showReviewForm && (
              <div className="mb-6">
                <ReviewForm onSubmit={handleSubmitReview} />
              </div>
            )}
            
            {/* Reviews list */}
            {reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to write a review!</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiagnosticCenterDetail;