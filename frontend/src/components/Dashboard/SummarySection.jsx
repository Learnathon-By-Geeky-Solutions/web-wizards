import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  HeartIcon, 
  BeakerIcon 
} from '@heroicons/react/24/outline';

const SummaryCard = ({ icon: Icon, title, value, link }) => (
  <Link 
    to={link}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className="bg-teal-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
    </div>
  </Link>
);

const SummarySection = () => {
  const summaryData = [
    {
      icon: CalendarIcon,
      title: 'Upcoming Appointments',
      value: '2',
      link: '/appointments'
    },
    {
      icon: UserGroupIcon,
      title: 'Your Doctors',
      value: '3',
      link: '/clinicians'
    },
    {
      icon: HeartIcon,
      title: 'Active Health Issues',
      value: '1',
      link: '/health-issues'
    },
    {
      icon: BeakerIcon,
      title: 'Active Medications',
      value: '4',
      link: '/medication'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item) => (
        <SummaryCard key={item.title} {...item} />
      ))}
    </div>
  );
};

export default SummarySection;