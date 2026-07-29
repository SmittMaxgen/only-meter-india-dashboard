// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useAppContext } from "../Central_Store/app_context.jsx";
// import Swal from "sweetalert2";

// export default function DriverDetail() {
//   const { id } = useParams();
//   const { baseUrl, getLocationFromCoords, fetchedData } = useAppContext();

//   const [driver, setDriver] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const [editingVehicle, setEditingVehicle] = useState(false);
//   const [vehicleForm, setVehicleForm] = useState({});
//   const [savingVehicle, setSavingVehicle] = useState(false);

//   const [editingMembership, setEditingMembership] = useState(false);
//   const [membershipForm, setMembershipForm] = useState({});
//   const [savingMembership, setSavingMembership] = useState(false);

//   // Default summary structure
//   const defaultSummary = {
//     daily: { total_earnings: 0, total_trips: 0 },
//     weekly: { total_earnings: 0, total_trips: 0 },
//     monthly: { total_earnings: 0, total_trips: 0 },
//   };

//   useEffect(() => {
//     const fetchDriver = async () => {
//       const res = await fetch(`${baseUrl}/driver/${id}/`);
//       if (!res.ok) throw new Error("Failed to fetch driver details");

//       const data = await res.json();
//       const driverData = data.data || data;

//       // Set driver immediately so the page renders even if
//       // reverse-geocoding below fails or is slow.
//       setDriver({ ...driverData, location: null });

//       try {
//         const location = await getLocationFromCoords(
//           driverData?.lat,
//           driverData?.lng,
//         );
//         setDriver((prev) => (prev ? { ...prev, location } : prev));
//       } catch (geoErr) {
//         console.error("Location lookup failed:", geoErr);
//       }
//     };

//     const fetchSummary = async () => {
//       try {
//         const res = await fetch(`${baseUrl}/ride_request/driver/${id}/`);

//         if (!res.ok) {
//           setSummary(defaultSummary);
//           return;
//         }

//         const data = await res.json();
//         setSummary(data?.summary || defaultSummary);
//       } catch (error) {
//         console.error("Summary error:", error);
//         setSummary(defaultSummary);
//       }
//     };

//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         await Promise.all([fetchDriver(), fetchSummary()]);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [baseUrl, getLocationFromCoords, id]);

//   const handleVerificationChange = async (status) => {
//     if (!driver || status === driver.verification) return;

//     let cancellation_reason;

//     if (status === "cancelled") {
//       const { value: reason, isConfirmed } = await Swal.fire({
//         title: "Reason for Cancellation",
//         input: "textarea",
//         inputLabel: "Please provide a reason",
//         inputPlaceholder: "Type the reason here...",
//         showCancelButton: true,
//         confirmButtonText: "Submit",
//         confirmButtonColor: "#dc2626",
//         cancelButtonColor: "#6b7280",
//         inputValidator: (value) => {
//           if (!value || !value.trim()) {
//             return "A cancellation reason is required.";
//           }
//         },
//       });

//       if (!isConfirmed) return;
//       cancellation_reason = reason.trim();
//     } else {
//       const confirmResult = await Swal.fire({
//         title: "Are you sure?",
//         text: `You are about to mark this driver as "${status}".`,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: `Yes, ${status}`,
//         cancelButtonText: "Cancel",
//         confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
//         cancelButtonColor: "#6b7280",
//       });

//       if (!confirmResult.isConfirmed) return;
//     }

//     try {
//       setUpdating(true);

//       const token = localStorage.getItem("accessToken");
//       const payload = { verification: status };
//       if (status === "cancelled") {
//         payload.cancellation_reason = cancellation_reason;
//       }

//       const res = await fetch(`${baseUrl}/driver/${id}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to update verification status");

//       const updated = await res.json();
//       const updatedData = updated.data || updated;

//       setDriver((prev) => ({
//         ...prev,
//         verification: updatedData.verification,
//         cancellation_reason:
//           updatedData.cancellation_reason ??
//           payload.cancellation_reason ??
//           prev.cancellation_reason,
//       }));

//       Swal.fire({
//         title: "Success!",
//         text: `Driver verification updated to "${status}".`,
//         icon: "success",
//         confirmButtonColor: "#2563eb",
//       });
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error!",
//         text: "Something went wrong while updating verification.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const startEditVehicle = () => {
//     setVehicleForm({
//       brand_id: driver?.vehicle_data?.brand_data?.id || "",
//       model_id: driver?.vehicle_data?.model_data?.id || "",
//       type_id: driver?.vehicle_data?.type_data?.id || "",
//       seats: driver?.vehicle_data?.seats || "",
//       vehicleMode: driver?.vehicle_data?.vehicleMode || "",
//       fuelType: driver?.vehicle_data?.fuelType || "",
//     });
//     setEditingVehicle(true);
//   };

//   const handleVehicleSave = async () => {
//     if (!driver?.vehicle_data?.id) {
//       Swal.fire({
//         title: "Error!",
//         text: "No vehicle record found for this driver.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//       return;
//     }

//     try {
//       setSavingVehicle(true);
//       const token = localStorage.getItem("accessToken");

//       const res = await fetch(
//         `${baseUrl}/driver_vehicle/${driver.vehicle_data.id}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({
//             brand: vehicleForm.brand_id,
//             model: vehicleForm.model_id,
//             type: vehicleForm.type_id,
//             seats: vehicleForm.seats,
//             vehicleMode: vehicleForm.vehicleMode,
//             fuelType: vehicleForm.fuelType,
//           }),
//         },
//       );

//       if (!res.ok) throw new Error("Failed to update vehicle details");

//       const updated = await res.json();
//       const updatedData = updated.data || updated;

//       setDriver((prev) => ({
//         ...prev,
//         vehicle_data: { ...prev.vehicle_data, ...updatedData },
//       }));

//       setEditingVehicle(false);

//       Swal.fire({
//         title: "Success!",
//         text: "Vehicle details updated successfully.",
//         icon: "success",
//         confirmButtonColor: "#2563eb",
//       });
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error!",
//         text: "Something went wrong while updating vehicle details.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setSavingVehicle(false);
//     }
//   };

//   const startEditMembership = () => {
//     setMembershipForm({
//       membership_type: driver?.membership_type || "",
//       plan_purchased_id: driver?.plan_purchased_id || "",
//       subscription_id: driver?.subscription_id || "",
//       plan_purchased_date_time: driver?.plan_purchased_date_time
//         ? driver.plan_purchased_date_time.slice(0, 16)
//         : "",
//       plan_expire_date_time: driver?.plan_expire_date_time
//         ? driver.plan_expire_date_time.slice(0, 16)
//         : "",
//     });
//     setEditingMembership(true);
//   };

//   const handleMembershipSave = async () => {
//     try {
//       setSavingMembership(true);
//       const token = localStorage.getItem("accessToken");

//       const res = await fetch(`${baseUrl}/driver/${id}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({
//           membership_type: membershipForm.membership_type,
//           plan_purchased_id: membershipForm.plan_purchased_id,
//           subscription_id: membershipForm.subscription_id,
//           plan_purchased_date_time: membershipForm.plan_purchased_date_time
//             ? new Date(membershipForm.plan_purchased_date_time).toISOString()
//             : null,
//           plan_expire_date_time: membershipForm.plan_expire_date_time
//             ? new Date(membershipForm.plan_expire_date_time).toISOString()
//             : null,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update membership details");

//       const updated = await res.json();
//       const updatedData = updated.data || updated;

//       setDriver((prev) => ({
//         ...prev,
//         membership_type: updatedData.membership_type,
//         plan_purchased_id: updatedData.plan_purchased_id,
//         subscription_id: updatedData.subscription_id,
//         plan_purchased_date_time: updatedData.plan_purchased_date_time,
//         plan_expire_date_time: updatedData.plan_expire_date_time,
//       }));

//       setEditingMembership(false);

//       Swal.fire({
//         title: "Success!",
//         text: "Membership details updated successfully.",
//         icon: "success",
//         confirmButtonColor: "#2563eb",
//       });
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error!",
//         text: "Something went wrong while updating membership details.",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setSavingMembership(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64 text-gray-500">
//         Loading...
//       </div>
//     );

//   if (!driver)
//     return (
//       <div className="flex justify-center items-center h-64 text-gray-500">
//         No driver found.
//       </div>
//     );

//   function formatDate(d) {
//     const dt = new Date(d);
//     return dt.toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   }

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4">
//         <h1 className="text-xl font-semibold text-gray-900">Driver Detail</h1>
//         <div className="text-sm text-gray-500">
//           Dashboard <Link to="/dashboard/driver">/ Drivers</Link>{" "}
//           <span className="text-orange-500">/ Driver Detail</span>
//         </div>
//       </div>

//       {/* Personal + Vehicle */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InfoCard title="Personal Details">
//           <Detail label="ID" value={driver.id} />
//           <Detail label="Driver ID" value={driver.driver_id} />
//           <Detail
//             label="Name"
//             value={`${driver.first_name || ""} ${driver.last_name || ""}`.trim()}
//           />
//           <Detail label="Email" value={driver.email} />
//           <Detail label="Phone" value={driver.phone} />
//           <Detail label="City" value={driver.city} />
//           <Detail label="State" value={driver.state} />
//           <Detail label="Country" value={driver.country} />
//           <Detail
//             label="Address"
//             value={
//               driver.address && Object.keys(driver.address).length
//                 ? JSON.stringify(driver.address)
//                 : "-"
//             }
//           />
//           <Detail label="Status" value={driver.status} />
//           <Detail label="Vehicle Type" value={driver.vehicle_type} />
//           <Detail label="Referral Code" value={driver.referral_code} />
//           <Detail label="Bonus Amount" value={driver.bonus_amount} />
//           <Detail label="Membership" value={driver.membership ? "Yes" : "No"} />
//           <Detail label="GST Number" value={driver.gst_number} />
//           <Detail label="Device Token" value={driver.device_token} />
//           <Detail label="Password Hash" value={driver.password} />
//           <Detail
//             label="Created At"
//             value={driver.created_at ? formatDate(driver.created_at) : "-"}
//           />

//           <div className="mt-3">
//             <span className="font-medium w-40 inline-block">
//               Verification
//             </span>
//             <span className="mr-2">:</span>
//             <select
//               value={driver.verification || ""}
//               disabled={updating}
//               onChange={(e) => handleVerificationChange(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
//             >
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {driver.verification === "cancelled" &&
//             driver.cancellation_reason && (
//               <Detail
//                 label="Cancellation Reason"
//                 value={driver.cancellation_reason}
//               />
//             )}
//         </InfoCard>

//         <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Vehicle Details
//             </h2>
//             {!editingVehicle ? (
//               <button
//                 onClick={startEditVehicle}
//                 className="text-sm text-blue-600 font-medium hover:underline"
//               >
//                 Edit
//               </button>
//             ) : (
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleVehicleSave}
//                   disabled={savingVehicle}
//                   className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
//                 >
//                   {savingVehicle ? "Saving..." : "Save"}
//                 </button>
//                 <button
//                   onClick={() => setEditingVehicle(false)}
//                   disabled={savingVehicle}
//                   className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>

//           {!editingVehicle ? (
//             <div className="space-y-2 text-sm text-gray-700">
//               <Detail
//                 label="Brand"
//                 value={driver?.vehicle_data?.brand_data?.name}
//               />
//               <Detail
//                 label="Model"
//                 value={driver?.vehicle_data?.model_data?.name}
//               />
//               <Detail
//                 label="Type"
//                 value={driver?.vehicle_data?.type_data?.name}
//               />
//               <Detail label="Seats" value={driver?.vehicle_data?.seats} />
//               <Detail label="Mode" value={driver?.vehicle_data?.vehicleMode} />
//               <Detail
//                 label="Fuel Type"
//                 value={driver?.vehicle_data?.fuelType}
//               />
//             </div>
//           ) : (
//             <div className="space-y-3 text-sm text-gray-700">
//               <EditField label="Brand">
//                 <select
//                   value={vehicleForm.brand_id}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       brand_id: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 >
//                   <option value="">Select Brand</option>
//                   {(fetchedData?.brands || []).map((b) => (
//                     <option key={b.id} value={b.id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </EditField>
//               <EditField label="Model">
//                 <select
//                   value={vehicleForm.model_id}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       model_id: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 >
//                   <option value="">Select Model</option>
//                   {(fetchedData?.models || []).map((m) => (
//                     <option key={m.id} value={m.id}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </EditField>
//               <EditField label="Type">
//                 <select
//                   value={vehicleForm.type_id}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       type_id: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 >
//                   <option value="">Select Type</option>
//                   {(fetchedData?.types || []).map((t) => (
//                     <option key={t.id} value={t.id}>
//                       {t.name}
//                     </option>
//                   ))}
//                 </select>
//               </EditField>
//               <EditField label="Seats">
//                 <input
//                   type="number"
//                   value={vehicleForm.seats}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       seats: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 />
//               </EditField>
//               <EditField label="Mode">
//                 <input
//                   type="text"
//                   value={vehicleForm.vehicleMode}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       vehicleMode: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 />
//               </EditField>
//               <EditField label="Fuel Type">
//                 <input
//                   type="text"
//                   value={vehicleForm.fuelType}
//                   onChange={(e) =>
//                     setVehicleForm((prev) => ({
//                       ...prev,
//                       fuelType: e.target.value,
//                     }))
//                   }
//                   className="border border-gray-300 rounded-lg px-2 py-1 w-full"
//                 />
//               </EditField>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* License Details */}
//         <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             License Details
//           </h2>
//           <div className="space-y-2 text-sm text-gray-700">
//             <Detail label="License Number" value={driver.license_no} />
//             <Detail label="License Expiry Date" value={driver.license_expiry} />
//             {driver.license_doc && (
//               <a
//                 href={`${baseUrl}${driver.license_doc}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <img
//                   src={`${baseUrl}${driver.license_doc}`}
//                   alt="License"
//                   className="h-32 w-48 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
//                 />
//               </a>
//             )}
//           </div>
//         </div>

//         {/* Membership Details */}
//         <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Membership Details
//           </h2>
//           <div className="space-y-2 text-sm text-gray-700">
//             <Detail
//               label="Membership Type"
//               value={driver.membership_type || "N/A"}
//             />
//             <Detail
//               label="Plan Purchased ID"
//               value={driver.plan_purchased_id || "N/A"}
//             />
//             <Detail
//               label="Subscription ID"
//               value={driver.subscription_id || "N/A"}
//             />
//             <Detail
//               label="Plan Purchased On"
//               value={
//                 driver.plan_purchased_date_time
//                   ? formatDate(driver.plan_purchased_date_time)
//                   : "N/A"
//               }
//             />
//             <Detail
//               label="Plan Expiry Date"
//               value={
//                 driver.plan_expire_date_time
//                   ? formatDate(driver.plan_expire_date_time)
//                   : "N/A"
//               }
//             />
//           </div>
//         </div>
//       </div>

//       {/* Location */}
//       <InfoCard title="Location">
//         <p className="text-sm text-gray-600">
//           {driver.location || "Location not available"}
//         </p>
//       </InfoCard>

//       {/* Earnings Summary */}
//       <InfoCard title="Earnings Summary">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <SummaryCard
//             title="Daily"
//             earnings={summary?.daily?.total_earnings}
//             trips={summary?.daily?.total_trips}
//           />
//           <SummaryCard
//             title="Weekly"
//             earnings={summary?.weekly?.total_earnings}
//             trips={summary?.weekly?.total_trips}
//           />
//           <SummaryCard
//             title="Monthly"
//             earnings={summary?.monthly?.total_earnings}
//             trips={summary?.monthly?.total_trips}
//           />
//         </div>
//       </InfoCard>
//     </div>
//   );
// }

// /* Reusable Card */
// function InfoCard({ title, children }) {
//   return (
//     <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
//       <div className="space-y-2 text-sm text-gray-700">{children}</div>
//     </div>
//   );
// }

// /* Detail Row */
// function Detail({ label, value }) {
//   return (
//     <div className="flex">
//       <span className="font-medium w-40">{label}</span>
//       <span className="mr-2">:</span>
//       <span className="break-all">{value || "-"}</span>
//     </div>
//   );
// }

// /* Edit Field Row */
// function EditField({ label, children }) {
//   return (
//     <div className="flex items-center">
//       <span className="font-medium w-40">{label}</span>
//       <span className="mr-2">:</span>
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// }

// /* Summary Card */
// function SummaryCard({ title, earnings, trips }) {
//   return (
//     <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
//       <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
//       <div className="text-sm text-gray-600 space-y-1">
//         <div>₹ {earnings?.toFixed(2) || "0.00"}</div>
//         <div>{trips || 0} Trips</div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

export default function DriverDetail() {
  const { id } = useParams();
  const { baseUrl, getLocationFromCoords, fetchedData } = useAppContext();

  const [driver, setDriver] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({});
  const [savingVehicle, setSavingVehicle] = useState(false);

  const [editingMembership, setEditingMembership] = useState(false);
  const [membershipForm, setMembershipForm] = useState({});
  const [savingMembership, setSavingMembership] = useState(false);

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

      // Set driver immediately so the page renders even if
      // reverse-geocoding below fails or is slow.
      setDriver({ ...driverData, location: null });

      try {
        const location = await getLocationFromCoords(
          driverData?.lat,
          driverData?.lng,
        );
        setDriver((prev) => (prev ? { ...prev, location } : prev));
      } catch (geoErr) {
        console.error("Location lookup failed:", geoErr);
      }
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

  const handleVerificationChange = async (status) => {
    if (!driver || status === driver.verification) return;

    let cancellation_reason;

    if (status === "cancelled") {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Reason for Cancellation",
        input: "textarea",
        inputLabel: "Please provide a reason",
        inputPlaceholder: "Type the reason here...",
        showCancelButton: true,
        confirmButtonText: "Submit",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "A cancellation reason is required.";
          }
        },
      });

      if (!isConfirmed) return;
      cancellation_reason = reason.trim();
    } else {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to mark this driver as "${status}".`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${status}`,
        cancelButtonText: "Cancel",
        confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
        cancelButtonColor: "#6b7280",
      });

      if (!confirmResult.isConfirmed) return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("accessToken");
      const payload = { verification: status };
      if (status === "cancelled") {
        payload.cancellation_reason = cancellation_reason;
      }

      const res = await fetch(`${baseUrl}/driver/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update verification status");

      const updated = await res.json();
      const updatedData = updated.data || updated;

      setDriver((prev) => ({
        ...prev,
        verification: updatedData.verification,
        cancellation_reason:
          updatedData.cancellation_reason ??
          payload.cancellation_reason ??
          prev.cancellation_reason,
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

  const startEditVehicle = () => {
    setVehicleForm({
      brand_id: driver?.vehicle_data?.brand_data?.id || "",
      model_id: driver?.vehicle_data?.model_data?.id || "",
      type_id: driver?.vehicle_data?.type_data?.id || "",
      seats: driver?.vehicle_data?.seats || "",
      vehicleMode: driver?.vehicle_data?.vehicleMode || "",
      fuelType: driver?.vehicle_data?.fuelType || "",
    });
    setEditingVehicle(true);
  };

  const handleVehicleSave = async () => {
    if (!driver?.vehicle_data?.id) {
      Swal.fire({
        title: "Error!",
        text: "No vehicle record found for this driver.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      setSavingVehicle(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `${baseUrl}/driver_vehicle/${driver.vehicle_data.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            brand: vehicleForm.brand_id,
            model: vehicleForm.model_id,
            type: vehicleForm.type_id,
            seats: vehicleForm.seats,
            vehicleMode: vehicleForm.vehicleMode,
            fuelType: vehicleForm.fuelType,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update vehicle details");

      const updated = await res.json();
      const updatedData = updated.data || updated;

      setDriver((prev) => ({
        ...prev,
        vehicle_data: { ...prev.vehicle_data, ...updatedData },
      }));

      setEditingVehicle(false);

      Swal.fire({
        title: "Success!",
        text: "Vehicle details updated successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating vehicle details.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSavingVehicle(false);
    }
  };

  const startEditMembership = () => {
    setMembershipForm({
      membership_type: driver?.membership_type || "",
      plan_purchased_id: driver?.plan_purchased_id || "",
      subscription_id: driver?.subscription_id || "",
      plan_purchased_date_time: driver?.plan_purchased_date_time
        ? driver.plan_purchased_date_time.slice(0, 16)
        : "",
      plan_expire_date_time: driver?.plan_expire_date_time
        ? driver.plan_expire_date_time.slice(0, 16)
        : "",
    });
    setEditingMembership(true);
  };

  const handleMembershipSave = async () => {
    try {
      setSavingMembership(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${baseUrl}/driver/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          membership_type: membershipForm.membership_type,
          plan_purchased_id: membershipForm.plan_purchased_id,
          subscription_id: membershipForm.subscription_id,
          plan_purchased_date_time: membershipForm.plan_purchased_date_time
            ? new Date(membershipForm.plan_purchased_date_time).toISOString()
            : null,
          plan_expire_date_time: membershipForm.plan_expire_date_time
            ? new Date(membershipForm.plan_expire_date_time).toISOString()
            : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update membership details");

      const updated = await res.json();
      const updatedData = updated.data || updated;

      setDriver((prev) => ({
        ...prev,
        membership_type: updatedData.membership_type,
        plan_purchased_id: updatedData.plan_purchased_id,
        subscription_id: updatedData.subscription_id,
        plan_purchased_date_time: updatedData.plan_purchased_date_time,
        plan_expire_date_time: updatedData.plan_expire_date_time,
      }));

      setEditingMembership(false);

      Swal.fire({
        title: "Success!",
        text: "Membership details updated successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating membership details.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSavingMembership(false);
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
          <Detail label="ID" value={driver.id} />
          <Detail label="Driver ID" value={driver.driver_id} />
          <Detail
            label="Name"
            value={`${driver.first_name || ""} ${driver.last_name || ""}`.trim()}
          />
          <Detail label="Email" value={driver.email} />
          <Detail label="Phone" value={driver.phone} />
          <Detail label="City" value={driver.city} />
          <Detail label="State" value={driver.state} />
          <Detail label="Country" value={driver.country} />
          <Detail
            label="Address"
            value={
              driver.address && Object.keys(driver.address).length
                ? JSON.stringify(driver.address)
                : "-"
            }
          />
          <Detail label="Status" value={driver.status} />
          <Detail label="Vehicle Type" value={driver.vehicle_type} />
          <Detail label="Referral Code" value={driver.referral_code} />
          <Detail label="Bonus Amount" value={driver.bonus_amount} />
          <Detail label="Membership" value={driver.membership ? "Yes" : "No"} />
          <Detail label="GST Number" value={driver.gst_number} />
          {/* <Detail label="Device Token" value={driver.device_token} /> */}
          {/* <Detail label="Password Hash" value={driver.password} /> */}
          <Detail label="Lat" value={driver.lat} />
          <Detail label="Lng" value={driver.lng} />
          <Detail
            label="Created At"
            value={driver.created_at ? formatDate(driver.created_at) : "-"}
          />

          <div className="mt-3">
            <span className="font-medium w-40 inline-block">Verification</span>
            <span className="mr-2">:</span>
            <select
              value={driver.verification || ""}
              disabled={updating}
              onChange={(e) => handleVerificationChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {driver.verification === "cancelled" &&
            driver.cancellation_reason && (
              <Detail
                label="Cancellation Reason"
                value={driver.cancellation_reason}
              />
            )}
        </InfoCard>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Vehicle Details
            </h2>
            {!editingVehicle ? (
              <button
                onClick={startEditVehicle}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleVehicleSave}
                  disabled={savingVehicle}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  {savingVehicle ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingVehicle(false)}
                  disabled={savingVehicle}
                  className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editingVehicle ? (
            <div className="space-y-2 text-sm text-gray-700">
              <Detail
                label="Brand"
                value={driver?.vehicle_data?.brand_data?.name}
              />
              <Detail
                label="Model"
                value={driver?.vehicle_data?.model_data?.name}
              />
              <Detail
                label="Type"
                value={driver?.vehicle_data?.type_data?.name}
              />
              <Detail label="Seats" value={driver?.vehicle_data?.seats} />
              <Detail label="Mode" value={driver?.vehicle_data?.vehicleMode} />
              <Detail
                label="Fuel Type"
                value={driver?.vehicle_data?.fuelType}
              />
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-700">
              <EditField label="Brand">
                <select
                  value={vehicleForm.brand_id}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      brand_id: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                >
                  <option value="">Select Brand</option>
                  {(fetchedData?.brands || []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </EditField>
              <EditField label="Model">
                <select
                  value={vehicleForm.model_id}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      model_id: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                >
                  <option value="">Select Model</option>
                  {(fetchedData?.models || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </EditField>
              <EditField label="Type">
                <select
                  value={vehicleForm.type_id}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      type_id: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                >
                  <option value="">Select Type</option>
                  {(fetchedData?.types || []).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </EditField>
              <EditField label="Seats">
                <input
                  type="number"
                  value={vehicleForm.seats}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      seats: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Mode">
                <input
                  type="text"
                  value={vehicleForm.vehicleMode}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      vehicleMode: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Fuel Type">
                <input
                  type="text"
                  value={vehicleForm.fuelType}
                  onChange={(e) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      fuelType: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
            </div>
          )}
        </div>
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
                href={`${baseUrl}${driver.license_doc}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${baseUrl}${driver.license_doc}`}
                  alt="License"
                  className="h-32 w-48 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                />
              </a>
            )}
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Membership Details
            </h2>
            {!editingMembership ? (
              <button
                onClick={startEditMembership}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleMembershipSave}
                  disabled={savingMembership}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  {savingMembership ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingMembership(false)}
                  disabled={savingMembership}
                  className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editingMembership ? (
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
          ) : (
            <div className="space-y-3 text-sm text-gray-700">
              <EditField label="Membership Type">
                <input
                  type="text"
                  value={membershipForm.membership_type}
                  onChange={(e) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      membership_type: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Plan Purchased ID">
                <input
                  type="text"
                  value={membershipForm.plan_purchased_id}
                  onChange={(e) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      plan_purchased_id: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Subscription ID">
                <input
                  type="text"
                  value={membershipForm.subscription_id}
                  onChange={(e) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      subscription_id: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Plan Purchased On">
                <input
                  type="datetime-local"
                  value={membershipForm.plan_purchased_date_time}
                  onChange={(e) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      plan_purchased_date_time: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
              <EditField label="Plan Expiry Date">
                <input
                  type="datetime-local"
                  value={membershipForm.plan_expire_date_time}
                  onChange={(e) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      plan_expire_date_time: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                />
              </EditField>
            </div>
          )}
        </div>
      </div>

      {/* Identity & Profile Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Profile Photo
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            {driver.profile_img ? (
              <a
                href={`${baseUrl}${driver.profile_img}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${baseUrl}${driver.profile_img}`}
                  alt="Profile"
                  className="h-32 w-32 object-cover rounded-full border border-gray-300 cursor-pointer hover:opacity-80"
                />
              </a>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Aadhar Card
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <Detail label="Aadhar Number" value={driver.adhar_card_number} />
            {driver.adhar_card_img && (
              <a
                href={`${baseUrl}${driver.adhar_card_img}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${baseUrl}${driver.adhar_card_img}`}
                  alt="Aadhar Card"
                  className="h-32 w-48 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                />
              </a>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">PAN Card</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <Detail label="PAN Number" value={driver.pan_card_number} />
            {driver.pan_card_img && (
              <a
                href={`${baseUrl}${driver.pan_card_img}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${baseUrl}${driver.pan_card_img}`}
                  alt="PAN Card"
                  className="h-32 w-48 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                />
              </a>
            )}
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
      <span className="break-all">{value || "-"}</span>
    </div>
  );
}

/* Edit Field Row */
function EditField({ label, children }) {
  return (
    <div className="flex items-center">
      <span className="font-medium w-40">{label}</span>
      <span className="mr-2">:</span>
      <div className="flex-1">{children}</div>
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
