import React from 'react';
import PropTypes from 'prop-types';

const PageTitle = ({ title, className = "" }) => {
  return (
    <h1 className={`text-2xl font-bold ${className}`}>
      {title}
    </h1>
  );
};
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PageTitle;