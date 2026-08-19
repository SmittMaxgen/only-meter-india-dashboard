import React, { useState, useEffect } from "react";

const API_URL =
  "https://adminapi.onlymeterindia.com/admin_dashboard_recent_activity/";

// Helper function to get the correct styling for the booking status chip
const getStatusChip = (status) => {
  switch (status) {
    case "Placed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Placed
        </span>
      );
    case "Pending":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
          Pending
        </span>
      );
    case "Completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Completed
        </span>
      );
    case "Cancelled":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
};

// Eye icon component for the action button
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const RecentBookingsTable = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch recent bookings");
        const data = await res.json();
        setBookingsData(data.recent_bookings || []);
      } catch (err) {
        console.error("Error fetching recent bookings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
        <a
          href="/dashboard/appointments"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          View all
        </a>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg flex-1 flex flex-col justify-center">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Order Id
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Customer Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Booking Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Payment Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Booking Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap text-right"
              >
                Total
              </th>
              {/* <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap text-center"
              >
                Action
              </th> */}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                  Loading recent bookings...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && bookingsData.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                  No recent bookings found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              bookingsData.map((booking) => (
                <tr
                  key={booking.raw_id ?? booking.order_id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-5 py-5 whitespace-nowrap">
                    {booking.order_id}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    {booking.customer_name}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    {booking.booking_date}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    <span
                      className={`font-medium ${booking.payment_status === "Paid" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap">
                    {getStatusChip(booking.booking_status)}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap text-right font-medium">
                    ₹ {Number(booking.total).toFixed(2)}
                  </td>
                  {/* <td className="px-5 py-5 whitespace-nowrap text-center">
                    <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                      <EyeIcon />
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable;
