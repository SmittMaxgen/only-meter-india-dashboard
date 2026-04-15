import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

export default function DriverDetail() {
  const { id } = useParams();
  const { baseUrl, getLocationFromCoords } = useAppContext();

  const [driver, setDriver] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Default summary structure
  const defaultSummary = {
    daily: { total_earnings: 0, total_trips: 0 },
    weekly: { total_earnings: 0, total_trips: 0 },
    monthly: { total_earnings: 0, total_trips: 0 },
  };

  useEffect(() => {
    const fetchDriver = async () => {
      const res = await fetch(`${baseUrl}/driver/${id}/`);
      if (!res.ok) throw new Error("Failed to fetch driver details");

      const data = await res.json();
      const driverData = data.data || data;

      const location = await getLocationFromCoords(
        driverData?.lat,
        driverData?.lng,
      );

      setDriver({ ...driverData, location });
    };

    const fetchSummary = async () => {
      try {
        const res = await fetch(`${baseUrl}/ride_request/driver/${id}/`);

        if (!res.ok) {
          setSummary(defaultSummary);
          return;
        }

        const data = await res.json();
        setSummary(data?.summary || defaultSummary);
      } catch (error) {
        console.error("Summary error:", error);
        setSummary(defaultSummary);
      }
    };

    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDriver(), fetchSummary()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [baseUrl, getLocationFromCoords, id]);

  const handleVerificationUpdate = async (status) => {
    const confirmResult = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this driver as "${status}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setUpdating(true);

      const res = await fetch(`${baseUrl}/driver/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verification: status }),
      });

      if (!res.ok) throw new Error("Failed to update verification status");

      const updated = await res.json();
      const updatedData = updated.data || updated;

      setDriver((prev) => ({
        ...prev,
        verification: updatedData.verification,
      }));

      Swal.fire({
        title: "Success!",
        text: `Driver verification updated to "${status}".`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating verification.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );

  if (!driver)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No driver found.
      </div>
    );

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
        <h1 className="text-xl font-semibold text-gray-900">Driver Detail</h1>
        <div className="text-sm text-gray-500">
          Dashboard <Link to="/dashboard/driver">/ Drivers</Link>{" "}
          <span className="text-orange-500">/ Driver Detail</span>
        </div>
      </div>

      {/* Personal + Vehicle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Personal Details">
          <Detail label="Name" value={driver.name} />
          <Detail label="Email" value={driver.email} />
          <Detail label="Phone" value={driver.phone} />
          <Detail label="Status" value={driver.status} />
          <Detail
            label="Created At"
            value={driver.created_at ? formatDate(driver.created_at) : "-"}
          />

          {driver.verification !== "approved" && (
            <div className="flex space-x-3 mt-3">
              <button
                onClick={() => handleVerificationUpdate("approved")}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-1 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => handleVerificationUpdate("failed")}
                disabled={updating}
                className="bg-red-600 text-white px-4 py-1 rounded-lg"
              >
                Fail
              </button>
            </div>
          )}
        </InfoCard>

        <InfoCard title="Vehicle Details">
          <Detail
            label="Brand"
            value={driver?.vehicle_data?.brand_data?.name}
          />
          <Detail
            label="Model"
            value={driver?.vehicle_data?.model_data?.name}
          />
          <Detail label="Type" value={driver?.vehicle_data?.type_data?.name} />
          <Detail label="Seats" value={driver?.vehicle_data?.seats} />
          <Detail label="Mode" value={driver?.vehicle_data?.vehicleMode} />
        </InfoCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            License Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <Detail label="License Number" value={driver.license_no} />
            <Detail label="License Expiry Date" value={driver.license_expiry} />
            {driver.license_doc && (
              <a
                href={`https://onlymeterindia.info${driver.license_doc}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://onlymeterindia.info${driver.license_doc}`}
                  alt="License"
                  className="h-32 w-48 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                />
              </a>
            )}
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Membership Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <Detail
              label="Membership Type"
              value={driver.membership_type || "N/A"}
            />
            <Detail
              label="Plan Purchased ID"
              value={driver.plan_purchased_id || "N/A"}
            />
            <Detail
              label="Subscription ID"
              value={driver.subscription_id || "N/A"}
            />
            <Detail
              label="Plan Purchased On"
              value={
                driver.plan_purchased_date_time
                  ? formatDate(driver.plan_purchased_date_time)
                  : "N/A"
              }
            />
            <Detail
              label="Plan Expiry Date"
              value={
                driver.plan_expire_date_time
                  ? formatDate(driver.plan_expire_date_time)
                  : "N/A"
              }
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <InfoCard title="Location">
        <p className="text-sm text-gray-600">
          {driver.location || "Location not available"}
        </p>
      </InfoCard>

      {/* Earnings Summary */}
      <InfoCard title="Earnings Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Daily"
            earnings={summary?.daily?.total_earnings}
            trips={summary?.daily?.total_trips}
          />
          <SummaryCard
            title="Weekly"
            earnings={summary?.weekly?.total_earnings}
            trips={summary?.weekly?.total_trips}
          />
          <SummaryCard
            title="Monthly"
            earnings={summary?.monthly?.total_earnings}
            trips={summary?.monthly?.total_trips}
          />
        </div>
      </InfoCard>
    </div>
  );
}

/* Reusable Card */
function InfoCard({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-2 text-sm text-gray-700">{children}</div>
    </div>
  );
}

/* Detail Row */
function Detail({ label, value }) {
  return (
    <div className="flex">
      <span className="font-medium w-40">{label}</span>
      <span className="mr-2">:</span>
      <span>{value || "-"}</span>
    </div>
  );
}

/* Summary Card */
function SummaryCard({ title, earnings, trips }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div>₹ {earnings?.toFixed(2) || "0.00"}</div>
        <div>{trips || 0} Trips</div>
      </div>
    </div>
  );
}
