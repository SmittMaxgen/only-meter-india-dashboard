import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const API_URL =
  "https://adminapi.onlymeterindia.com/admin_dashboard_recent_activity/";

const BookingChart = () => {
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch monthly earnings");
        const data = await res.json();
        setMonthlyEarnings(data.monthly_earnings || []);
      } catch (err) {
        console.error("Error fetching monthly earnings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const chartData = {
    labels: monthlyEarnings.map((m) => m.month),
    datasets: [
      {
        label: "Earnings",
        data: monthlyEarnings.map((m) => m.earnings),
        fill: true,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // <-- add this
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ background: "none", color: "#1f2937" }}
      >
        Total Booking
      </h2>
      {loading && <p className="text-gray-400 text-sm">Loading chart...</p>}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && monthlyEarnings.length > 0 && (
        <div className="relative flex-1 min-h-[280px]">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ background: "none", color: "#1f2937" }}
      >
        Total Booking
      </h2>
      {loading && <p className="text-gray-400 text-sm">Loading chart...</p>}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && monthlyEarnings.length > 0 && (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default BookingChart;
