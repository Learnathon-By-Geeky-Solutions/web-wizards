import React, { useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaTachometerAlt,
  FaPills,
  FaClipboardList,
  FaHeart,
  FaUsers,
  FaComments,
  FaCalendarAlt,
  FaCog,
} from 'react-icons/fa';
import { AuthContext } from '../../context/authContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sidebar Component
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const handleNavigation = (section) => {
    console.log(`Navigating to ${section}`);
    // Add your navigation logic here (e.g., using react-router-dom)
};

const menuItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt /> },
    { label: 'Medications', icon: <FaPills /> },
    { label: 'Medical Record', icon: <FaClipboardList /> },
    { label: 'Health Issues', icon: <FaHeart /> },
    { label: 'Clinicians', icon: <FaUsers /> },
    { label: 'Chat', icon: <FaComments /> },
    { label: 'Appointments', icon: <FaCalendarAlt /> },
    { label: 'Settings', icon: <FaCog /> },
];

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white shadow-lg fixed h-full transition-all duration-300`}
    >
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isCollapsed ? 'AH' : 'Amearhealth'}</h1>
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.label)}
            className="block w-full text-left p-4 hover:bg-blue-500 hover:text-white flex items-center"
          >
            <div className="mr-4">{item.icon}</div>
            {!isCollapsed && item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: 'Faysal Ahammed',
    email: 'faysal@example.com',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Chart Data (Static for demonstration purposes)
  const chartData = Array(6)
    .fill(null)
    .map((_, index) => ({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: `Health Data ${index + 1}`,
          data: Array(7)
            .fill(null)
            .map(() => Math.floor(Math.random() * 100)),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.2)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 1,
        },
      ],
    }));

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Health Data',
      },
    },
  };

  // Profile Info and Logout Handlers
  const handleProfileInfoClick = () => {
    alert(`Profile Info\nName: ${user.name}\nEmail: ${user.email}`);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout(); // Use the logout function from the context
    setIsDropdownOpen(false); // Close dropdown after clicking
  };

  // Display the first letter of user's name
  const getFirstLetter = (name) => name && name[0].toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 p-6 ml-${isSidebarCollapsed ? '20' : '64'}`}>
        {/* Profile Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">Good Afternoon, {user ? user.name : 'Guest'}</p>
          </div>
          <div className="relative">
            {/* Profile Dropdown */}
            <button
              className="flex items-center p-2 bg-white rounded shadow-md hover:shadow-lg focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {/* Profile Pic - First Letter */}
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <span>{getFirstLetter(user ? user.name : '')}</span>
              </div>
              <span className="ml-2 text-gray-700">{user ? user.name : 'Guest'}</span>
              <svg
                className="w-4 h-4 ml-1 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                <button
                  onClick={handleProfileInfoClick}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Profile Info
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartData.map((data, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Health Data Chart {index + 1}</h2>
              <Bar data={data} options={chartOptions} />
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Appointments */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <p className="text-gray-600">No upcoming appointments.</p>
          </div>

          {/* Your Doctors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Doctors</h2>
            <p className="text-gray-600">No doctors assigned.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;