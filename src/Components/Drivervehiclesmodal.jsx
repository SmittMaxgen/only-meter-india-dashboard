import { useEffect, useState } from "react";
import { XMarkIcon, ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

/**
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {number|string} driverId
 * @param {string} driverLabel - display name shown in the header
 */
export default function DriverVehiclesModal({
  isOpen,
  onClose,
  driverId,
  driverLabel,
}) {
  const { baseUrl } = useAppContext();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!isOpen || !driverId) return;
    setSelectedVehicle(null);

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/driver_vehicle/driver/${driverId}/`,
          { headers: { ...getAuthHeaders() } },
        );
        const json = await res.json();
        setVehicles(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch driver vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [isOpen, driverId, baseUrl]);

  if (!isOpen) return null;

  const docUrl = (path) => (path ? `${baseUrl}${path}` : null);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            {selectedVehicle && (
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedVehicle
                ? `Vehicle #${selectedVehicle.id}`
                : `Vehicles — ${driverLabel || ""}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5">
          {!selectedVehicle && (
            <>
              {loading && (
                <div className="py-10 text-center text-gray-500">
                  <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="mt-3">Loading vehicles...</div>
                </div>
              )}

              {!loading && vehicles.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  No vehicles found for this driver.
                </div>
              )}

              {!loading && vehicles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-medium">Vehicle</th>
                        <th className="px-3 py-2 font-medium">Type</th>
                        <th className="px-3 py-2 font-medium">Mode</th>
                        <th className="px-3 py-2 font-medium">Year</th>
                        <th className="px-3 py-2 font-medium">RC Number</th>
                        <th className="px-3 py-2 font-medium">Verified</th>
                        <th className="px-3 py-2 font-medium">Selected</th>
                        <th className="px-3 py-2 font-medium text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v) => (
                        <tr
                          key={v.id}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">
                            {v.brand_data?.name} {v.model_data?.name}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {v.type_data?.name || "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-700 capitalize">
                            {v.vehicleMode || "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {v.vehicle_year || "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {v.rc_number || "-"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                v.verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {v.verified ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                v.is_selected
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {v.is_selected ? "Active" : "-"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => setSelectedVehicle(v)}
                              className="text-gray-600 hover:text-gray-800"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {selectedVehicle && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400">Brand</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.brand_data?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Model</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.model_data?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Type</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.type_data?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Mode</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {selectedVehicle.vehicleMode || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Year</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.vehicle_year || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Seats</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.seats || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Fuel Type</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.fuelType || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Ownership</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {selectedVehicle.ownership_type || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Verified</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.verified ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Currently Selected</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.is_selected ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Permit</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.permit || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Share Status</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.share_status || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Created At</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.created_at
                      ? new Date(selectedVehicle.created_at).toLocaleString(
                          "en-IN",
                        )
                      : "-"}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400">RC Number</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.rc_number || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Insurance Number</div>
                  <div className="font-medium text-gray-900">
                    {selectedVehicle.insurance_number || "-"}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-3">
                {docUrl(selectedVehicle.rc_image) && (
                  <a
                    href={docUrl(selectedVehicle.rc_image)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    RC Front
                  </a>
                )}
                {docUrl(selectedVehicle.rc_back_image) && (
                  <a
                    href={docUrl(selectedVehicle.rc_back_image)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    RC Back
                  </a>
                )}
                {docUrl(selectedVehicle.insurance_image) && (
                  <a
                    href={docUrl(selectedVehicle.insurance_image)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Insurance
                  </a>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="text-gray-400 mb-1">Driver</div>
                <div className="font-medium text-gray-900">
                  {selectedVehicle.driver_data?.first_name}{" "}
                  {selectedVehicle.driver_data?.last_name}
                </div>
                <div className="text-gray-500">
                  {selectedVehicle.driver_data?.phone || "-"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
