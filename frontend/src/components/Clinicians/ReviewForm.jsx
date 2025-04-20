import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ onSubmit }) => {
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value,
    });
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setReviewData({
      ...reviewData,
      rating,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    // Validate review data
    if (!reviewData.title.trim()) {
      setError('Please provide a title for your review');
      setSubmitting(false);
      return;
    }
    
    if (!reviewData.comment.trim()) {
      setError('Please provide details in your review');
      setSubmitting(false);
      return;
    }
    
    try {
      // Submit review
      const result = await onSubmit(reviewData);
      
      if (result) {
        // Show success message
        setSuccess(true);
        // Reset form
        setReviewData({
          rating: 5,
          title: '',
          comment: '',
        });
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting your review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your review has been submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Rating selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl ${
                    star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                  } focus:outline-none mr-1`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
          
          {/* Title input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={reviewData.title}
              onChange={handleChange}
              placeholder="Summarize your experience"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              maxLength="100"
            />
          </div>
          
          {/* Comment textarea */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="comment"
              name="comment"
              value={reviewData.comment}
              onChange={handleChange}
              placeholder="Share details of your experience..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              maxLength="1000"
            ></textarea>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-teal-500 text-white px-4 py-2 rounded ${
                submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-600'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ReviewForm;