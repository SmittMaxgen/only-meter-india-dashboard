import React, { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
 
// Mock data to populate the table. You can replace this with your actual data source.
const allTickets = [
  {
    id: "xF7H9dSG_HTnNnw1",
    name: "yehya trk",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "LIS7Wm_QgP7tQSD",
    name: "enes",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "rGZrxtUu_FH5ps4",
    name: "نمار علي",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "5iSj_Bvf6dRblobJ",
    name: "Ranjithkumar",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Pending",
  },
  {
    id: "h6k1uW_UgvyPelzG",
    name: "jonathan araya",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "IfgQF3Sw_PNxrs2J",
    name: "Aniket Bapat",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "5hapyfBBQL_VzDzu",
    name: "Krishna",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "kLp9vRzX_cE8yFqA",
    name: "Mohammed Ali",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "mN0bVcxY_dF9zGrB",
    name: "Laura Wilson",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "oP1qWdxZ_eG0aHsC",
    name: "Chen Wei",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  // Add 20 more entries to test the 20 and 30 filters
  {
    id: "qR2sXeyA_fH1bIdD",
    name: "Amit Kumar",
    reason: "Late delivery",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "sT3tYfzA_gI2cJdE",
    name: "Fatima Al-Sayed",
    reason: "Driver was rude",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "uV4uZhAB_hJ3dKeF",
    name: "John Smith",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "wW5vZiaB_iK4eLfG",
    name: "Priya Sharma",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "xX6wAjbC_jL5fMgH",
    name: "Olga Ivanova",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "yY7xBkcd_kM6gNhI",
    name: "Carlos Rodriguez",
    reason: "Item was damaged",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "zZ8yClde_lN7hOiJ",
    name: "Kenji Tanaka",
    reason: "Wrong item delivered",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "aA9zDmfe_mO8iPjK",
    name: "Aisha Khan",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "bB0aEnff_nP9jQkL",
    name: "Hans Müller",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "cC1bFogg_oQ0kRlM",
    name: "Maria Garcia",
    reason: "Service was slow",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "dD2cGphh_pR1lSmN",
    name: "David Chen",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "eE3dHqii_qS2mTpO",
    name: "Chidike Nwosu",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Pending",
  },
  {
    id: "fF4eIrjj_rT3nUqP",
    name: "Isabella Rossi",
    reason: "Driver did not arrive",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "gG5fJskk_sU4oVrQ",
    name: "Liam Murphy",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "hH6gKtll_tV5pWsR",
    name: "Sofia Costa",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Accepted",
  },
  {
    id: "iI7hLumm_uW6qXtS",
    name: "Arjun Singh",
    reason: "App is not working",
    type: "Customer",
    status: "Pending",
  },
  {
    id: "jJ8iMvnn_vX7rYuT",
    name: "Chloe Dubois",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "kK9jNwoo_wY8sZvU",
    name: "Omar Abdullah",
    reason: "i m not getting any respond from customer",
    type: "Driver",
    status: "Pending",
  },
  {
    id: "lL0kOxpp_xZ9tAwV",
    name: "Emily White",
    reason: "Charged incorrectly",
    type: "Customer",
    status: "Accepted",
  },
  {
    id: "mM1lPyqq_yA0uBxW",
    name: "Noah Brown",
    reason: "Vehicle condition is not good",
    type: "Customer",
    status: "Pending",
  },
];
 
// Reusable StatusBadge component for "Accepted" and "Pending" statuses
const StatusBadge = ({ status }) => {
  const baseClasses =
    "text-xs font-semibold inline-block py-1 px-3 rounded-full";
  const statusClasses = {
    Accepted: "bg-green-100 text-green-700",
    Pending: "bg-orange-100 text-orange-700",
  };  
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};
 
// SVG Icon for the "Actions" column
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-400 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
 
// The new Modal component to display ticket details
const TicketDetailsModal = ({ ticket, onClose }) => {
    if (!ticket) return null;
 
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Support Ticket</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
 
                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* User and Ticket Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-sm font-medium text-gray-500">Id</span>
                            <span className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded"># {ticket.id}</span>
                        </div>
                         <div className="flex justify-between items-center py-1">
                            <span className="text-sm font-medium text-gray-500">User Name</span>
                            <span className="text-sm font-semibold text-gray-800">{ticket.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-sm font-medium text-gray-500">Type</span>
                            <span className="text-sm text-gray-800">{ticket.type}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-sm font-medium text-gray-500">Date</span>
                            <span className="text-sm text-gray-800">{ticket.date}</span>
                        </div>
                    </div>
                   
                    {/* Reason and Status */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{ticket.reason}</h3>
                            <StatusBadge status={ticket.status} />
                        </div>
                        <p className="text-sm text-gray-600">
                            {/* Dummy text for description */}
                            hdhdhd <br/> tttt
                        </p>
                    </div>
 
                    {/* Image Placeholder */}
                    {ticket.imageUrl && (
                        <div>
                             <img
                                src={ticket.imageUrl}
                                alt="Vehicle"
                                className="rounded-lg w-40 h-24 object-cover border border-gray-200"
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x100/CCCCCC/FFFFFF?text=Error'; }}
                             />
                        </div>
                    )}
 
                    {/* Notes Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{ticket.notes || "No notes provided."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
const SupportTicket = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null); // State for the selected ticket
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const pageSize = 10;
 
  const filtered = useMemo(() => {
    // const now = new Date();
 
    return allTickets.filter((r) => {
      const q = query.toLowerCase();
      const matchesSearch =
        r.status.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q);
        return matchesSearch
    });
  }, [query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);
 
    // Function to handle opening the modal
    const handleOpenModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };
 
    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };
 
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              SupportTicket
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/Support Ticket</span>
            </div>
          </div>
 
          {/* Right: Filters */}
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
          </div>
        </div>
      </div>
 
      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm  ">
          <thead className="bg-gray-50  text-gray-700 ">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Id</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? (
              current.map((ticket) => (
                <tr
                  key={ticket.id}
                  className=" border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 ">{ticket.id}</td>
                  <td className="px-4 py-3 ">{ticket.name}</td>
                  <td className="px-4 py-3">{ticket.reason}</td>
                  <td className="px-4 py-3">{ticket.type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                   
                       <button
                                                onClick={() => handleOpenModal(ticket)}
                                                className="text-sm px-1 text-gray-700 cursor-pointer"
                                            >
                                                <InfoIcon />
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
           {/* Render the modal conditionally */}
            {isModalOpen && <TicketDetailsModal ticket={selectedTicket} onClose={handleCloseModal} />}
        </div>
         
    </div>
  );
};
 
export default SupportTicket;