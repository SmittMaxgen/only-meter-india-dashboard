// import { useEffect, useMemo, useState } from "react";
// import {
//   PencilIcon,
//   TrashIcon,
//   PlusIcon,
//   XMarkIcon,
//   PhotoIcon,
//   EyeIcon,
// } from "@heroicons/react/24/outline";
// import { useAppContext } from "../Central_Store/app_context.jsx";

// const NAME_OPTIONS = ["Auto", "Mini", "Sedan", "SUV", "XL Diesel"];
// const TYPE_OPTIONS = ["Local Ride", "Intercity", "Reservation"];

// /* ----------------------------- HEADER ----------------------------- */
// function Header({ onAdd }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-4">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">Vehicle Fare</h1>
//           <p className="text-sm text-gray-500">
//             Dashboard <span className="text-orange-500">/ Vehicle Fare</span>
//           </p>
//         </div>
//         <button
//           onClick={onAdd}
//           className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
//         >
//           <PlusIcon className="h-5 w-5 cursor-pointer" />
//           Add Fare
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ----------------------------- UPLOAD BOX ----------------------------- */
// // function UploadBox({ value, onChange }) {
// function UploadBox({ value, onChange, disabled = false }) {
//   const preview = useMemo(() => {
//     if (!value) return "";
//     if (typeof value === "string")
//       return value.startsWith("http")
//         ? value
//         : `https://adminapi.onlymeterindia.com/${value}`;
//     if (value instanceof File) return URL.createObjectURL(value);
//     return "";
//   }, [value]);

//   // return (
//   //   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 grid place-items-center bg-gray-50">
//   //     <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
//   //       {preview ? (
//   //         <img
//   //           src={preview}
//   //           alt="preview"
//   //           className="h-28 w-full object-cover rounded-md border"
//   //         />
//   //       ) : (
//   //         <>
//   //           <PhotoIcon className="h-8 w-8 text-gray-400" />
//   //           <span className="text-gray-500 text-sm">Upload image</span>
//   //         </>
//   //       )}
//   //       <input
//   //         type="file"
//   //         accept="image/*"
//   //         className="hidden"
//   //         onChange={(e) => onChange(e.target.files?.[0] || null)}
//   //       />
//   //     </label>
//   //   </div>
//   // );

//   return (
//     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 grid place-items-center bg-gray-50">
//       {preview ? (
//         <div className="w-full flex justify-center">
//           <img
//             src={preview}
//             alt="preview"
//             className="h-40 object-contain rounded-md border"
//           />
//         </div>
//       ) : (
//         <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
//           <PhotoIcon className="h-8 w-8 text-gray-400" />
//           <span className="text-gray-500 text-sm">Upload image</span>
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => onChange(e.target.files?.[0] || null)}
//             disabled={disabled}
//           />
//         </label>
//       )}
//       {preview && !disabled && (
//         <label className="mt-2 text-xs text-orange-500 cursor-pointer hover:underline">
//           Change image
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => onChange(e.target.files?.[0] || null)}
//           />
//         </label>
//       )}
//     </div>
//   );
// }

// /* ----------------------------- MODAL ----------------------------- */
// // function Modal({ title = "Vehicle Fare", open, onClose, onSave, initial }) {
// function Modal({
//   title = "Vehicle Fare",
//   open,
//   onClose,
//   onSave,
//   initial,
//   isView = false,
// }) {
//   const [image, setImage] = useState(null);
//   const [name, setName] = useState(NAME_OPTIONS[0]);
//   const [farePerKm, setFarePerKm] = useState("");
//   const [type, setType] = useState(TYPE_OPTIONS[0]);
//   const [startingFare, setStartingFare] = useState("");
//   const [extraChargeDay, setExtraChargeDay] = useState("");
//   const [extraChargeMidnight, setExtraChargeMidnight] = useState("");
//   const [extraChargeMidnightIntercity, setExtraChargeMidnightIntercity] =
//     useState("");

//   useEffect(() => {
//     if (initial) {
//       setImage(initial.image || "");
//       setName(initial.name || NAME_OPTIONS[0]);
//       setFarePerKm(initial.fare_per_km ?? "");
//       setType(initial.type || TYPE_OPTIONS[0]);
//       setStartingFare(initial.starting_fare ?? "");
//       setExtraChargeDay(initial.extra_charge_day ?? "");
//       setExtraChargeMidnight(initial.extra_charge_midnight ?? "");
//       setExtraChargeMidnightIntercity(
//         initial.extra_charge_midnight_intercity ?? "",
//       );
//     } else {
//       setImage(null);
//       setName(NAME_OPTIONS[0]);
//       setFarePerKm("");
//       setType(TYPE_OPTIONS[0]);
//       setStartingFare("");
//       setExtraChargeDay("");
//       setExtraChargeMidnight("");
//       setExtraChargeMidnightIntercity("");
//     }
//   }, [initial, open]);

//   if (!open) return null;

//   const isAuto = name === "Auto";
//   const showExtraCharges = type === "Intercity" || type === "Reservation"; // 👈 key condition

//   function handleSave() {
//     if (!farePerKm) return;
//     onSave({
//       image,
//       name,
//       fare_per_km: farePerKm,
//       type,
//       ...(isAuto && { starting_fare: startingFare }),
//       ...(showExtraCharges && {
//         extra_charge_day: extraChargeDay,
//         extra_charge_midnight: extraChargeMidnight,
//         extra_charge_midnight_intercity: extraChargeMidnightIntercity,
//       }),
//     });
//   }

//   // const inputCls =
//   //   "w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm";
//   // const labelCls = "block text-sm text-gray-700 mb-1";
//   const inputCls = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
//     isView ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"
//   }`;

//   const disabledSelectCls = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none bg-gray-100 cursor-not-allowed text-gray-500`;
//   const labelCls = "block text-sm text-gray-700 mb-1";

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       <div className="relative max-w-2xl mx-auto mt-10 mb-10 bg-white rounded-xl shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-md"
//           >
//             <XMarkIcon className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-4 space-y-4">
//           {/* Image Upload */}
//           {/* <UploadBox value={image} onChange={setImage} /> */}
//           <UploadBox value={image} onChange={setImage} disabled={isView} />

//           {/* Name & Type */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className={labelCls}>Name</label>
//               <select
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className={isView || !!initial ? disabledSelectCls : inputCls}
//                 disabled={isView || !!initial}
//               >
//                 {NAME_OPTIONS.map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelCls}>Type</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className={isView || !!initial ? disabledSelectCls : inputCls}
//                 disabled={isView || !!initial}
//               >
//                 {TYPE_OPTIONS.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Fare Per KM */}
//           <div>
//             <label className={labelCls}>Fare Per KM (₹)</label>
//             <input
//               type="number"
//               value={farePerKm}
//               onChange={(e) => setFarePerKm(e.target.value)}
//               className={inputCls}
//               placeholder="e.g. 13"
//               disabled={isView}
//             />
//           </div>

//           {/* Starting Fare — only for Auto */}
//           {isAuto && (
//             <div>
//               <label className={labelCls}>Starting Fare (₹)</label>
//               <input
//                 type="number"
//                 value={startingFare}
//                 onChange={(e) => setStartingFare(e.target.value)}
//                 className={inputCls}
//                 placeholder="e.g. 25"
//                 disabled={isView}
//               />
//             </div>
//           )}

//           {/* Extra Charges — only for Intercity or Reservation */}
//           {showExtraCharges && (
//             <>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className={labelCls}>Extra Charge – Day (₹)</label>
//                   <input
//                     type="number"
//                     value={extraChargeDay}
//                     onChange={(e) => setExtraChargeDay(e.target.value)}
//                     className={inputCls}
//                     placeholder="e.g. 50"
//                     disabled={isView}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelCls}>
//                     Extra Charge – Midnight (₹)
//                   </label>
//                   <input
//                     type="number"
//                     value={extraChargeMidnight}
//                     onChange={(e) => setExtraChargeMidnight(e.target.value)}
//                     className={inputCls}
//                     placeholder="e.g. 100"
//                     disabled={isView}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className={labelCls}>
//                   Extra Charge – Midnight Intercity (₹)
//                 </label>
//                 <input
//                   type="number"
//                   value={extraChargeMidnightIntercity}
//                   onChange={(e) =>
//                     setExtraChargeMidnightIntercity(e.target.value)
//                   }
//                   className={inputCls}
//                   placeholder="e.g. 120"
//                   disabled={isView}
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         {/* <div className="flex justify-end gap-3 p-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
//           >
//             Close
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm"
//           >
//             Save
//           </button>
//         </div> */}
//         <div className="flex justify-end gap-3 p-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
//           >
//             Close
//           </button>
//           {!isView && (
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm"
//             >
//               Save
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------------------- BADGE ----------------------------- */
// function TypeBadge({ type }) {
//   const colors = {
//     "Local Ride": "bg-blue-100 text-blue-700",
//     Intercity: "bg-purple-100 text-purple-700",
//     Reservation: "bg-green-100 text-green-700",
//   };
//   return (
//     <span
//       className={`text-xs font-medium px-2 py-1 rounded-full ${colors[type] || "bg-gray-100 text-gray-600"}`}
//     >
//       {type}
//     </span>
//   );
// }

// /* ----------------------------- MAIN COMPONENT ----------------------------- */
// // export default function VehicleFare() {
// //   const { getData, postData, patchData, deleteData } = useAppContext();
// //   const [fares, setFares] = useState([]);
// //   const [open, setOpen] = useState(false);
// //   const [editing, setEditing] = useState(null);
// //   const [viewing, setViewing] = useState(null); // 👈 add

// //   // Fetch on mount
// //   useEffect(() => {
// //     getData("/fare/")
// //       .then((data) => setFares(data || []))
// //       .catch(console.error);
// //   }, []);

// export default function VehicleFare() {
//   const { getData, postData, patchData, deleteData } = useAppContext();
//   const [fares, setFares] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [viewing, setViewing] = useState(null);
//   // const [filterName, setFilterName] = useState("");
//   // const [filterType, setFilterType] = useState("");

//   // const fetchFares = (name = "", type = "") => {
//   //   const params = new URLSearchParams();
//   //   if (name) params.append("name", name);
//   //   if (type) params.append("type", type);
//   //   const query = params.toString() ? `?${params.toString()}` : "";
//   //   getData(`/fare/${query}`)
//   //     .then((data) => setFares(data || []))
//   //     .catch(console.error);
//   // };

//   // // Fetch on mount
//   // useEffect(() => {
//   //   fetchFares();
//   // }, []);

//   // const handleFilterName = (e) => {
//   //   const val = e.target.value;
//   //   setFilterName(val);
//   //   fetchFares(val, filterType);
//   // };

//   // const handleFilterType = (e) => {
//   //   const val = e.target.value;
//   //   setFilterType(val);
//   //   fetchFares(filterName, val);
//   // };

//   // const clearFilters = () => {
//   //   setFilterName("");
//   //   setFilterType("");
//   //   fetchFares();
//   // };

//   const [filterName, setFilterName] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [nextUrl, setNextUrl] = useState(null);
//   const [prevUrl, setPrevUrl] = useState(null);
//   const PAGE_SIZE = 10;

//   const fetchFares = async (name = "", type = "", page = 1) => {
//     try {
//       const params = new URLSearchParams();
//       if (name) params.append("name", name);
//       if (type) params.append("type", type);
//       if (page > 1) params.append("page", page);
//       const query = params.toString() ? `?${params.toString()}` : "";

//       const res = await fetch(`https://adminapi.onlymeterindia.com/fare/${query}`);
//       const json = await res.json();

//       setFares(json.data || []);
//       setTotalCount(json.count || 0);
//       setNextUrl(json.next || null);
//       setPrevUrl(json.previous || null);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   // Fetch on mount
//   useEffect(() => {
//     fetchFares();
//   }, []);

//   const handleFilterName = (e) => {
//     const val = e.target.value;
//     setFilterName(val);
//     fetchFares(val, filterType, 1);
//   };

//   const handleFilterType = (e) => {
//     const val = e.target.value;
//     setFilterType(val);
//     fetchFares(filterName, val, 1);
//   };

//   const clearFilters = () => {
//     setFilterName("");
//     setFilterType("");
//     fetchFares("", "", 1);
//   };

//   const totalPages = Math.ceil(totalCount / PAGE_SIZE);

//   const openAdd = () => {
//     setEditing(null);
//     setOpen(true);
//   };

//   // const openEdit = (row) => {
//   //   setEditing(row);
//   //   setOpen(true);
//   // };

//   const openEdit = (row) => {
//     setEditing(row);
//     setViewing(null);
//     setOpen(true);
//   };

//   const openView = (row) => {
//     // 👈 add
//     setViewing(row);
//     setEditing(null);
//     setOpen(true);
//   };

//   const handleSave = async (formData) => {
//     try {
//       const payload = new FormData();

//       if (formData.image instanceof File) {
//         payload.append("image", formData.image);
//       }

//       Object.entries(formData).forEach(([key, value]) => {
//         if (key !== "image" && value !== "" && value !== undefined) {
//           payload.append(key, value);
//         }
//       });

//       if (editing) {
//         await patchData(`/fare/${editing.id}/`, payload, "Vehicle Fare");
//         setFares((prev) =>
//           prev.map((f) =>
//             f.id === editing.id
//               ? { ...f, ...formData, image: formData.image || f.image }
//               : f,
//           ),
//         );
//       } else {
//         const res = await postData("/fare/", payload, "Vehicle Fare");
//         if (res) setFares((prev) => [...prev, res]);
//       }

//       setOpen(false);
//       setEditing(null);
//     } catch (error) {
//       console.error("Save Error:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await deleteData(`/fare/${id}/`);
//       if (res) setFares((prev) => prev.filter((f) => f.id !== id));
//     } catch (error) {
//       console.error("Delete Error:", error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Header onAdd={openAdd} />

//       {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto"> */}

//       {/* Filter Bar */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4">
//         <div className="flex items-center gap-3 flex-wrap">
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">
//               Filter by Name
//             </label>
//             <select
//               value={filterName}
//               onChange={handleFilterName}
//               className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-36"
//             >
//               <option value="">All Names</option>
//               {NAME_OPTIONS.map((n) => (
//                 <option key={n} value={n}>
//                   {n}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-500 mb-1">
//               Filter by Type
//             </label>
//             <select
//               value={filterType}
//               onChange={handleFilterType}
//               className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-36"
//             >
//               <option value="">All Types</option>
//               {TYPE_OPTIONS.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {(filterName || filterType) && (
//             <div className="mt-4">
//               <button
//                 onClick={clearFilters}
//                 className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50 text-gray-700">
//               <tr>
//                 <th className="px-4 py-3 font-medium text-left">Image</th>
//                 <th className="px-4 py-3 font-medium text-left">Name</th>
//                 <th className="px-4 py-3 font-medium text-left">Type</th>
//                 <th className="px-4 py-3 font-medium text-left">Fare/KM</th>
//                 <th className="px-4 py-3 font-medium text-left">
//                   Starting Fare
//                 </th>
//                 <th className="px-4 py-3 font-medium text-left">Extra (Day)</th>
//                 <th className="px-4 py-3 font-medium text-left">Extra (Mid)</th>
//                 <th className="px-4 py-3 font-medium text-left">
//                   Extra (Mid Intercity)
//                 </th>
//                 <th className="px-4 py-3 font-medium text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {fares.map((r) => (
//                 <tr key={r.id} className="border-t border-gray-100">
//                   <td className="px-4 py-3">
//                     <div className="h-10 w-16 rounded-md overflow-hidden border bg-gray-50">
//                       {/* {r.image ? (
//                         <img
//                           src={
//                             r.image.startsWith("http")
//                               ? r.image
//                               : `https://adminapi.onlymeterindia.com/${r.image}`
//                           }
//                           alt={r.name}
//                           className="h-full w-full object-cover"
//                         /> */}
//                       {r.image ? (
//                         <img
//                           src={
//                             typeof r.image === "string" &&
//                             r.image.startsWith("http")
//                               ? r.image
//                               : `https://adminapi.onlymeterindia.com/${r.image}`
//                           }
//                           alt={r.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="h-full w-full grid place-items-center">
//                           <PhotoIcon className="h-5 w-5 text-gray-300" />
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 font-medium text-gray-900">
//                     {r.name}
//                   </td>
//                   <td className="px-4 py-3">
//                     <TypeBadge type={r.type} />
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     ₹{r.fare_per_km ?? "-"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     {r.name === "Auto" ? `₹${r.starting_fare ?? "-"}` : "—"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     ₹{r.extra_charge_day ?? "-"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     ₹{r.extra_charge_midnight ?? "-"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     ₹{r.extra_charge_midnight_intercity ?? "-"}
//                   </td>
//                   {/* <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => openEdit(r)}
//                         className="p-2 rounded-md hover:bg-gray-100"
//                       >
//                         <PencilIcon className="h-5 w-5 text-gray-700" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(r.id)}
//                         className="p-2 rounded-md hover:bg-gray-100 text-red-600"
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td> */}
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       {/* <button
//                         onClick={() => openEdit(r)}
//                         className="p-2 rounded-md hover:bg-gray-100 text-blue-600"
//                       >
//                         <EyeIcon className="h-5 w-5" />
//                       </button> */}
//                       <button
//                         onClick={() => openView(r)}
//                         className="p-2 rounded-md hover:bg-gray-100 text-blue-600"
//                       >
//                         <EyeIcon className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => openEdit(r)}
//                         className="p-2 rounded-md hover:bg-gray-100"
//                       >
//                         <PencilIcon className="h-5 w-5 text-gray-700" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(r.id)}
//                         className="p-2 rounded-md hover:bg-gray-100 text-red-600"
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}

//               {/* {fares.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-4 py-8 text-center text-gray-500"
//                   >
//                     No fares added yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div> */}
//       {fares.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-4 py-8 text-center text-gray-500"
//                   >
//                     No fares added yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Bar */}
//         {totalCount > 0 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
//             <p className="text-sm text-gray-500">
//               Showing{" "}
//               <span className="font-medium text-gray-700">
//                 {(currentPage - 1) * PAGE_SIZE + 1}
//               </span>{" "}
//               –{" "}
//               <span className="font-medium text-gray-700">
//                 {Math.min(currentPage * PAGE_SIZE, totalCount)}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-gray-700">{totalCount}</span>{" "}
//               results
//             </p>

//             <div className="flex items-center gap-1">
//               {/* Previous */}
//               <button
//                 onClick={() => fetchFares(filterName, filterType, currentPage - 1)}
//                 disabled={!prevUrl}
//                 className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>

//               {/* Page Numbers */}
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => fetchFares(filterName, filterType, page)}
//                   className={`px-3 py-1.5 text-sm rounded-md border ${
//                     page === currentPage
//                       ? "bg-orange-500 text-white border-orange-500"
//                       : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               {/* Next */}
//               <button
//                 onClick={() => fetchFares(filterName, filterType, currentPage + 1)}
//                 disabled={!nextUrl}
//                 className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* <Modal
//         title={editing ? "Edit Vehicle Fare" : "Add Vehicle Fare"}
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           setEditing(null);
//         }}
//         onSave={handleSave}
//         initial={editing}
//       /> */}
//       <Modal
//         title={
//           viewing
//             ? "View Vehicle Fare"
//             : editing
//               ? "Edit Vehicle Fare"
//               : "Add Vehicle Fare"
//         }
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           setEditing(null);
//           setViewing(null);
//         }}
//         onSave={handleSave}
//         initial={viewing || editing}
//         isView={!!viewing}
//       />
//     </div>
//   );
// }

///////////////////////////// NEW CODE /////////////////////////////

import { useEffect, useMemo, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  EyeIcon,
  FunnelIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

const NAME_OPTIONS = ["Auto", "Mini", "Sedan", "SUV", "XL Diesel"];
const TYPE_OPTIONS = ["Local Ride", "Intercity", "Reservation", "Rental"];
const BASE_URL = "https://adminapi.onlymeterindia.com";

/* ----------------------------- HEADER ----------------------------- */
function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicle Fare</h1>
          <p className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Vehicle Fare</span>
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
        >
          <PlusIcon className="h-4 w-4" />
          Add Fare
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- UPLOAD BOX ----------------------------- */
function UploadBox({ value, onChange, disabled = false }) {
  const preview = useMemo(() => {
    if (!value) return "";
    if (typeof value === "string")
      return value.startsWith("http") ? value : `${BASE_URL}/${value}`;
    if (value instanceof File) return URL.createObjectURL(value);
    return "";
  }, [value]);

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 grid place-items-center bg-gray-50">
      {preview ? (
        <div className="w-full flex flex-col items-center gap-2">
          <img
            src={preview}
            alt="preview"
            className="h-44 object-contain rounded-lg border border-gray-200 shadow-sm"
          />
          {!disabled && (
            <label className="mt-1 text-xs text-orange-500 cursor-pointer hover:underline font-medium">
              Change image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>
      ) : (
        <label
          className={`flex flex-col items-center gap-2 w-full py-4 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <div className="h-14 w-14 rounded-full bg-orange-50 grid place-items-center">
            <PhotoIcon className="h-7 w-7 text-orange-400" />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {disabled ? "No image uploaded" : "Click to upload image"}
          </span>
          {!disabled && (
            <span className="text-xs text-gray-400">
              PNG, JPG, AVIF up to 5MB
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}

/* ----------------------------- TYPE BADGE ----------------------------- */
function TypeBadge({ type }) {
  const styles = {
    "Local Ride": "bg-blue-50 text-blue-600 border border-blue-100",
    Intercity: "bg-purple-50 text-purple-600 border border-purple-100",
    Reservation: "bg-green-50 text-green-600 border border-green-100",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        styles[type] || "bg-gray-100 text-gray-600 border border-gray-200"
      }`}
    >
      {type}
    </span>
  );
}

/* ----------------------------- MODAL ----------------------------- */
function Modal({
  title = "Vehicle Fare",
  open,
  onClose,
  onSave,
  initial,
  isView = false,
}) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(NAME_OPTIONS[0]);
  const [farePerKm, setFarePerKm] = useState("");
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [startingFare, setStartingFare] = useState("");
  const [extraChargeDay, setExtraChargeDay] = useState("");
  const [tip, setTip] = useState("");
  const [perHourCharge, setPerHourCharge] = useState("");
  const [extraChargeMidnight, setExtraChargeMidnight] = useState("");
  const [extraChargeMidnightIntercity, setExtraChargeMidnightIntercity] =
    useState("");

  useEffect(() => {
    if (initial) {
      setImage(initial.image || "");
      setName(initial.name || NAME_OPTIONS[0]);
      setFarePerKm(initial.fare_per_km ?? "");
      setType(initial.type || TYPE_OPTIONS[0]);
      setStartingFare(initial.starting_fare ?? "");
      setExtraChargeDay(initial.extra_charge_day ?? "");
      setTip(initial.tip ?? "");
      setPerHourCharge(initial.per_hour_charge ?? "");
      setExtraChargeMidnight(initial.extra_charge_midnight ?? "");
      setExtraChargeMidnightIntercity(
        initial.extra_charge_midnight_intercity ?? "",
      );
    } else {
      setImage(null);
      setName(NAME_OPTIONS[0]);
      setFarePerKm("");
      setType(TYPE_OPTIONS[0]);
      setStartingFare("");
      setExtraChargeDay("");
      setTip("");
      setPerHourCharge("");
      setExtraChargeMidnight("");
      setExtraChargeMidnightIntercity("");
    }
  }, [initial, open]);

  if (!open) return null;

  const isAuto = name === "Auto";
  const showExtraCharges = type === "Intercity" || type === "Reservation";

  // function handleSave() {
  //   if (!farePerKm) return;
  //   onSave({
  //     image,
  //     name,
  //     fare_per_km: farePerKm,
  //     type,
  //     ...(type === "Rental" && { per_hour_charge: perHourCharge }),
  //     ...(isAuto && { starting_fare: startingFare }),
  //     ...(showExtraCharges && {
  //       ...(type === "Intercity"
  //         ? { tip }
  //         : {
  //             extra_charge_day: extraChargeDay,
  //             extra_charge_midnight: extraChargeMidnight,
  //           }),
  //       // extra_charge_day: extraChargeDay,
  //       // extra_charge_midnight: extraChargeMidnight,
  //       extra_charge_midnight_intercity: extraChargeMidnightIntercity,
  //     }),
  //   });
  // }

  function handleSave() {
    if (type === "Rental") {
      if (!perHourCharge) return;
      onSave({ image, name, type, per_hour_charge: perHourCharge });
      return;
    }

    if (!farePerKm) return;
    onSave({
      image,
      name,
      fare_per_km: farePerKm,
      type,
      ...(isAuto && { starting_fare: startingFare }),
      ...(showExtraCharges && {
        ...(type === "Intercity"
          ? { tip }
          : {
              extra_charge_day: extraChargeDay,
              extra_charge_midnight: extraChargeMidnight,
            }),
        extra_charge_midnight_intercity: extraChargeMidnightIntercity,
      }),
    });
  }
  const inputCls = `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
    isView
      ? "bg-gray-50 cursor-not-allowed text-gray-500 border-gray-200"
      : "bg-white border-gray-300"
  }`;

  const disabledSelectCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 cursor-not-allowed text-gray-500";

  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-w-2xl mx-auto mt-10 mb-10 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isView
              ? "bg-blue-50 border-blue-100"
              : initial
                ? "bg-orange-50 border-orange-100"
                : "bg-gray-50 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-full grid place-items-center text-white text-xs font-bold ${
                isView
                  ? "bg-blue-500"
                  : initial
                    ? "bg-orange-500"
                    : "bg-green-500"
              }`}
            >
              {isView ? (
                <EyeIcon className="h-4 w-4" />
              ) : initial ? (
                <PencilIcon className="h-4 w-4" />
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
            </div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/70 rounded-lg transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <UploadBox value={image} onChange={setImage} disabled={isView} />

          {/* Name & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name</label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={isView || !!initial ? disabledSelectCls : inputCls}
                disabled={isView || !!initial}
              >
                {NAME_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={isView || !!initial ? disabledSelectCls : inputCls}
                disabled={isView || !!initial}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fare Per KM */}

          {/* <div>
            <label className={labelCls}>Fare Per KM (₹)</label>
            <input
              type="number"
              value={farePerKm}
              onChange={(e) => setFarePerKm(e.target.value)}
              className={inputCls}
              placeholder="e.g. 13"
              disabled={isView}
            />
          </div> */}
          {/* {type === "Rental" && (
            <div>
              <label className={labelCls}>Per Hour Charge (₹)</label>
              <input
                type="number"
                value={perHourCharge}
                onChange={(e) => setPerHourCharge(e.target.value)}
                className={inputCls}
                placeholder="e.g. 150"
                disabled={isView}
              />
            </div>
          )} */}

          {type === "Rental" ? (
            <div>
              <label className={labelCls}>Per Hour Charge (₹)</label>
              <input
                type="number"
                value={perHourCharge}
                onChange={(e) => setPerHourCharge(e.target.value)}
                className={inputCls}
                placeholder="e.g. 150"
                disabled={isView}
              />
            </div>
          ) : (
            <>
              <div>
                <label className={labelCls}>Fare Per KM (₹)</label>
                <input
                  type="number"
                  value={farePerKm}
                  onChange={(e) => setFarePerKm(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 13"
                  disabled={isView}
                />
              </div>

              {isAuto && (
                <div>
                  <label className={labelCls}>Starting Fare (₹)</label>
                  <input
                    type="number"
                    value={startingFare}
                    onChange={(e) => setStartingFare(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 25"
                    disabled={isView}
                  />
                </div>
              )}
            </>
          )}

          {/* Starting Fare — only for Auto */}
          {/* {isAuto && (
            <div>
              <label className={labelCls}>Starting Fare (₹)</label>
              <input
                type="number"
                value={startingFare}
                onChange={(e) => setStartingFare(e.target.value)}
                className={inputCls}
                placeholder="e.g. 25"
                disabled={isView}
              />
            </div>
          )} */}

          {/* Extra Charges — only for Intercity or Reservation */}
          {showExtraCharges && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-4">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Extra Charges
              </p>
              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Day Charge (₹)</label>
                  <input
                    type="number"
                    value={extraChargeDay}
                    onChange={(e) => setExtraChargeDay(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 50"
                    disabled={isView}
                  />
                </div>
                <div>
                  <label className={labelCls}>Midnight Charge (₹)</label>
                  <input
                    type="number"
                    value={extraChargeMidnight}
                    onChange={(e) => setExtraChargeMidnight(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 100"
                    disabled={isView}
                  />
                </div>
              </div> */}

              {type === "Intercity" ? (
                <div>
                  <label className={labelCls}>Tip (₹)</label>
                  <input
                    type="number"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 20"
                    disabled={isView}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Day Charge (₹)</label>
                    <input
                      type="number"
                      value={extraChargeDay}
                      onChange={(e) => setExtraChargeDay(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 50"
                      disabled={isView}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Midnight Charge (₹)</label>
                    <input
                      type="number"
                      value={extraChargeMidnight}
                      onChange={(e) => setExtraChargeMidnight(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 100"
                      disabled={isView}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className={labelCls}>
                  Midnight Intercity Charge (₹)
                </label>
                <input
                  type="number"
                  value={extraChargeMidnightIntercity}
                  onChange={(e) =>
                    setExtraChargeMidnightIntercity(e.target.value)
                  }
                  className={inputCls}
                  placeholder="e.g. 120"
                  disabled={isView}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-sm font-medium text-gray-700 transition"
          >
            Close
          </button>
          {!isView && (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 active:scale-95 text-sm font-medium transition shadow-sm"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- MAIN COMPONENT ----------------------------- */
export default function VehicleFare() {
  const { postData, patchData, deleteData } = useAppContext();
  const [fares, setFares] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const PAGE_SIZE = 10;

  const fetchFares = async (name = "", type = "", page = 1) => {
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (type) params.append("type", type);
      if (page > 1) params.append("page", page);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${BASE_URL}/fare/${query}`);
      const json = await res.json();
      setFares(json.data || []);
      setTotalCount(json.count || 0);
      setNextUrl(json.next || null);
      setPrevUrl(json.previous || null);
      setCurrentPage(page);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchFares();
  }, []);

  const handleFilterName = (e) => {
    const val = e.target.value;
    setFilterName(val);
    fetchFares(val, filterType, 1);
  };

  const handleFilterType = (e) => {
    const val = e.target.value;
    setFilterType(val);
    fetchFares(filterName, val, 1);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterType("");
    fetchFares("", "", 1);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasFilters = filterName || filterType;

  const openAdd = () => {
    setEditing(null);
    setViewing(null);
    setOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setViewing(null);
    setOpen(true);
  };
  const openView = (row) => {
    setViewing(row);
    setEditing(null);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const payload = new FormData();
      if (formData.image instanceof File)
        payload.append("image", formData.image);
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value !== "" && value !== undefined)
          payload.append(key, value);
      });

      if (editing) {
        await patchData(`/fare/${editing.id}/`, payload, "Vehicle Fare");
        setFares((prev) =>
          prev.map((f) =>
            f.id === editing.id
              ? { ...f, ...formData, image: formData.image || f.image }
              : f,
          ),
        );
      } else {
        const res = await postData("/fare/", payload, "Vehicle Fare");
        if (res) setFares((prev) => [...prev, res]);
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteData(`/fare/${id}/`);
      if (res) setFares((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Header onAdd={openAdd} />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-gray-400">
            <FunnelIcon className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Filters
            </span>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <select
              value={filterName}
              onChange={handleFilterName}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-36 bg-white"
            >
              <option value="">All Names</option>
              {NAME_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select
              value={filterType}
              onChange={handleFilterType}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-36 bg-white"
            >
              <option value="">All Types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}

          {hasFilters && (
            <div className="mt-4 ml-auto">
              <span className="text-xs text-gray-400">
                Showing results for{" "}
                {filterName && (
                  <span className="font-semibold text-gray-600">
                    {filterName}
                  </span>
                )}
                {filterName && filterType && " · "}
                {filterType && (
                  <span className="font-semibold text-gray-600">
                    {filterType}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Image
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Name
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Type
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Fare / KM
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Fare / Hour
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Starting Fare
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Extra (Day)
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Extra (Mid)
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Extra (Mid Intercity)
                </th>
                <th className="px-4 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {fares.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="h-11 w-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                      {r.image ? (
                        <img
                          src={
                            typeof r.image === "string" &&
                            r.image.startsWith("http")
                              ? r.image
                              : `${BASE_URL}/${r.image}`
                          }
                          alt={r.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center">
                          <PhotoIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={r.type} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      ₹{r.fare_per_km ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      ₹{r.per_hour_charge ?? "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.name === "Auto" ? `₹${r.starting_fare ?? "-"}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.extra_charge_day ? `₹${r.extra_charge_day}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.extra_charge_midnight
                      ? `₹${r.extra_charge_midnight}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.extra_charge_midnight_intercity
                      ? `₹${r.extra_charge_midnight_intercity}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openView(r)}
                        title="View"
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEdit(r)}
                        title="Edit"
                        className="p-2 rounded-lg hover:bg-orange-50 text-orange-500 transition"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        title="Delete"
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {fares.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-gray-100 grid place-items-center">
                        <PhotoIcon className="h-6 w-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm">No fares found.</p>
                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-orange-500 hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              –{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * PAGE_SIZE, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{totalCount}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  fetchFares(filterName, filterType, currentPage - 1)
                }
                disabled={!prevUrl}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => fetchFares(filterName, filterType, page)}
                    className={`h-8 w-8 text-xs font-medium rounded-lg border transition ${
                      page === currentPage
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  fetchFares(filterName, filterType, currentPage + 1)
                }
                disabled={!nextUrl}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={
          viewing
            ? "View Vehicle Fare"
            : editing
              ? "Edit Vehicle Fare"
              : "Add Vehicle Fare"
        }
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setViewing(null);
        }}
        onSave={handleSave}
        initial={viewing || editing}
        isView={!!viewing}
      />
    </div>
  );
}
