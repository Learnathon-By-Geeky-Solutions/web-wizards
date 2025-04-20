import React from 'react';
import { Link } from 'react-router-dom';
import {
  Squares2X2Icon,
  BookOpenIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import UserProfile from '../Navbar/UserProfile';

const topNavItems = [
  { name: 'Dashboard', icon: Squares2X2Icon, path: '/dashboard' },
  { name: 'Logbook', icon: BookOpenIcon, path: '/medicalrecord/logbook' },
  { name: 'Symptoms', icon: HeartIcon, path: '/medicalrecord/symptoms' },
  { name: 'Charts', icon: ChartBarIcon, path: '/medicalrecord/charts' },
  { name: 'Documents', icon: DocumentIcon, path: '/medicalrecord/documents' },
  { name: 'Lab Results', icon: BeakerIcon, path: '/medicalrecord/labresult' },
];

const TopNav = () => {
  return (
    <div className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg mb-6">
      <div className="flex space-x-6">
        {topNavItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <UserProfile />
    </div>
  );
};

export default TopNav;