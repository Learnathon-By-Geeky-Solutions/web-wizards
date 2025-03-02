import React from 'react';

const PageTitle = ({ title, className = "" }) => {
  return (
    <h1 className={`text-2xl font-bold ${className}`}>
      {title}
    </h1>
  );
};

export default PageTitle;