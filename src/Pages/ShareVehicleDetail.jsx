import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";

const getStatusChip = (status) => {
  switch (status) {
    case "Accept":
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
  const { baseUrl } = useAppContext();

  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`${baseUrl}/vehicle_share_requests/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch ride details");
       const data = await res.json();
        console.log(data.data)
        setShare(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [baseUrl, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!share) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No share vehicle found.
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
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Share Vehicle Detail</h1>
        <div className="text-sm text-gray-500">
          Dashboard <Link to="/dashboard/share-vehicles">/ Share Vehicle</Link>{" "}
          <span className="text-orange-500"> / Share Vehicle Detail</span>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Owner Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Full Name</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.driver_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.driver_data?.email || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Mobile No.</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.driver_data?.phone || "-"}</span>
            </div>
          </div>
        </div>

        {/* Requestor Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Requestor Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Name</span>
              <span className="mr-2">:</span>
              <span>{share.requestor_driver_data?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{share.requestor_driver_data?.email || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Mobile No.</span>
              <span className="mr-2">:</span>
              <span>{share.requestor_driver_data?.phone || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Vehicle Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Vehicle Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Brand</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.vehicle_type_data?.brand || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Model</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.vehicle_type_data?.model || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Type</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.vehicle_type_data?.type || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">RC Number</span>
              <span className="mr-2">:</span>
              <span>{share.vehicle_data?.rc_number || "-"}</span>
            </div>
          </div>
        </div>
      {/* Share Vehicle Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4"> Share Vehicle Info</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-36">Status</span>
            <span className="mr-2">:</span>
            <span>
              {getStatusChip(share.status)}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-36">Requested Start Time</span>
            <span className="mr-2">:</span>
            <span>{formatDate(share.requested_start_time) || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-36">Requested End Time</span>
            <span className="mr-2">:</span>
            <span>{formatDate(share.requested_end_time) || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-36">Created At</span>
            <span className="mr-2">:</span>
            <span>{formatDate(share.created_at) || "-"}</span>
          </div>
        </div>
      </div>
      </div>
      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Info
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-36">Message</span>
            <span className="mr-2">:</span>
            <span>{share.message || "Not available"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-36">Assignment Id</span>
            <span className="mr-2">:</span>
            <span>{share.assignment_id || "Not available"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
