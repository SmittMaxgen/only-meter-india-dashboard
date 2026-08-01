import { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { Link, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import RideHistoryModal from "../Components/RideHistoryModal.jsx";
import Swal from "sweetalert2";


export default function Drivers() {
  const { fetchedData, deleteData, refetchResource, baseUrl, getData } =
    useAppContext();
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const role = localStorage.getItem("role");
const canManage =
    !role ||
    role === "super_admin" ||
    role === "driver_manager" ||
    role === "drv_pls_cust";

  const [searchParams, setSearchParams] = useSearchParams();
  const [rideHistoryOpen, setRideHistoryOpen] = useState(false);
  const [rideHistoryTarget, setRideHistoryTarget] = useState(null);
  const [rideIdToOpen, setRideIdToOpen] = useState(null);
  const [rideIdFilter, setRideIdFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Auto-open ride modal when navigated here via ?rideId= (e.g. from Topbar)
  useEffect(() => {
    const paramRideId = searchParams.get("rideId");
    if (paramRideId) {
      setRideIdToOpen(paramRideId);
      setRideHistoryTarget(null);
      setRideHistoryOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const openRideHistory = (driver) => {
    setRideHistoryTarget(driver);
    setRideHistoryOpen(true);
  };

  const openRideById = () => {
    if (!rideIdFilter.trim()) return;
    setRideIdToOpen(rideIdFilter.trim());
    setRideHistoryTarget(null);
    setRideHistoryOpen(true);
  };

  // Location filters
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    refetchResource("drivers", "/driver/");
  }, []);

  // Debounced auto-filter by city/state/country
useEffect(() => {
    if (!cityFilter && !stateFilter && !countryFilter && !phoneFilter) {
      setDrivers(fetchedData?.drivers || []);
      return;
    }

    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (cityFilter) params.append("city", cityFilter);
      if (stateFilter) params.append("state", stateFilter);
      if (countryFilter) params.append("country", countryFilter);
      if (phoneFilter) params.append("phone", phoneFilter);
      const qs = params.toString();

      setFilterLoading(true);
      try {
        const data = await getData(`/driver/${qs ? `?${qs}` : ""}`);
        setDrivers(data || []);
        setPage(1);
      } catch (err) {
        console.error("Location filter failed:", err);
      } finally {
        setFilterLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, stateFilter, countryFilter, phoneFilter]);

  const clearLocationFilters = () => {
    setCityFilter("");
    setStateFilter("");
    setCountryFilter("");
    setPhoneFilter("");
  };

  useEffect(() => {
    const normalRides = fetchedData?.drivers || [];
    setDrivers(normalRides);
    console.log(normalRides);
  }, [fetchedData?.drivers]);

  const filtered = useMemo(() => {
    if (!query) return drivers;
    const q = query.toLowerCase();
    return drivers.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q),
    );
  }, [query, drivers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    try {
      await deleteData(`/driver/${id}/`);
      await refetchResource("drivers", "/driver/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleVerificationChange = async (id, status) => {
    let cancel_reason;

    if (status === "cancelled") {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Reason for Cancellation",
        input: "textarea",
        inputLabel: "Please provide a reason",
        inputPlaceholder: "Type the reason here...",
        showCancelButton: true,
        confirmButtonText: "Submit",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "A cancellation reason is required.";
          }
        },
      });

      if (!isConfirmed) return;
      cancel_reason = reason.trim();
    }

    try {
      setUpdatingId(id);
      const token = localStorage.getItem("accessToken");
      const payload = { verification: status };
      if (status === "cancelled") {
        payload.cancel_reason = cancel_reason;
      }

      const res = await fetch(`${baseUrl}/driver/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update verification status");
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                verification: status,
                cancel_reason:
                  status === "cancelled" ? cancel_reason : d.cancel_reason,
              }
            : d,
        ),
      );

      const toastConfig = {
        pending: { icon: "info", title: "Marked as Pending" },
        approved: { icon: "success", title: "Driver Approved" },
        cancelled: { icon: "error", title: "Driver Cancelled" },
      }[status] || { icon: "info", title: "Status Updated" };

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: toastConfig.icon,
        title: toastConfig.title,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Verification update failed:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update status",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((r) => ({
      Name: r.name || "-",
      Email: r.email || "-",
      Phone: r.phone || "-",
      City: r.city || "-",
      State: r.state || "-",
      Country: r.country || "-",
      Status: r.status || "-",
      Verification: r.verification || "-",
      "Vehicle Brand": r.vehicle_data?.brand_data?.name || "-",
      "Vehicle Model": r.vehicle_data?.model_data?.name || "-",
      "Vehicle Type": r.vehicle_type || "-",
      Seats: r.vehicle_data?.seats || "-",
      "Fuel Type": r.vehicle_data?.fuelType || "-",
      "Base Fare (₹)": r.vehicle_data?.baseFare || "-",
      "Per KM Rate (₹)": r.vehicle_data?.perKmRate || "-",
      "Bonus Amount": r.bonus_amount ?? "-",
      "Referral Code": r.referral_code || "-",
      Membership: r.membership ? "Yes" : "No",
      "Joined Date": r.created_at
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Drivers_${today}.xlsx`);
  };

  // When ride history is open → hide driver list, show only rides
  if (rideHistoryOpen && (rideHistoryTarget || rideIdToOpen)) {
    return (
      <RideHistoryModal
        onClose={() => {
          setRideHistoryOpen(false);
          setRideHistoryTarget(null);
          setRideIdToOpen(null);
          if (searchParams.get("rideId")) setSearchParams({});
        }}
        entityId={rideHistoryTarget?.id}
        entityType="driver"
        entityLabel={
          rideHistoryTarget
            ? `${rideHistoryTarget.first_name || ""} ${rideHistoryTarget.last_name || ""}`
            : ""
        }
        initialRideId={rideIdToOpen}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: Title + breadcrumb */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Drivers</h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Drivers</span>
            </div>
          </div>

          {/* Right: Search + Export */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
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

        {/* Location Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
          <input
            type="text"
            placeholder="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Filter by state"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Filter by country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Filter by phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Search Ride ID"
            value={rideIdFilter}
            onChange={(e) => setRideIdFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && openRideById()}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={openRideById}
            disabled={!rideIdFilter.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Find Ride
          </button>
          {filterLoading && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Filtering...
            </span>
          )}
          <button
            onClick={clearLocationFilters}
            disabled={filterLoading}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>Search Ride ID

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
                  {/* <th className="px-4 py-3 font-medium">Photo</th> */}
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Bonus Amount</th>
                  <th className="px-4 py-3 font-medium">Verification</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {current.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    {/* <td className="px-4 py-3">
                      <img
                        src={
                          r.profile_img
                            ? `${baseUrl}${r.profile_img}`
                            : "/placeholder.png"
                        }
                        alt={r.name || "Driver"}
                        className="h-10 w-10 rounded-full object-cover bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </td> */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {`${r.first_name} ${r.last_name}` || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.city || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.state || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.country || "-"}
                    </td>
                    <td className="px-4 py-3 text-green-700 font-medium">
                      {r.bonus_amount || "-"}
                    </td>
                    <td className="px-4 py-3">
                     <select
                        value={r.verification || ""}
                        disabled={updatingId === r.id}
                        onChange={(e) =>
                          handleVerificationChange(r.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1 text-xs disabled:opacity-50"
                      >
                        {r.verification !== "approved" && (
                          <option value="pending">Pending</option>
                        )}
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        r.status === "online"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.status}
                    </td>
                    <td className="px-4 py-3">
                      {canManage ? (
                        <div className="flex gap-2">
                          <Link to={`/dashboard/driver-detail/${r.id}`}>
                            <button
                              className="text-sm py-1 text-gray-700 cursor-pointer"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => openRideHistory(r)}
                            className="text-sm py-1 text-blue-600 cursor-pointer"
                            title="Ride History"
                          >
                            <ClockIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="text-sm text-red-600 cursor-pointer"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}

                {!loading && current.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No drivers found.
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

      {/* <RideHistoryModal
        isOpen={rideHistoryOpen}
        onClose={() => setRideHistoryOpen(false)}
        entityId={rideHistoryTarget?.id}
        entityType="driver"
        entityLabel={
          rideHistoryTarget
            ? `${rideHistoryTarget.first_name || ""} ${rideHistoryTarget.last_name || ""}`
            : ""
        }
      /> */}
    </div>
  );
}
