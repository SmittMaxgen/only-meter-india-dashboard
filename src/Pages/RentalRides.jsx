import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
const bookingsData = [
  {
    orderId: "#e40bdca8",
    customerName: "ismail",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 October 2025 08:29 PM",
    paymentStatus: "Unpaid",
    bookingStatus: "Placed",
    total: "₹ 0.00",
  },
  {
    orderId: "#5367cd23",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 September 2025 06:40 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 3998.24",
  },
  {
    orderId: "#152dbca5",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 July 2025 05:52 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 198.19",
  },
  {
    orderId: "#413f8121",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 June 2025 05:35 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 563.66",
  },
  {
    orderId: "#a60937d7",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 October 2025 05:24 PM",
    paymentStatus: "Unpaid",
    bookingStatus: "Cancelled",
    total: "₹ 2382.68",
  },
    {
    orderId: "#e40bdca8",
    customerName: "ismail",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 October 2025 08:29 PM",
    paymentStatus: "Unpaid",
    bookingStatus: "Placed",
    total: "₹ 0.00",
  },
  {
    orderId: "#5367cd23",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 September 2025 06:40 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 3998.24",
  },
  {
    orderId: "#152dbca5",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 July 2025 05:52 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 198.19",
  },
  {
    orderId: "#413f8121",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 June 2025 05:35 PM",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    total: "₹ 563.66",
  },
  {
    orderId: "#a60937d7",
    customerName: "Sumit Kumar Das",
    rentalPackage:"6 hours/100km",
    bookingDate: "07 October 2025 05:24 PM",
    paymentStatus: "Unpaid",
    bookingStatus: "Cancelled",
    total: "₹ 2382.68",
  },
];
 
const getStatusChip = (status) => {
  switch (status) {
    case "Placed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Placed
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
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-red-600 transition-colors">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
);
 
export default function RentalRides() {
 
  // const navigate = useNavigate();
 
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;
 
   
  //     const handleViewClick = (booking) => {
  //   // navigate to detail page and pass booking data
  //   navigate("/dashboard/cabbookingdetail", { state: {booking} });
  // };
 
  const filtered = useMemo(() => {
    const now = new Date();
 
    return bookingsData.filter((r) => {
      const q = query.toLowerCase();
      const matchesSearch =
        r.bookingStatus.toLowerCase().includes(q) ||
        r.bookingDate.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q);
 
      // Date Filter
      const bookingDate = new Date(r.bookingDate);
      let dateMatch = true;
      if (dateFilter === "1month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        dateMatch = bookingDate >= oneMonthAgo;
      } else if (dateFilter === "3month") {
        const threeMonthAgo = new Date();
        threeMonthAgo.setMonth(now.getMonth() - 3);
        dateMatch = bookingDate >= threeMonthAgo;
      }
 
      // Status Filter
      let statusMatch = true;
      if (statusFilter !== "all") {
        statusMatch = r.bookingStatus === statusFilter;
      }
 
      return matchesSearch && dateMatch && statusMatch;
    });
  }, [query, dateFilter, statusFilter]);
 
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);
 
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Rental Rides
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/Rental Rides</span>
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
 
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Dates</option>
              <option value="1month">Last 1 Month</option>
              <option value="3month">Last 3 Months</option>
            </select>
 
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Accepted">Accepted</option>
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
              <th className="px-4 py-3 font-medium">Order Id</th>
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Rental Package</th>
              <th className="px-4 py-3 font-medium">Booking Date</th>
              <th className="px-4 py-3 font-medium">Payment Status</th>
              <th className="px-4 py-3 font-medium">Booking Status</th>
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
                  <td className="px-4 py-3">{booking.orderId}</td>
                  <td className="px-4 py-3">{booking.customerName}</td>
                  <td className="px-4 py-3">{booking.rentalPackage}</td>
                  <td className="px-4 py-3">{booking.bookingDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        booking.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusChip(booking.bookingStatus)}</td>
                  <td className="px-4 py-3">{booking.total}</td>
                  <td className="px-4 py-3">
                    <button className="text-sm px-1 text-gray-700 cursor-pointer">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-sm px-1 text-red-600 cursor-pointer">
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
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            «
          </button>
          {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded text-sm border ${
                  page === num
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                {num}
              </button>
            );
          })}
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