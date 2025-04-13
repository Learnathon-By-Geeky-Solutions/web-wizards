import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';

/**
 * Main layout component for pages that use the sidebar
 * Handles proper fixed sidebar with scrollable content area
 */
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;