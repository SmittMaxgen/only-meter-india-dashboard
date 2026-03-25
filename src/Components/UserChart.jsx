import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
 
ChartJS.register(ArcElement, Tooltip, Legend);
 
const UserChart = () => {
  const data = {
    labels: ['Driver', 'User'],
    datasets: [
      {
        data: [1859],
        backgroundColor: '#ffb833',
        hoverBackgroundColor: '#e69500',
        borderColor: '#ffffff',
        borderWidth: 2,
      },
      {
        data: [1303],
        backgroundColor: '#3333ff',
        hoverBackgroundColor: '#0000e6',
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };
 
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for allowing custom sizing
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };
 
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Users</h2>
      <div className="flex items-center justify-center">
        {/* --- MODIFICATION START --- */}
        {/* Wrap the Doughnut chart in a div with fixed height and width */}
        <div className="relative h-81 w-80">
          <Doughnut data={data} options={options} />
        </div>
        {/* --- MODIFICATION END --- */}
      </div>
    </div>
  );
};
 
export default UserChart;
 