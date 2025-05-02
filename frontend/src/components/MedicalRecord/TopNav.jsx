import React from 'react';
import { Link } from 'react-router-dom';
import {
  Squares2X2Icon,
  BookOpenIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentIcon,
  BeakerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import UserProfile from '../Navbar/UserProfile';

const topNavItems = [
  { name: 'Profile', icon: UserIcon, path: '/medicalrecord' },
  { name: 'Logbook', icon: BookOpenIcon, path: '/medicalrecord/logbook' },
  { name: 'Symptoms', icon: HeartIcon, path: '/medicalrecord/symptoms' },
  { name: 'Charts', icon: ChartBarIcon, path: '/medicalrecord/charts' },
  { name: 'Documents', icon: DocumentIcon, path: '/medicalrecord/documents' },
  { name: 'Lab Results', icon: BeakerIcon, path: '/medicalrecord/labresult' },
];

const TopNav = () => {
  return (
    <div className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg mb-6">
      <div className="flex space-x-4 md:space-x-6 overflow-x-auto">
        {topNavItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-blue-600"
            title={item.name}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:inline">{item.name}</span>
          </Link>
        ))}
      </div>
      {/* Only show UserProfile on medium screens and larger */}
      <div className="hidden md:block">
        <UserProfile />
      </div>
    </div>
  );
};

export default TopNav;