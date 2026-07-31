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

export default function Customers() {
  const { fetchedData, deleteData, refetchResource, getData } = useAppContext();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const role = localStorage.getItem("role");
const canManage =
    !role ||
    role === "super_admin" ||
    role === "customer_manager" ||
    role === "drv_pls_cust";

  const [searchParams, setSearchParams] = useSearchParams();
  const [rideHistoryOpen, setRideHistoryOpen] = useState(false);
  const [rideHistoryTarget, setRideHistoryTarget] = useState(null);
  const [rideIdToOpen, setRideIdToOpen] = useState(null);
  const [rideIdFilter, setRideIdFilter] = useState("");

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

  const openRideHistory = (user) => {
    setRideHistoryTarget(user);
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
  const [mobileFilter, setMobileFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    refetchResource("users", "/user/");
  }, []);

  // Debounced auto-filter by city/state/country
  useEffect(() => {
    if (!cityFilter && !stateFilter && !countryFilter && !mobileFilter) {
      setUsers(fetchedData?.users || []);
      return;
    }

    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (cityFilter) params.append("city", cityFilter);
      if (stateFilter) params.append("state", stateFilter);
      if (countryFilter) params.append("country", countryFilter);
      if (mobileFilter) params.append("mobile_no", mobileFilter);
      const qs = params.toString();

      setFilterLoading(true);
      try {
        const data = await getData(`/user/${qs ? `?${qs}` : ""}`);
        setUsers(data || []);
        setPage(1);
      } catch (err) {
        console.error("Location filter failed:", err);
      } finally {
        setFilterLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, stateFilter, countryFilter, mobileFilter]);

  const clearLocationFilters = () => {
    setCityFilter("");
    setStateFilter("");
    setCountryFilter("");
    setMobileFilter("");
  };

  useEffect(() => {
    setUsers(fetchedData.users || []);
  }, [fetchedData.users]);

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(
      (r) =>
        r.full_name?.toLowerCase().includes(q) ||
        r.mobile_no?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q),
    );
  }, [query, users]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    try {
      await deleteData(`/user/${id}/`);
      await refetchResource("users", "/user/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((r) => ({
      "Full Name": r.full_name || "-",
      "Mobile No": r.mobile_no || "-",
      Email: r.email || "-",
      City: r.address_data?.city || "-",
      State: r.address_data?.state || "-",
      Country: r.address_data?.country || "-",
      Latitude: r.latitude ?? "-",
      Longitude: r.longitude ?? "-",
      "Nearby Drivers": r.nearby_driver_count ?? 0,
      "Nearby Driver Names": r.nearby_drivers?.length
        ? r.nearby_drivers.map((d) => d.name).join(", ")
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Customers_${today}.xlsx`);
  };

  // When ride history is open → hide customer list, show only rides
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
        entityType="user"
        entityLabel={rideHistoryTarget?.full_name || ""}
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
            <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Customers</span>
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
            placeholder="Filter by mobile"
            value={mobileFilter}
            onChange={(e) => setMobileFilter(e.target.value)}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Mobile no</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.full_name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.mobile_no}</td>
                  <td className="px-4 py-3 text-gray-700">{r.email}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {r?.city ? r.city : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r?.state ? r.state : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r?.country ? r.country : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <>
                        <Link to={`/dashboard/customer-detail/${r.user_id}`}>
                          <button className="text-sm px-1 text-gray-700 cursor-pointer">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => openRideHistory(r)}
                          className="text-sm px-1 text-blue-600 cursor-pointer"
                          title="Ride History"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-sm px-1 text-red-600 cursor-pointer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No Customers found
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
      </div>

      {/* <RideHistoryModal
        isOpen={rideHistoryOpen}
        onClose={() => setRideHistoryOpen(false)}
        entityId={rideHistoryTarget?.id}
        entityType="user"
        entityLabel={rideHistoryTarget?.full_name || ""}
      /> */}
    </div>
  );
}