import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { MagnifyingGlassIcon,TrashIcon } from "@heroicons/react/24/outline";
 
const getStatusChip = (status) => {
  switch (status) {
    case "accept":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Accepted
        </span>
      );
    case "pending":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          Pending
        </span>
      );
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Completed
        </span>
      );
    case "cancle":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
          Canceled
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
 
export default function CabBooking() {
  const { fetchedData, deleteData } = useAppContext();
  const [rides, setRides] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;

  useEffect(() => {
    const normalRides = (fetchedData?.rides || []).filter(
      (ride) => ride.ride_type === "reserve"
    );
    setRides(normalRides);
    console.log(normalRides);
  }, [fetchedData?.rides]);


  const filtered = useMemo(() => {
  if (!rides.length) return [];

  const q = query.toLowerCase();

  return rides.filter((ride) => {
    // --- Search Filter ---
    const matchesSearch =
      ride.user_data.full_name?.toLowerCase().includes(q) ||
      ride.vehicle_type_data?.model?.toLowerCase().includes(q) ||
      ride.driver_data?.name?.toLowerCase().includes(q);

    // --- Status Filter ---
    let statusMatch = true;
    if (statusFilter !== "all") {
      statusMatch =
        ride.status?.toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && statusMatch;
  });
}, [rides, query, statusFilter]);

const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
const current = filtered.slice((page - 1) * pageSize, page * pageSize);

const handleDelete = async (id) => {
    try {
      await deleteData(`/ride_request/${id}/`);
      setRides((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Reserved Cab Bookings
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Reserved Cab Booking</span>
            </div>
          </div>
 
          {/* Right: Search + Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search here"
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
 
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancle">Cancelled</option>
              <option value="accept">Accepted</option>
            </select>
          </div>
        </div>
      </div>
 
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Driver Name</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Payment Mode</th>
              <th className="px-4 py-3 font-medium">Booking Status</th>
              <th className="px-4 py-3 font-medium">Km</th> 
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? (
              current.map((booking) => (
                <tr
                  key={booking.orderId}
                  className="border-t border-gray-100"
                >
                  <td className="px-4 py-3">{booking.user_data.full_name}</td>
                  <td className="px-4 py-3">{booking.driver_data?.name || "-"}</td>
                  <td className="px-4 py-3">{booking.vehicle_type_data?.type_data?.name || "-"}</td>
                  <td className="px-4 py-3">{booking.paymentmode}</td>
                  <td className="px-4 py-3">{getStatusChip(booking.status)}</td>
                  <td className="px-4 py-3">{booking.distance_km || "-"}</td>
                  <td className="px-4 py-3">{booking.estimated_fare}</td>
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/cab-detail/${booking.id}`}>
                      <button className="text-sm px-1 text-gray-700 cursor-pointer">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-sm px-1 text-red-600 cursor-pointer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No bookings found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
 
        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          {/* Previous */}
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            «
          </button>

          {(() => {
            const maxVisible = 5;
            let start = Math.max(1, page - Math.floor(maxVisible / 2));
            let end = Math.min(pageCount, start + maxVisible - 1);

            // adjust start if near end
            if (end - start < maxVisible - 1) {
              start = Math.max(1, end - maxVisible + 1);
            }

            return Array.from({ length: end - start + 1 }, (_, i) => {
              const num = start + i;
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded text-sm border ${
                    page === num ? "bg-orange-500 text-white border-orange-500" : "bg-white"
                  }`}
                >
                  {num}
                </button>
              );
            });
          })()}

          {/* Next */}
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}