import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

/**
 * @param {() => void} onClose
 * @param {number|string} entityId - driver id or user id
 * @param {"driver"|"user"} entityType
 * @param {string} entityLabel - display name shown in the header
 */

const humanizeKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

export default function RideHistoryModal({
  onClose,
  entityId,
  entityType,
  entityLabel,
  initialRideId,
}) {
  const { baseUrl } = useAppContext();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ride details (fetched via API)
  const [selectedRide, setSelectedRide] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Entity (driver/customer) details — no API call, uses data already in the row
  const [selectedEntity, setSelectedEntity] = useState(null);
// Ride ID search
  const [searchRideId, setSearchRideId] = useState("");
  const [searchError, setSearchError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const PAGE_SIZE = 20; // adjust to match backend page size

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Reset to page 1 whenever the entity changes
  useEffect(() => {
    setPage(1);
    setSelectedRide(null);
    setSelectedEntity(null);
  }, [entityId, entityType]);

 useEffect(() => {
    if (!entityId || initialRideId) return;

    const fetchRides = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/${entityType}_ride_history/${entityId}/?page=${page}`,
          { headers: { ...getAuthHeaders() } },
        );
        const json = await res.json();
        const list = Array.isArray(json.data)
          ? json.data
          : json.data
            ? [json.data]
            : [];
        setRides(list);
        setCount(json.count ?? list.length);
        setHasNext(Boolean(json.next));
        setHasPrevious(Boolean(json.previous));
      } catch (err) {
        console.error("Failed to fetch ride history:", err);
        setRides([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [entityId, entityType, baseUrl, page]);

  // Auto-load a specific ride when opened directly via Ride ID search
  useEffect(() => {
    if (!initialRideId) return;
    handleViewRideDetails(initialRideId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRideId]);

  // Eye icon — no API call, just use the entity object already present on the row
  const handleViewEntity = (ride) => {
    setSelectedRide(null);
    const entityData =
      entityType === "driver" ? ride.driver_data : ride.user_data;
    setSelectedEntity(entityData || null);
  };

  // Search by Ride ID — calls the same ride-detail endpoint directly
  const handleSearchRide = async () => {
    if (!searchRideId.trim()) return;
    setSearchError("");
    setSelectedEntity(null);
    setDetailLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/${entityType}_ride_history/ride/${searchRideId.trim()}/`,
        { headers: { ...getAuthHeaders() } },
      );
      const json = await res.json();
      if (json.data) {
        setSelectedRide(json.data);
      } else {
        setSearchError(`No ride found with ID ${searchRideId.trim()}`);
      }
    } catch (err) {
      console.error("Failed to fetch ride by ID:", err);
      setSearchError("Something went wrong while searching.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Ride details icon — API call
  const handleViewRideDetails = async (rideId) => {
    setSelectedEntity(null);
    setDetailLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/${entityType}_ride_history/ride/${rideId}/`,
        { headers: { ...getAuthHeaders() } },
      );
      const json = await res.json();
      setSelectedRide(json.data || null);
    } catch (err) {
      console.error("Failed to fetch ride detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const goBack = () => {
    if (selectedEntity) return setSelectedEntity(null);
    if (selectedRide && !initialRideId) return setSelectedRide(null);
    onClose();
  };

  const headerTitle = selectedRide
    ? `Ride #${selectedRide.id}`
    : selectedEntity
      ? `${entityType === "driver" ? "Driver" : "Customer"} Details — ${entityLabel || ""}`
      : initialRideId
        ? `Ride #${initialRideId}`
        : `Ride History — ${entityLabel || ""}`;

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-gray-500 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {headerTitle}
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard{" "}
              <span className="text-orange-500">
                / {entityType === "driver" ? "Drivers" : "Customers"} / Ride
                History
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {initialRideId && !selectedRide && !selectedEntity && (
          <div className="py-10 text-center text-gray-500">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="mt-3">Loading ride details...</div>
          </div>
        )}

        {!selectedRide && !selectedEntity && !initialRideId && (
          <>
            {loading && (
              <div className="py-10 text-center text-gray-500">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="mt-3">Loading ride history...</div>
              </div>
            )}

            {!loading && rides.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                No ride history found.
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={searchRideId}
                onChange={(e) => {
                  setSearchRideId(e.target.value);
                  setSearchError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearchRide()}
                placeholder="Search by Ride ID..."
                className="w-full sm:w-64 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                onClick={handleSearchRide}
                className="px-4 py-2 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600"
              >
                Search
              </button>
            </div>
            {searchError && (
              <div className="text-sm text-red-600 mb-3">{searchError}</div>
            )}

            {!loading && rides.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-medium">Ride ID</th>
                        <th className="px-3 py-2 font-medium">Pickup</th>
                        <th className="px-3 py-2 font-medium">Drop</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Fare</th>
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rides.map((ride) => (
                        <tr
                          key={ride.id}
                          className="border-t border-gray-100 hover:bg-orange-50"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">
                            #{ride.id}
                          </td>
                          <td className="px-3 py-2 text-gray-700 max-w-xs truncate">
                            {ride.pickup_address || "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-700 max-w-xs truncate">
                            {ride.drop_address || "-"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                ride.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : ride.status === "cancle" ||
                                      ride.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {ride.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            ₹{ride.estimated_fare ?? "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                            {ride.created_at
                              ? new Date(ride.created_at).toLocaleString(
                                  "en-IN",
                                )
                              : "-"}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewEntity(ride)}
                                title={
                                  entityType === "driver"
                                    ? "View driver details"
                                    : "View customer details"
                                }
                                className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleViewRideDetails(ride.id)}
                                title="View ride details"
                                className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50"
                              >
                                <TruckIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Page {page} of {totalPages} · {count} total rides
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrevious || page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!hasNext}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Entity (driver/customer) details — rendered straight from row data, no API call */}
        {selectedEntity && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(selectedEntity)
                .filter(([, val]) => typeof val !== "object" || val === null)
                .map(([key, val]) => {
                  if (key === "license_doc" && val) {
                    return (
                      <div key={key}>
                        <div className="text-gray-400">{humanizeKey(key)}</div>
                        <a
                          href={`${baseUrl}${val}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-orange-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <div className="text-gray-400">{humanizeKey(key)}</div>
                      <div className="font-medium text-gray-900 break-all">
                        {formatValue(val)}
                      </div>
                    </div>
                  );
                })}
            </div>

            {Array.isArray(selectedEntity.nearby_drivers) &&
              selectedEntity.nearby_drivers.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-gray-400 mb-2">
                    Nearby Drivers (
                    {selectedEntity.nearby_driver_count ??
                      selectedEntity.nearby_drivers.length}
                    )
                  </div>
                  <div className="space-y-1">
                    {selectedEntity.nearby_drivers.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-md px-3 py-1.5"
                      >
                        <span className="font-medium text-gray-800">
                          {d.name}
                        </span>
                        <span>{d.vehicle}</span>
                        <span>{d.distance} km away</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Ride details — fetched via API */}
        {selectedRide && (
          <>
            {detailLoading ? (
              <div className="py-10 text-center text-gray-500">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="mt-3">Loading ride details...</div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-400">Status</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {selectedRide.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Fare</div>
                    <div className="font-medium text-gray-900">
                      ₹{selectedRide.estimated_fare ?? "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Distance</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.distance_km ?? "-"} km
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Duration</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.duration_min ?? "-"} min
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Payment Mode</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {selectedRide.paymentmode || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Trip Type</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {selectedRide.trip_type || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Reserved</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.is_reserved ? "Yes" : "No"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Scheduled</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.scheduled_later
                        ? selectedRide.scheduled_datetime
                          ? new Date(
                              selectedRide.scheduled_datetime,
                            ).toLocaleString("en-IN")
                          : "Yes"
                        : "No"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Created At</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.created_at
                        ? new Date(selectedRide.created_at).toLocaleString(
                            "en-IN",
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Started At</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.started_at
                        ? new Date(selectedRide.started_at).toLocaleString(
                            "en-IN",
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Arrived At</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.arrived_at
                        ? new Date(selectedRide.arrived_at).toLocaleString(
                            "en-IN",
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Waiting Charge</div>
                    <div className="font-medium text-gray-900">
                      ₹{selectedRide.vehicle_type_data?.waiting_charge ?? "0"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-400">Pickup Address</div>
                  <div className="font-medium text-gray-900">
                    {selectedRide.pickup_address || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Drop Address</div>
                  <div className="font-medium text-gray-900">
                    {selectedRide.drop_address || "-"}
                  </div>
                </div>

                {selectedRide.cancel_reason && (
                  <div>
                    <div className="text-gray-400">Cancel Reason</div>
                    <div className="font-medium text-red-600">
                      {selectedRide.cancel_reason}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400">Customer</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.user_data?.full_name || "-"}
                    </div>
                    <div className="text-gray-500">
                      {selectedRide.user_data?.mobile_no || "-"}
                    </div>
                    <div className="text-gray-500">
                      {selectedRide.user_data?.email || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Driver</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.driver_data
                        ? `${selectedRide.driver_data.first_name || ""} ${
                            selectedRide.driver_data.last_name || ""
                          }`
                        : "-"}
                    </div>
                    <div className="text-gray-500">
                      {selectedRide.driver_data?.phone || "-"}
                    </div>
                    <div className="text-gray-500">
                      {selectedRide.driver_data?.email || "-"}
                    </div>
                  </div>
                </div>

                {selectedRide.vehicle_type_data && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-gray-400 mb-1">Vehicle</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.vehicle_type_data.brand_data?.name}{" "}
                      {selectedRide.vehicle_type_data.model_data?.name} (
                      {selectedRide.vehicle_type})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 text-xs text-gray-500">
                      <div>
                        Fuel: {selectedRide.vehicle_type_data.fuelType || "-"}
                      </div>
                      <div>
                        Seats: {selectedRide.vehicle_type_data.seats ?? "-"}
                      </div>
                      <div>
                        Base Fare: ₹
                        {selectedRide.vehicle_type_data.baseFare ?? "-"}
                      </div>
                      <div>
                        Per Km: ₹
                        {selectedRide.vehicle_type_data.perKmRate ?? "-"}
                      </div>
                    </div>
                  </div>
                )}

                {Array.isArray(selectedRide.nearby_drivers) &&
                  selectedRide.nearby_drivers.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-gray-400 mb-2">
                        Nearby Drivers (
                        {selectedRide.nearby_driver_count ??
                          selectedRide.nearby_drivers.length}
                        )
                      </div>
                      <div className="space-y-1">
                        {selectedRide.nearby_drivers.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-md px-3 py-1.5"
                          >
                            <span className="font-medium text-gray-800">
                              {d.name}
                            </span>
                            <span>{d.vehicle}</span>
                            <span>{d.distance} km away</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
