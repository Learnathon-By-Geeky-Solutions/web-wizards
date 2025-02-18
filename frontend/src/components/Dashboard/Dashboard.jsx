import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import Sidebar from '../Sidebar';
import UserProfile from '../Navbar/UserProfile';
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

  const { user } = useContext(AuthContext);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Profile Section */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Good Afternoon, {user?.name}</p>
          <UserProfile />
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