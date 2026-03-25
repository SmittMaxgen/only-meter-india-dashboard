// Mock data that matches the structure and content of the image
const bookingsData = [
  {
    orderId: '#e40bdca8',
    customerName: 'ismail',
    bookingDate: '07 October 2025 08:29 PM',
    paymentStatus: 'Unpaid',
    bookingStatus: 'Placed',
    total: '₹ 0.00',
  },
  {
    orderId: '#5367cd23',
    customerName: 'Sumit Kumar Das',
    bookingDate: '07 October 2025 06:40 PM',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    total: '₹ 3998.24',
  },
  {
    orderId: '#152dbca5',
    customerName: 'Sumit Kumar Das',
    bookingDate: '07 October 2025 05:52 PM',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    total: '₹ 198.19',
  },
  {
    orderId: '#413f8121',
    customerName: 'Sumit Kumar Das',
    bookingDate: '07 October 2025 05:35 PM',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    total: '₹ 563.66',
  },
  {
    orderId: '#a60937d7',
    customerName: 'Sumit Kumar Das',
    bookingDate: '07 October 2025 05:24 PM',
    paymentStatus: 'Unpaid',
    bookingStatus: 'Cancelled',
    total: '₹ 2382.68',
  },
];
 
// Helper function to get the correct styling for the booking status chip
const getStatusChip = (status) => {
  switch (status) {
    case 'Placed':
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">Placed</span>;
    case 'Completed':
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">Completed</span>;
    case 'Cancelled':
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">Cancelled</span>;
    default:
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{status}</span>;
  }
};
 
// Eye icon component for the action button
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);
 
 
const RecentBookingsTable = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
        <a href="/dashboard/appointments" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          View all
        </a>
      </div>
 
      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Order Id</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Customer Name</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Booking Date</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Payment Status</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Booking Status</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Total</th>
              <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingsData.map((booking) => (
              <tr key={booking.orderId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{booking.orderId}</td>
                <td className="px-4 py-3 whitespace-nowrap">{booking.customerName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{booking.bookingDate}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-medium ${booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {booking.paymentStatus}
                    </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{getStatusChip(booking.bookingStatus)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{booking.total}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default RecentBookingsTable;
 