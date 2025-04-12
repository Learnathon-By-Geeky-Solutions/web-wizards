import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  fetchClinicianById, 
  fetchReviewsForClinician,
  submitReview
} from '../api/cliniciansApi';
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
  FaVideo, 
  FaArrowLeft 
} from 'react-icons/fa';
import profilePlaceholder from '../assets/profile-placeholder.png';

const ClinicianDetail = () => {
  const { id } = useParams();
  const [clinician, setClinician] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch clinician details and reviews
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch clinician details
        const clinicianData = await fetchClinicianById(id);
        setClinician(clinicianData);
        
        // Fetch reviews for this clinician
        const reviewsData = await fetchReviewsForClinician(id);
        setReviews(reviewsData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading clinician data:', err);
        setError('Failed to load clinician details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Handle submitting a new review
  const handleSubmitReview = async (reviewData) => {
    try {
      // Add clinician ID to the review data
      const reviewToSubmit = {
        ...reviewData,
        clinician: id
      };
      
      // Submit the review
      const newReview = await submitReview(reviewToSubmit);
      
      // Update the reviews list
      setReviews([newReview, ...reviews]);
      
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !clinician) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Clinician not found'}
          </div>
          <Link to="/clinicians" className="text-teal-500 hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Clinicians
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Back navigation */}
        <Link to="/clinicians" className="text-teal-500 hover:underline flex items-center mb-4">
          <FaArrowLeft className="mr-2" /> Back to Clinicians
        </Link>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section with basic info */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row">
              {/* Profile image */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <img 
                  src={clinician.image_url || profilePlaceholder} 
                  alt={clinician.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                />
              </div>
              
              {/* Basic info */}
              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{clinician.name}</h1>
                    {clinician.specializations && clinician.specializations.length > 0 && (
                      <p className="text-teal-600 font-medium">
                        {clinician.specializations.map(spec => spec.name).join(', ')}
                      </p>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="mt-2 md:mt-0 flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${clinician.is_accepting_patients ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm text-gray-700">
                      {clinician.is_accepting_patients ? 'Accepting new patients' : 'Not accepting new patients'}
                    </span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderRatingStars(clinician.average_rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {clinician.average_rating.toFixed(1)} ({clinician.rating_count} reviews)
                  </span>
                </div>
                
                {/* Experience */}
                {clinician.experience_years > 0 && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Experience:</span> {clinician.experience_years} years
                  </p>
                )}
                
                {/* Online consultation */}
                {clinician.available_online && (
                  <div className="flex items-center text-teal-600 mt-2">
                    <FaVideo className="mr-2" />
                    <span>Available for online consultation</span>
                  </div>
                )}
                
                {/* Consultation fee */}
                {clinician.consultation_fee && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Consultation Fee:</span> ${clinician.consultation_fee}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact & additional info */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
              
              {clinician.address && (
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                  <span className="text-gray-700">{clinician.address}</span>
                </div>
              )}
              
              {clinician.city && (
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 ml-6">{clinician.city}</span>
                </div>
              )}
              
              {clinician.phone && (
                <div className="flex items-center mb-2">
                  <FaPhone className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{clinician.phone}</span>
                </div>
              )}
              
              {clinician.email && (
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{clinician.email}</span>
                </div>
              )}
              
              {clinician.website && (
                <div className="flex items-center mb-2">
                  <FaGlobe className="text-gray-400 mr-2" />
                  <a 
                    href={clinician.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline"
                  >
                    {clinician.website}
                  </a>
                </div>
              )}
            </div>
            
            {/* Additional info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Additional Information</h2>
              
              {clinician.languages && (
                <div className="mb-2">
                  <span className="font-medium">Languages:</span> {clinician.languages}
                </div>
              )}
              
              {clinician.qualifications && (
                <div className="mb-2">
                  <span className="font-medium">Qualifications:</span>
                  <div className="pl-4 mt-1 text-gray-700">
                    {clinician.qualifications.split('\n').map((qual, index) => (
                      <p key={index} className="mb-1">{qual}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Description section */}
          {clinician.description && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{clinician.description}</p>
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
    </div>
  );
};

export default ClinicianDetail;