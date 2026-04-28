import { useState, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

/* ----------------------------- HEADER ----------------------------- */
function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicle Model</h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Vehicle Model</span>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add Vehicle Model
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- MODAL ----------------------------- */
function Modal({ title, open, onClose, onSave, initial, brands }) {
  const [form, setForm] = useState({
    name: "",
    brand_data: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: initial?.name || "",
      brand_data: initial?.brand_data?.id || initial?.brand_data || "",
      year: initial?.year || "",
    });
  }, [initial]);

  // if (!open) return null;
  if (!open) return null;

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

  async function handleSave() {
    if (!form.name.trim() || !form.brand_data || !form.year) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter all required fields.",
      });
      return;
    }

    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brand Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-1">Brand</label>
              <select
                value={form.brand_data}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand_data: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Brand</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Year Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-1">Year</label>

              <select
                value={form.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    year: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Year</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {/* Model Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Model Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Vehicle Model"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- MAIN COMPONENT ----------------------------- */
export default function VehicleModel() {
  const { fetchedData, postData, patchData, deleteData } = useAppContext();

  const [models, setModels] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const brandsList = fetchedData.brands || [];

  useEffect(() => {
    setModels(fetchedData.models || []);
  }, [fetchedData.models]);

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
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

      if (editing) {
        await patchData(`/model/${editing.id}/`, payload, "Vehicle Model");

        const selectedBrand = fetchedData.brands.find(
          (b) => b.id === Number(formData.brand_data),
        );

        setModels((prev) =>
          prev.map((v) =>
            v.id === editing.id
              ? { ...v, name: formData.name, brand_data: selectedBrand }
              : v,
          ),
        );
      } else {
        const res = await postData("/model/", payload, "Vehicle Model");
        if (res) {
          setModels((prev) => [...prev, res.data || res]);
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
      await deleteData(`/model/${id}/`);
      setModels((prev) => prev.filter((v) => v.id !== id));
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
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Model Name</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.brand_data?.name}</td>
                  <td className="px-4 py-3">{r.name}</td>
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
              {models.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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
        title={editing ? "Edit Vehicle Model" : "Add Vehicle Model"}
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
        brands={brandsList}
      />
    </div>
  );
}
