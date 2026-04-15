// import { useMemo, useState, useEffect } from "react";
// import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
// import { useAppContext } from "../Central_Store/app_context.jsx";
// import { Link } from "react-router-dom";

// export default function DriverVehicles() {
//   const { fetchedData, deleteData } = useAppContext();
//   const [driverVehicleData, setDriverVehicleData] = useState([]);
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false); // ✅ new state
//   const pageSize = 10;

//   // ✅ Load data from context
//   useEffect(() => {
//     setDriverVehicleData(fetchedData.driverVehicles || []);
//   }, [fetchedData.driverVehicles]);

//   // ✅ Search filter
//   const filtered = useMemo(() => {
//     if (!query) return driverVehicleData;
//     const q = query.toLowerCase();
//     return driverVehicleData.filter(
//       (r) =>
//         r.rc_number?.toLowerCase().includes(q) ||
//         r.insurance_number?.toLowerCase().includes(q) ||
//         r.driver_data.name?.toLowerCase().includes(q)
//     );
//   }, [query, driverVehicleData]);

//   // ✅ Pagination logic
//   const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const current = filtered.slice((page - 1) * pageSize, page * pageSize);

//   // ✅ Delete driver
//   const handleDelete = async (id) => {
//     try {
//       await deleteData(`/driver_vehicle/${id}/`);
//       setDriverVehicleData((prev) => prev.filter((d) => d.id !== id));
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           {/* Left: Title + breadcrumb */}
//           <div>
//             <h1 className="text-xl font-semibold text-gray-900">Driver Vehicles</h1>
//             <div className="text-sm text-gray-500">
//               Dashboard <span className="text-orange-500">/ Driver Vehicles</span>
//             </div>
//           </div>

//           {/* Right: Search */}
//           <div className="w-full md:w-80">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search here"
//                 value={query}
//                 onChange={(e) => {
//                   setPage(1);
//                   setQuery(e.target.value);
//                 }}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           {loading ? (
//             // ✅ Loader section
//             <div className="py-10 text-center text-gray-500">
//               <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//               <div className="mt-3">Loading drivers...</div>
//             </div>
//           ) : (
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-gray-700">
//                 <tr className="text-left">
//                   <th className="px-4 py-3 font-medium">Name</th>
//                   <th className="px-4 py-3 font-medium">Model</th>
//                   <th className="px-4 py-3 font-medium">RC Number</th>
//                   <th className="px-4 py-3 font-medium">Insurance Number</th>
//                   <th className="px-4 py-3 font-medium">Verified</th>
//                   <th className="px-4 py-3 font-medium">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {current.map((r) => (
//                   <tr key={r.id} className="border-t border-gray-100">
//                     <td className="px-4 py-3 font-medium text-gray-900">
//                       {r.driver_data.name || "-"}
//                     </td>
//                     <td className="px-4 py-3 text-gray-700">{r.vehicle_type_data.model_data?.name || "-"}</td>
//                     <td className="px-4 py-3 text-gray-700">{r.rc_number || "-"}</td>
//                     <td className="px-4 py-3 text-gray-700">{r.insurance_number || "-"}</td>
//                     <td
//                       className={`px-4 py-3 font-medium ${
//                         r.verified === true ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       {r.verified === true ? "Yes" : "No"}
//                     </td>
//                     <td className="px-4 py-3">
//                         <Link to={`/dashboard/driver-vehicle-detail/${r.id}`}>
//                           <button
//                             className="text-sm px-1 text-gray-700 cursor-pointer"
//                             title="View"
//                           >
//                             <EyeIcon className="h-5 w-5" />
//                           </button>
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(r.id)}
//                           className="text-sm px-1 text-red-600 cursor-pointer"
//                           title="Delete"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
//                     </td>
//                   </tr>
//                 ))}

//                 {!loading && current.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="px-4 py-8 text-center text-gray-500"
//                     >
//                       No driver vehicles found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {!loading && filtered.length > 0 && (
//           <div className="flex items-center justify-center gap-2 p-4">
//             <button
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//             >
//               «
//             </button>

//             {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => {
//               const num = i + 1;
//               return (
//                 <button
//                   key={num}
//                   onClick={() => setPage(num)}
//                   className={`px-3 py-1 rounded text-sm border ${
//                     page === num
//                       ? "bg-orange-500 text-white border-orange-500"
//                       : "bg-white"
//                   }`}
//                 >
//                   {num}
//                 </button>
//               );
//             })}

//             <button
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//               onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
//               disabled={page === pageCount}
//             >
//               »
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function DriverVehicles() {
  const { fetchedData, deleteData } = useAppContext();
  const [driverVehicleData, setDriverVehicleData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setDriverVehicleData(fetchedData.driverVehicles || []);
  }, [fetchedData.driverVehicles]);

  const filtered = useMemo(() => {
    if (!query) return driverVehicleData;
    const q = query.toLowerCase();
    return driverVehicleData.filter(
      (r) =>
        r.rc_number?.toLowerCase().includes(q) ||
        r.insurance_number?.toLowerCase().includes(q) ||
        r.driver_data.name?.toLowerCase().includes(q),
    );
  }, [query, driverVehicleData]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    try {
      await deleteData(`/driver_vehicle/${id}/`);
      setDriverVehicleData((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((r) => ({
      "Driver Name": r.driver_data?.name || "-",
      "Driver Email": r.driver_data?.email || "-",
      "Driver Phone": r.driver_data?.phone || "-",
      "Driver Status": r.driver_data?.status || "-",
      Brand: r.vehicle_type_data?.brand_data?.name || "-",
      Model: r.vehicle_type_data?.model_data?.name || "-",
      "Vehicle Type": r.vehicle_type_data?.type_data?.name || "-",
      "Vehicle Mode": r.vehicle_type_data?.vehicleMode || "-",
      Seats: r.vehicle_type_data?.seats || "-",
      "Fuel Type": r.vehicle_type_data?.fuelType || "-",
      "Base Fare (₹)": r.vehicle_type_data?.baseFare || "-",
      "Per KM Rate (₹)": r.vehicle_type_data?.perKmRate || "-",
      "RC Number": r.rc_number || "-",
      "Insurance Number": r.insurance_number || "-",
      "Ownership Type": r.ownership_type || "-",
      Verified: r.verified === true ? "Yes" : "No",
      "Registered On": r.created_at
        ? new Date(r.created_at).toLocaleDateString("en-IN")
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // ✅ Auto column width
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch:
        Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) +
        2,
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Driver Vehicles");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `DriverVehicles_${today}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: Title + breadcrumb */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Driver Vehicles
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard{" "}
              <span className="text-orange-500">/ Driver Vehicles</span>
            </div>
          </div>

          {/* Right: Search + Export */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
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

            {/* Export Button */}
            <button
              onClick={exportToExcel}
              disabled={filtered.length === 0}
              title="Export to Excel"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="mt-3">Loading drivers...</div>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">RC Number</th>
                  <th className="px-4 py-3 font-medium">Insurance Number</th>
                  <th className="px-4 py-3 font-medium">Verified</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {current &&
                  current?.length > 0 &&
                  current?.map((r) => (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r?.model_data?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r?.model_data?.brand_data?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r?.rc_number || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r?.insurance_number || "-"}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${r.verified === true ? "text-green-600" : "text-red-600"}`}
                      >
                        {r?.verified === true ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/dashboard/driver-vehicle-detail/${r.id}`}>
                          <button
                            className="text-sm px-1 text-gray-700 cursor-pointer"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-sm px-1 text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && current.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No driver vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-4">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              «
            </button>

            {Array.from({ length: pageCount })
              .slice(0, 5)
              .map((_, i) => {
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
        )}
      </div>
    </div>
  );
}
