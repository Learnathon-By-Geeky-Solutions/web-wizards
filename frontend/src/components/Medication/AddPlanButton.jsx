import React from 'react';
import PropTypes from 'prop-types';

const AddPlanButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-teal-500 text-white w-12 h-12 rounded-full fixed bottom-6 right-6 flex items-center justify-center text-2xl hover:bg-teal-600"
    >
      +
    </button>
  );
};

AddPlanButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddPlanButton;