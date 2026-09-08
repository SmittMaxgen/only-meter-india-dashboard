// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import Logo from "../assets/Logo_1.jpg";

// export default function Topbar({ onMenuClick }) {
//   const navigate = useNavigate();
//   const [rideId, setRideId] = useState("");
//   const [rideType, setRideType] = useState("driver");

//   function handleLogout() {
//     localStorage.removeItem("isAuth");
//     navigate("/");
//   }

//   function handleRideSearch() {
//     if (!rideId.trim()) return;
//     const target = rideType === "driver" ? "drivers" : "customers";
//     navigate(`/dashboard/${target}?rideId=${rideId.trim()}`);
//     setRideId("");
//   }

//   return (
//     <header className="h-20 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         {/* Mobile menu button */}
//         <button
//           type="button"
//           className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//           aria-label="Open sidebar"
//           onClick={onMenuClick}
//         >
//           <svg
//             className="h-6 w-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16"
//             ></path>
//           </svg>
//         </button>

//         <img src={Logo} alt="Logo" className="h-28 w-35 mt-3" />
//         {/* <span className="font-semibold text-2xl text-orange-500">Only Meter</span> */}
//       </div>

//       {/* Global Ride ID search */}
//       <div className="hidden md:flex items-center gap-2">
//         <select
//           value={rideType}
//           onChange={(e) => setRideType(e.target.value)}
//           className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//         >
//           <option value="driver">Driver Ride</option>
//           <option value="user">Customer Ride</option>
//         </select>
//         <div className="relative">
//           <input
//             type="text"
//             value={rideId}
//             onChange={(e) => setRideId(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleRideSearch()}
//             placeholder="Search Ride ID"
//             className="w-44 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//           />
//           <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         </div>
//         <button
//           onClick={handleRideSearch}
//           disabled={!rideId.trim()}
//           className="px-3 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Go
//         </button>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           onClick={handleLogout}
//           className="text-sm px-3 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/Logo_1.jpg";

const SEARCH_MODES = {
  "driver-ride": {
    label: "Driver Ride ID",
    role: "driver",
    param: "rideId",
    placeholder: "Search Ride ID",
  },
  "user-ride": {
    label: "Customer Ride ID",
    role: "user",
    param: "rideId",
    placeholder: "Search Ride ID",
  },
  "driver-phone": {
    label: "Driver Phone",
    role: "driver",
    param: "phone",
    placeholder: "Search Driver Phone",
  },
  "user-phone": {
    label: "Customer Phone",
    role: "user",
    param: "phone",
    placeholder: "Search Customer Phone",
  },
};

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState("driver-ride");
  const [query, setQuery] = useState("");

  function handleLogout() {
    localStorage.removeItem("isAuth");
    navigate("/");
  }

  function handleSearch() {
    const value = query.trim();
    if (!value) return;

        const mode = SEARCH_MODES[searchMode];
    const target = mode.role === "driver" ? "driver" : "customers";

    navigate(`/dashboard/${target}?${mode.param}=${value}`);
    setQuery("");
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Open sidebar"
          onClick={onMenuClick}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <img src={Logo} alt="Logo" className="h-28 w-35 mt-3" />
      </div>

      {/* Global search: Ride ID or Phone, for driver or customer */}
      <div className="hidden md:flex items-center gap-2">
        <select
          value={searchMode}
          onChange={(e) => {
            setSearchMode(e.target.value);
            setQuery("");
          }}
          className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {Object.entries(SEARCH_MODES).map(([key, m]) => (
            <option key={key} value={key}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={SEARCH_MODES[searchMode].placeholder}
            className="w-48 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="px-3 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Go
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
