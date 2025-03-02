import React from 'react';

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

export default SearchBar;