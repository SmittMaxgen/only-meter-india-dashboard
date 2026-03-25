import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";

const getStatusChip = (status) => {
  switch (status) {
    case "active":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Active
        </span>
      );
    case "created":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          Created
        </span>
      );
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Completed
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

export default function DriverPlanDetail() {
  const { id } = useParams();
  const { baseUrl } = useAppContext();

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${baseUrl}/subscriptions/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch plan details");
        const data = await res.json();
        setPlanData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [baseUrl, id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No plan details found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Driver Subscription Detail</h1>
        <div className="text-sm text-gray-500">
          Dashboard <Link to="/dashboard/driver-subscription">/ Driver Subscription</Link>{" "}
          <span className="text-orange-500">/ Driver Subscription Detail</span>
        </div>
      </div>

      {/* Driver + Plan Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Driver Info */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Driver Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Name</span>
              <span className="mr-2">:</span>
              <span>{planData.driver_data.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{planData.driver_data.email}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Phone</span>
              <span className="mr-2">:</span>
              <span>{planData.driver_data.phone}</span>
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Plan Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-36">Id</span>
              <span className="mr-2">:</span>
              <span>{planData.plan_data.razorpay_plan_id}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Name</span>
              <span className="mr-2">:</span>
              <span>{planData.plan_data.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Amount</span>
              <span className="mr-2">:</span>
              <span>
                {planData.plan_data.amount}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Interval</span>
              <span className="mr-2">:</span>
              <span>{planData.plan_data.interval}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Purchase Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 border-gray-200">
          <div className="flex">
            <span className="font-medium w-40">Status</span>
            <span className="mr-2">:</span>
            <span>
              {getStatusChip(planData.status)}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Start At</span>
            <span className="mr-2">:</span>
            <span>{formatDate(planData.start_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
