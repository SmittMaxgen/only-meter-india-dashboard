import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";

export default function DriverDetail() {
  const { id } = useParams();
  const { baseUrl } = useAppContext();

  const [driverVehicleData, setDriverVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`${baseUrl}/driver_vehicle/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch driver details");
        const data = await res.json();
        setDriverVehicleData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [baseUrl, id]);

  const handleApprove = async () => {
    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`${baseUrl}/driver_vehicle/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true }),
      });

      if (!res.ok) throw new Error("Failed to approve verification");

      const data = await res.json();
      setDriverVehicleData((prev) => ({ ...prev, verified: true }));
      setMessage("Driver verification approved successfully!");
    } catch (error) {
      setMessage("Error: Unable to approve verification.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!driverVehicleData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No driver vehicle found.
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

  function FileDisplay({ fileUrl, fileName, alt = 'File' }) {
  const [fileError, setFileError] = useState(false);

  const getFileInfo = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const pdfExtension = 'pdf';
    
    return {
      extension,
      isImage: imageExtensions.includes(extension),
      isPdf: extension === pdfExtension,
      isOther: !imageExtensions.includes(extension) && extension !== pdfExtension
    };
  };

  const fileInfo = getFileInfo(fileUrl);
  const fullUrl = `${baseUrl}${fileUrl}`;

  const handleClick = () => {
    window.open(fullUrl, '_blank');
  };

  const handleError = () => {
    setFileError(true);
  };

  const renderContent = () => {
    if (fileError) {
      return (
        <div className="h-40 w-64 flex items-center justify-center bg-red-50">
          <span className="text-sm text-red-500">Failed to load</span>
        </div>
      );
    }

    if (fileInfo.isImage) {
      return (
        <img
          src={fullUrl}
          alt={alt}
          className="h-40 w-64 object-cover"
          onError={handleError}
        />
      );
    }

    if (fileInfo.isPdf) {
      return (
        <div className="h-40 w-64 flex flex-col items-center justify-center bg-red-50">
          <svg className="w-10 h-10 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12v-2H4v2zM4 14h12v-2H4v2zM4 10h12V8H4v2zM4 6h12V4H4v2zM2 2h16v16H2V2z"/>
          </svg>
          <span className="text-xs text-gray-600">{fileName} PDF Document</span>
        </div>
      );
    }

    return (
      <div className="h-40 w-64 flex flex-col items-center justify-center bg-gray-50">
        <svg className="w-10 h-10 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H9zm0 2h6v12H9V4z"/>
        </svg>
        <span className="text-xs text-gray-600">{fileInfo.extension?.toUpperCase() || 'File'}</span>
      </div>
    );
  };

  return (
    <div 
      className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 bg-white hover:border-orange-500 transition-all duration-200 shadow-sm hover:shadow-md w-64"
      onClick={handleClick}
    >
      {/* Main Content */}
      <div className="relative">
        {renderContent()}
        
        {/* Simple Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />      
      </div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Driver Vehicle Detail
          </h1>
          <div className="text-sm text-gray-500">
            Dashboard <Link to="/dashboard/driver-vehicles">/ Driver Vehicle</Link>{" "}
            <span className="text-orange-500">/ Detail</span>
          </div>
        </div>

        {/* Approve Button */}
        {!driverVehicleData.verified ? (
          <button
            onClick={handleApprove}
            disabled={updating}
            className={`px-4 py-2 rounded-md text-white ${
              updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {updating ? "Approving..." : "Approve Verification"}
          </button>
        ) : (
          <span className="text-green-600 font-medium">Verified ✅</span>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.startsWith("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Driver + Vehicle Info */}
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
              <span>{driverVehicleData.driver_data.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.driver_data.email}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Phone</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.driver_data.phone}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Status</span>
              <span className="mr-2">:</span>
              <span
                className={`${
                  driverVehicleData.driver_data.status === "online"
                    ? "text-green-600"
                    : "text-red-600"
                } font-medium`}
              >
                {driverVehicleData.driver_data.status}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-36">Verified</span>
              <span className="mr-2">:</span>
              <span
                className={`${
                  driverVehicleData.verified ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                {driverVehicleData.verified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Vehicle Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex">
              <span className="font-medium w-40">Brand</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.vehicle_type_data.brand_data?.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-40">Model</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.vehicle_type_data.model_data?.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-40">Type</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.vehicle_type_data.type_data?.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-40">Seats</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.vehicle_type_data.seats}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-40">Fuel Type</span>
              <span className="mr-2">:</span>
              <span>{driverVehicleData.vehicle_type_data.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Documents */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Vehicle Documents
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700">RC Number: {driverVehicleData.rc_number || "-"}</p>
            {driverVehicleData.rc_image && (
              <img
                src={`${baseUrl}${driverVehicleData.rc_image}`}
                alt="RC Document"
                className="h-40 w-64 object-cover rounded-md border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  window.open(`${baseUrl}${driverVehicleData.rc_image}`, "_blank")
                }
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Insurance Number: {driverVehicleData.insurance_number || "-"}
            </p>
            {driverVehicleData.insurance_image && (
              <img
                src={`${baseUrl}${driverVehicleData.insurance_image}`}
                alt="Insurance Document"
                className="h-40 w-64 object-cover rounded-md border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  window.open(
                    `${baseUrl}${driverVehicleData.insurance_image}`,
                    "_blank"
                  )
                }
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Aadhar Card:</p>
            {driverVehicleData.aadhar_card && (
              <FileDisplay 
                fileUrl={driverVehicleData.aadhar_card}
                fileName="Aadhar Card"
                alt="Aadhar Card"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Pan Card:</p>
            {driverVehicleData.pan_card && (
              <FileDisplay 
                fileUrl={driverVehicleData.pan_card}
                fileName="Pan Card"
                alt="Pan Card"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Permit:</p>
             {driverVehicleData.permit && (
              <FileDisplay 
                fileUrl={driverVehicleData.permit}
                fileName="Permit"
                alt="Permit"
              />
            )}
          </div>
        </div>
      </div>

      {/* Extra Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Info
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex">
            <span className="font-medium w-40">Share Status</span>
            <span className="mr-2">:</span>
            <span>{driverVehicleData.share_status || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Ownership Type</span>
            <span className="mr-2">:</span>
            <span>{driverVehicleData.ownership_type || "-"}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Created At</span>
            <span className="mr-2">:</span>
            <span>{formatDate(driverVehicleData.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
