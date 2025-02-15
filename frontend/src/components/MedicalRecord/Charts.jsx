import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import html2canvas from 'html2canvas';
import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftIcon,
  CalendarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const Charts = () => {
  const { user, logout } = useContext(AuthContext);
  const [fullName, setFullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);

  // Sidebar Items
  const sidebarItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Medical record', icon: ClipboardDocumentIcon },
    { name: 'Health Issues', icon: HeartIcon },
    { name: 'Medications', icon: ClipboardDocumentIcon },
    { name: 'Clinicians', icon: UserGroupIcon },
    { name: 'Chat', icon: ChatBubbleOvalLeftIcon },
    { name: 'Appointments', icon: CalendarIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  // Top Navigation Items
  const topNavItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Logbook', icon: BookOpenIcon },
    { name: 'Symptoms', icon: HeartIcon },
    { name: 'Charts', icon: ChartBarIcon },
    { name: 'Documents', icon: DocumentIcon },
    { name: 'Lab Results', icon: BeakerIcon },
  ];

  console.log('Component rendering:', { user, fullName });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold">Amarhealth</h1>
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center p-3 space-x-3 w-full rounded-lg hover:bg-teal-700"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg mb-6">
          <div className="flex space-x-6">
            {topNavItems.map((item) => (
              <button 
                key={item.name} 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold">{fullName}</span>
            <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Health Dashboard / Charts Content */}
        <div className="space-y-6">
          {/* Blood Pressure Classification Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Charts</h1>
            <select className="border rounded px-3 py-2">
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>Custom</option>
            </select>
            <h2 className="text-lg font-semibold mb-4">Blood Pressure Classification</h2>
            <div className="space-y-3">
              {['Grade 3', 'Grade 2', 'Grade 1', 'High Normal Normal', 'Optimal', 'Low'].map((item, idx) => (
                <div key={item} className="flex justify-between items-center">
                  <span className={`${idx === 0 ? 'text-red-600' : idx === 1 ? 'text-orange-500' : 'text-gray-700'}`}>
                    {item}
                  </span>
                  <span className="text-gray-500">
                    {['7 days', '7 days', '14 days', '30 days', '90 days', 'Custom'][idx]}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-6 border-t-2" />

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Systolic</h3>
                <div className="flex gap-4 mt-2">
                  {['40', '80', '120'].map((num) => (
                    <span key={num} className="text-gray-600">{num}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Diastolic</h3>
                <div className="mt-2 h-8 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* Blood Pressure Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Blood Pressure per day interval</h2>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <div className="flex items-end h-full gap-2">
                  {[210, 180, 150, 120, 90, 60, 30].map((val) => (
                    <div key={val} className="w-8 bg-blue-200" style={{ height: `${val / 3}px` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-gray-600">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Blood Pressure per hour</h2>
              <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-400">
                Chart placeholder
              </div>
            </div>
          </div>

          {/* Menstruation Statistics Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Menstruation Statistics</h2>
            <div className="space-y-3">
              <div className="font-medium">Reporting period</div>
              <select className="border rounded px-3 py-2">
                <option>1 years</option>
                <option>2 years</option>
                <option>3 years</option>
                <option>4 years</option>
                <option>others</option>
              </select>
            </div>
            <div className="mt-6 text-center text-gray-400 py-8">
              No Results Found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
