import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewList = ({ reviews }) => {
  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Display rating stars
  const renderRatingStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h4 className="font-medium text-gray-800">{review.title}</h4>
              <div className="flex items-center mt-1">
                {renderRatingStars(review.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1 sm:mt-0">
              {review.author_name && <span className="font-medium">{review.author_name}</span>}
              <span className="ml-1">{formatDate(review.created_at)}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      author_name: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReviewList;