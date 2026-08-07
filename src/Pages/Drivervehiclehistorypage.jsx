import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

export default function DriverVehicleHistoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { baseUrl } = useAppContext();

  const driverLabel = location.state?.driverLabel || "";

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updatingVerifiedId, setUpdatingVerifiedId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleVerifiedToggle = async (vehicleId, nextValue) => {
    try {
      setUpdatingVerifiedId(vehicleId);
      const res = await fetch(`${baseUrl}/driver_vehicle/${vehicleId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ verified: nextValue }),
      });
      if (!res.ok) throw new Error("Failed to update verification status");
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, verified: nextValue } : v,
        ),
      );
      setSelectedVehicle((prev) =>
        prev && prev.id === vehicleId ? { ...prev, verified: nextValue } : prev,
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: nextValue ? "success" : "error",
        title: nextValue ? "Vehicle Verified" : "Vehicle Unverified",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Verified toggle failed:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update verification status",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } finally {
      setUpdatingVerifiedId(null);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/driver_vehicle/driver/${id}/`, {
          headers: { ...getAuthHeaders() },
        });
        const json = await res.json();
        setVehicles(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch driver vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVehicles();
  }, [id, baseUrl]);

  const docUrl = (path) => (path ? `${baseUrl}${path}` : null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedVehicle
                ? `Vehicle #${selectedVehicle.id}`
                : `Vehicles${driverLabel ? ` — ${driverLabel}` : ""}`}
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard{" "}
              <span className="text-orange-500">/ Drivers / Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* List / Detail */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!v.verified}
                              disabled={updatingVerifiedId === v.id}
                              onChange={(e) =>
                                handleVerifiedToggle(v.id, e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </td>{" "}
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
            <button
              onClick={() => setSelectedVehicle(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to vehicle list
            </button>

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
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={!!selectedVehicle.verified}
                    disabled={updatingVerifiedId === selectedVehicle.id}
                    onChange={(e) =>
                      handleVerifiedToggle(selectedVehicle.id, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
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
  );
}
