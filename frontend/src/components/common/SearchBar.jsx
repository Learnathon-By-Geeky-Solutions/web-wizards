import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ placeholder = "Search...", onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="border rounded pl-8 pr-3 py-2 focus:outline-none"
      />
    </div>
  );
};
SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;