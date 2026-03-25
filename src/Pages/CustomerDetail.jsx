import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { Link } from "react-router-dom";

export default function CustomerDetail() {
  const { id } = useParams(); // get ID from URL
  const { baseUrl } = useAppContext(); // assuming baseUrl is available in context

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${baseUrl}/user/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch customer details");
        const data = await res.json();
        console.log(data.data)
        setCustomer(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [baseUrl, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No customer found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Customer Detail</h1>
        <div className="text-sm text-gray-500">
          Dashboard <Link to="/dashboard/customers">/ Customers</Link> <span className="text-orange-500"> / Customer Detail</span>
        </div>
      </div>

      {/* User Details Box */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Detail</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-32">Name</span>
            <span className="mr-2">:</span>
            <span>{customer.full_name || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Phone Number</span>
            <span className="mr-2">:</span>
            <span>{customer.mobile_no || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Email</span>
            <span className="mr-2">:</span>
            <span>{customer.email || "-"}</span>
          </div>
        </div>
      </div>
      {/* Addresses */}
      {Array.isArray(customer.address) && customer.address.length > 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Addresses</h2>
          <div className="space-y-4">
            {customer.address.map((addr, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Address {index + 1}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : customer.address ? (
        // if it's a single object instead of array
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Address</h2>
          <p className="text-sm text-gray-600">
            {customer.address.street}, {customer.address.city},{" "}
            {customer.address.state} - {customer.address.pincode}
          </p>
        </div>
      ) : null}
    </div>
  );
}
