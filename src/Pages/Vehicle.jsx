import { useMemo, useState, useEffect } from "react";
import { PencilIcon,TrashIcon,PlusIcon,XMarkIcon} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicle</h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Vehicle</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          Add Vehicle
        </button>
      </div>
    </div>
  );
}

function Modal({ title, open, onClose, onSave, initial, brands, models, types }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    vehicleMode: "",
    seats: "",
    fuelType: "",
    baseFare: "",
    perKmRate: "",
  });

  const [loading, setLoading] = useState(false);

  // Update form when initial changes (for editing)
  useEffect(() => {
    if (initial) {
      setForm({
        brand: initial.brand_data?.id || "",
        model: initial.model_data?.id || "",
        type: initial.type_data?.id || "",
        vehicleMode: initial.vehicleMode || "",
        seats: initial.seats || "",
        fuelType: initial.fuelType || "",
        baseFare: initial.baseFare || "",
        perKmRate: initial.perKmRate || "",
      });
    } else {
      // Reset form for add mode
      setForm({
        brand: "",
        model: "",
        type: "",
        vehicleMode: "",
        seats: "",
        fuelType: "",
        baseFare: "",
        perKmRate: "",
      });
    }
  }, [initial]);

  if (!open) return null;

  async function handleSave() {
    if (!form.brand || !form.model) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please select Brand and Model.",
      });
      return;
    }

    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  // Filter models based on selected brand
  const filteredModels = models.filter(model => model.brand_data?.id == form.brand);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="p-2 hover:bg-gray-100 rounded-md" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Select */}
            <div>
              <label className="block text-sm font-semibold mb-1">Brand</label>
              <select
                value={form.brand}
                onChange={(e) => {
                  setForm({ 
                    ...form, 
                    brand: e.target.value,
                    model: "", // Reset model when brand changes
                    type: ""   // Reset type when brand changes
                  });
                }}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Select */}
            <div>
              <label className="block text-sm font-semibold mb-1">Model</label>
              <select
                value={form.model}
                onChange={(e) => {
                  setForm({ 
                    ...form, 
                    model: e.target.value,
                    type: "" // Reset type when model changes
                  });
                }}
                disabled={!form.brand}
                className="w-full border rounded-lg px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Model</option>
                {filteredModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-sm font-semibold mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Select Type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Regular input fields for other data */}
            {[
              ["Mode", "vehicleMode", "Enter Vehicle Mode", "text"],
              ["Seats", "seats", "Enter Number of Seats", "number"],
              ["Fuel Type", "fuelType", "Enter Fuel Type", "text"],
              ["Base Fare", "baseFare", "Enter Base Fare", "number"],
              ["KM Rate", "perKmRate", "Enter Per KM Rate", "number"],
            ].map(([label, key, placeholder, type = "text"]) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white cursor-pointer ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Vehicle() {
  const { fetchedData, postData, patchData, deleteData } = useAppContext();
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Fetch all data from context
  useEffect(() => {
    setVehicles(fetchedData.vehicle || []);
    setBrands(fetchedData.brands || []);
    setModels(fetchedData.models || []);
    setTypes(fetchedData.types || []);
  }, [fetchedData]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      // Create FormData
      const payload = new FormData();
      
      // For brand, model, and type, send as JSON strings
      payload.append('brand_data', formData.brand);
      payload.append('model_data', formData.model);
      payload.append('type_data', formData.type);
      payload.append('vehicleMode', formData.vehicleMode);
      payload.append('seats', formData.seats);
      payload.append('fuelType', formData.fuelType);
      payload.append('baseFare', formData.baseFare);
      payload.append('perKmRate', formData.perKmRate);

      if (editing) {
        const res = await patchData(`/vehicle/${editing.id}/`, payload, "Vehicle");
        // Update local state immediately
        setVehicles((prev) =>
          prev.map((v) => (v.id === editing.id ? { ...v, ...formData } : v))
        );
      } else {
        const res = await postData("/vehicle/", payload, "Vehicle");
        // Add new item locally (if response has data)
        if (res) {
          setVehicles((prev) => [res.data || res ,...prev]);
        }
      }

      setOpen(false);
      setEditing(null);
      
    } catch (error) {
      console.error("Save Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Something went wrong!",
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteData(`/vehicle/${id}/`);
    // Remove deleted row immediately
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <Header onAdd={openAdd} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Fuel Type</th>
                <th className="px-4 py-3 font-medium">Base Fare</th>
                <th className="px-4 py-3 font-medium">KM Rate</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.brand_data?.name || "-"}</td>
                  <td className="px-4 py-3">{r.model_data?.name || "-"}</td>
                  <td className="px-4 py-3">{r.type_data?.name || "-"}</td>
                  <td className="px-4 py-3">{r.vehicleMode}</td>
                  <td className="px-4 py-3">{r.seats}</td>
                  <td className="px-4 py-3">{r.fuelType}</td>
                  <td className="px-4 py-3">{r.baseFare}</td>
                  <td className="px-4 py-3">{r.perKmRate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        onClick={() => openEdit(r)}
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        className="p-2 rounded-md hover:bg-gray-100 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(r.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No Vehicle Models yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editing ? "Edit Vehicle" : "Add Vehicle"}
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
        brands={brands}
        models={models}
        types={types}
      />
    </div>
  );
}