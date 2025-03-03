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

const topNavItems = [
  { name: 'Dashboard', icon: Squares2X2Icon, path: '/dashboard' },
  { name: 'Logbook', icon: BookOpenIcon, path: '/logbook' },
  { name: 'Symptoms', icon: HeartIcon, path: '/symptoms' },
  { name: 'Charts', icon: ChartBarIcon, path: '/charts' },
  { name: 'Documents', icon: DocumentIcon, path: '/documents' },
  { name: 'Lab Results', icon: BeakerIcon, path: '/labresult' },
];

const TopNav = ({ fullName }) => {
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
      <div className="flex items-center space-x-3">
        <span className="font-semibold">{fullName}</span>
        <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default TopNav;