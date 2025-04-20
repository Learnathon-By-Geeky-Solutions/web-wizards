import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function Navbar() {
  return (
    <nav className="bg-green-50 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-green-800 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <span className="text-green-800 text-xl font-semibold ml-2">Amarhealth</span>
        </div>

        {/* Navigation Links */}
        {/* <div className="hidden md:flex space-x-8">
          <a href="#" className="text-green-800 hover:text-green-600">
            For users
          </a>
          <a href="#" className="text-green-800 hover:text-green-600">
            For clinics
          </a>
          <a href="#" className="text-green-800 hover:text-green-600">
            News
          </a>
        </div> */}

        {/* Login and Language */}
        <div className="flex items-center space-x-1 py-2 ml-[-10px]">
          {/* Login Button */}
          <Link
            to="/login"
            className="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-700 mr-4"
          >
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
