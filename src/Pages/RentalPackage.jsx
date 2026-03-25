import { useEffect, useState, useMemo } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

// ---------------------- Header ----------------------
function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Rental Packages
          </h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Rental Packages</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add Rental Package
        </button>
      </div>
    </div>
  );
}

// ---------------------- Modal ----------------------
function Modal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "",
    package_code: "",
    vehicle_type: "",
    duration_hours: "",
    km_included: "",
    base_fare: "",
    extra_per_km: "",
    extra_per_hour: "",
    security_deposit: "",
    cancellation_policy: "",
    is_active: true,
  });

  useMemo(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        package_code: initial.package_code || "",
        vehicle_type: initial.vehicle_type || "",
        duration_hours: initial.duration_hours || "",
        km_included: initial.km_included || "",
        base_fare: initial.base_fare || "",
        extra_per_km: initial.extra_per_km || "",
        extra_per_hour: initial.extra_per_hour || "",
        security_deposit: initial.security_deposit || "",
        cancellation_policy: initial.cancellation_policy || "",
        is_active: initial.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        package_code: "",
        vehicle_type: "",
        duration_hours: "",
        km_included: "",
        base_fare: "",
        extra_per_km: "",
        extra_per_hour: "",
        security_deposit: "",
        cancellation_policy: "",
        is_active: true,
      });
    }
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    if (!form.name.trim() || !form.package_code.trim()) {
      return alert("Please enter required fields.");
    }
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit Rental Package" : "Add Rental Package"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["name", "Name"],
              ["package_code", "Package Code"],
              ["vehicle_type", "Vehicle Type (e.g. car, bike)"],
              ["duration_hours", "Duration Hours"],
              ["km_included", "KM Included"],
              ["base_fare", "Base Fare"],
              ["extra_per_km", "Extra per KM"],
              ["extra_per_hour", "Extra per Hour"],
              ["security_deposit", "Security Deposit"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block font-bold text-sm mb-1">{label}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={`Enter ${label}`}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block font-bold text-sm mb-1">
                Cancellation Policy
              </label>
              <textarea
                value={form.cancellation_policy}
                onChange={(e) =>
                  setForm({ ...form, cancellation_policy: e.target.value })
                }
                placeholder="Enter cancellation policy"
                className="w-full border rounded-lg px-3 py-2"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-sm mb-1">Active</label>
              <select
                value={form.is_active ? "true" : "false"}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.value === "true" })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Main Component ----------------------
export default function RentalPackage() {
  const {fetchedData, postData, patchData, deleteData } = useAppContext();
  const [packages, setPackages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all packages
  useEffect(() => {
    setPackages(fetchedData.rentalPackages || []);
  }, [fetchedData.rentalPackages]);

  // ✅ Pagination logic
  const pageCount = Math.max(1, Math.ceil(packages.length / pageSize));
  const current = packages.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

      if (editing) {
        const res = await patchData(`/rental_package/${editing.id}/`, payload, "Rental Package");
        // Update local state immediately
        setPackages((prev) =>
          prev.map((v) => (v.id === editing.id ? { ...v, ...formData } : v))
        );
      } else {
        const res = await postData("/rental_package/", payload, "Rental Package");
        // Add new item locally (if response has data)
        if (res && res.data) {
          setPackages((prev) => [...prev, res.data]);
        }
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/rental_package/${id}/`);
      setPackages((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Header onAdd={openAdd} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Vehicle Type</th>
                <th className="px-4 py-3 text-left">Duration (hr)</th>
                <th className="px-4 py-3 text-left">KM</th>
                <th className="px-4 py-3 text-left">Base Fare</th>
                <th className="px-4 py-3 text-left">Active</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((pkg) => (
                <tr key={pkg.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{pkg.name}</td>
                  <td className="px-4 py-3">{pkg.package_code}</td>
                  <td className="px-4 py-3">{pkg.vehicle_type}</td>
                  <td className="px-4 py-3">{pkg.duration_hours}</td>
                  <td className="px-4 py-3">{pkg.km_included}</td>
                  <td className="px-4 py-3">{pkg.base_fare}</td>
                  <td className={`px-4 py-3 font-medium ${
                    pkg.is_active ? "text-green-600" : "text-red-600"}
                    `}>
                    {pkg.is_active ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 hover:bg-gray-100 text-red-600 rounded-md"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No rental packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
        {current.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-4">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              «
            </button>

            {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded text-sm border ${
                    page === num
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white"
                  }`}
                >
                  {num}
                </button>
              );
            })}

            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              »
            </button>
          </div>
        )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
