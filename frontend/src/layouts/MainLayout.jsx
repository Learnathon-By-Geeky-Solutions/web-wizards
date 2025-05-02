import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/Navbar/UserProfile';
import { Bars3Icon } from '@heroicons/react/24/outline';

/**
 * Main layout component for pages that use the sidebar
 * Handles proper fixed sidebar with scrollable content area
 * Responsive: sidebar is hidden on mobile and toggleable
 */
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Always show sidebar on large screens
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - responsive with animation */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed top-0 left-0 z-30 h-screen w-64 transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <Sidebar onClose={toggleSidebar} isLargeScreen={isLargeScreen} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header with hamburger menu for mobile */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="ml-4 text-xl font-semibold">Amarhealth</h1>
          </div>
          
          {/* UserProfile in header for small screens */}
          {!isLargeScreen && (
            <div className="flex-shrink-0">
              <UserProfile />
            </div>
          )}
        </header>

        {/* Page content */}
        <div className="lg:ml-0">
          {children}
        </div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;