import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { ArrowLeft } from "lucide-react";

const getStatusChip = (status) => {
  switch (status) {
    case "accept":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Accepted
        </span>
      );
    case "pending":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          Pending
        </span>
      );
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Completed
        </span>
      );
    case "cancle":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
          Canceled
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
};

export default function RideDetail() {
  const { id } = useParams();
  const { baseUrl, getLocationFromCoords } = useAppContext();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`${baseUrl}/ride_request/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch ride details");
        const data = await res.json();

        const rideData = data.data || data;

        // Get pickup and drop locations from coordinates
        const pickupLocation = await getLocationFromCoords(
          rideData.pickupLat,
          rideData.pickupLng
        );
        const dropLocation = await getLocationFromCoords(
          rideData.dropLat,
          rideData.dropLng
        );

        setRide({
          ...rideData,
          pickupLocation,
          dropLocation,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [baseUrl, getLocationFromCoords, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No ride found.
      </div>
    );
  }

  function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cab Booking Detail</h1>
          <div className="text-sm text-gray-500">
            Dashboard{" "}
            <span className="text-orange-500"> / Cab Booking Detail</span>
          </div>
        </div>
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Full Name</span>
              <span className="mr-2">:</span>
              <span>{ride.user_data?.full_name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{ride.user_data?.email || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Mobile No.</span>
              <span className="mr-2">:</span>
              <span>{ride.user_data?.mobile_no || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">User ID</span>
              <span className="mr-2">:</span>
              <span>{ride.user_data?.user_id || "-"}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Vehicle Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Brand</span>
              <span className="mr-2">:</span>
              <span>{ride.vehicle_type_data?.brand_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Model</span>
              <span className="mr-2">:</span>
              <span>{ride.vehicle_type_data?.model_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Type</span>
              <span className="mr-2">:</span>
              <span>{ride.vehicle_type_data?.type_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Seats</span>
              <span className="mr-2">:</span>
              <span>{ride.vehicle_type_data?.seats || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Fuel Type</span>
              <span className="mr-2">:</span>
              <span>{ride.vehicle_type_data?.fuelType || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Driver Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Driver Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Name</span>
              <span className="mr-2">:</span>
              <span>{ride.driver_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{ride.driver_data?.email || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Mobile No.</span>
              <span className="mr-2">:</span>
              <span>{ride.driver_data?.phone || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Status</span>
              <span className="mr-2">:</span>
              <span>{ride.driver_data?.status || "-"}</span>
            </div>
          </div>
        </div>
      {/* Ride Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Ride Info
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-36">Status</span>
            <span className="mr-2">:</span>
            <span>{getStatusChip(ride.status)}</span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Ride Type</span>
            <span className="mr-2">:</span>
            <span className="capitalize">{ride.ride_type || "-"}</span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Payment Mode</span>
            <span className="mr-2">:</span>
            <span>{ride.paymentmode || "-"}</span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Distance</span>
            <span className="mr-2">:</span>
            <span>
              {ride.distance_km ? `${ride.distance_km} km` : "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Duration</span>
            <span className="mr-2">:</span>
            <span>
              {ride.duration_min ? `${ride.duration_min} mins` : "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Estimated Fare</span>
            <span className="mr-2">:</span>
            <span>₹{ride.estimated_fare || "-"}</span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Created At</span>
            <span className="mr-2">:</span>
            <span>{formatDate(ride.created_at) || "-"}</span>
          </div>

          <div className="flex">
            <span className="font-medium w-36">Referral Code</span>
            <span className="mr-2">:</span>
            <span className="text-gray-600">
              {ride.referral_code || "Not Used"}
            </span>
          </div>
        </div>
      </div>
      </div>
      {/* Pickup & Drop */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Ride Locations
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-36">Pickup Location</span>
            <span className="mr-2">:</span>
            <span>{ride.pickupLocation || "Not available"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-36">Drop Location</span>
            <span className="mr-2">:</span>
            <span>{ride.dropLocation || "Not available"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
