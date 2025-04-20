import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const HealthDataChart = ({ title, dataLabel }) => {
  // Generate cryptographically secure random data for chart visualization (not security-sensitive)
  const generateSecureRandomData = (count) => {
    const array = new Uint32Array(count);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(value => value % 100); // Modulo 100 to keep values within a reasonable range
  };

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: dataLabel,
          data: generateSecureRandomData(7),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [dataLabel]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Monthly Health Data',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
HealthDataChart.propTypes = {
  title: PropTypes.string.isRequired,
  dataLabel: PropTypes.string.isRequired,
};

export default HealthDataChart;