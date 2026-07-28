import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

/**
 * @param {() => void} onClose
 * @param {number|string} entityId - driver id or user id
 * @param {"driver"|"user"} entityType
 * @param {string} entityLabel - display name shown in the header
 */
export default function RideHistoryModal({
  onClose,
  entityId,
  entityType,
  entityLabel,
}) {
  const { baseUrl } = useAppContext();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!entityId) return;
    setSelectedRide(null);

    const fetchRides = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          // `${baseUrl}/${entityType}_ride_history/${entityId}/`,
          `${baseUrl}/${entityType}_ride_history/${180}/`, // hardcoded test id – remove when done testing
          { headers: { ...getAuthHeaders() } },
        );
        const json = await res.json();
        const list = Array.isArray(json.data)
          ? json.data
          : json.data
            ? [json.data]
            : [];
        setRides(list);
      } catch (err) {
        console.error("Failed to fetch ride history:", err);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [entityId, entityType, baseUrl]);

  const handleSelectRide = async (rideId) => {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={selectedRide ? () => setSelectedRide(null) : onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedRide
                ? `Ride #${selectedRide.id}`
                : `Ride History — ${entityLabel || ""}`}
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
        {!selectedRide && (
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

            {!loading && rides.length > 0 && (
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
                    </tr>
                  </thead>
                  <tbody>
                    {rides.map((ride) => (
                      <tr
                        key={ride.id}
                        onClick={() => handleSelectRide(ride.id)}
                        className="border-t border-gray-100 hover:bg-orange-50 cursor-pointer"
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
                            ? new Date(ride.created_at).toLocaleString("en-IN")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {selectedRide && (
          <>
            {detailLoading ? (
              <div className="py-10 text-center text-gray-500">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="mt-3">Loading ride details...</div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
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
                    <div className="text-gray-400">Created At</div>
                    <div className="font-medium text-gray-900">
                      {selectedRide.created_at
                        ? new Date(selectedRide.created_at).toLocaleString(
                            "en-IN",
                          )
                        : "-"}
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
