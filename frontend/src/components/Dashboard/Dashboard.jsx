import React, { useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import Sidebar from '../Sidebar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AuthContext } from '../../context/authContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [user] = useState({
    name: 'Faysal Ahammed',
    email: 'faysal@example.com',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Chart configuration
  const chartData = Array(6).fill(null).map((_, index) => ({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: `Health Data ${index + 1}`,
      data: Array(7).fill(null).map(() => Math.floor(Math.random() * 100)),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  }));

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Monthly Health Data',
      },
    },
  };

  // Handlers
  const handleProfileInfoClick = () => {
    alert(`Profile Info\nName: ${user?.name}\nEmail: ${user?.email}`);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Profile Section */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Good Afternoon, {user?.name}</p>
          <div className="relative">
            <button
              className="flex items-center p-2 bg-white rounded shadow-md hover:shadow-lg"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <span>{user?.name?.[0].toUpperCase()}</span>
              </div>
              <span className="ml-2 text-gray-700">{user?.name}</span>
            </button>

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
            <div key={`chart-${index}`} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Health Data Chart {index + 1}</h2>
              <Bar data={data} options={chartOptions} />
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <p className="text-gray-600">No upcoming appointments.</p>
          </div>
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