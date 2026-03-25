import { useMemo, useState, useEffect } from "react";
import { PencilIcon,TrashIcon,PlusIcon,XMarkIcon} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import Swal from "sweetalert2";

function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicle Brand</h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Vehicle Brand</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          Add Vehicle Brand
        </button>
      </div>
    </div>
  );
}

function Modal({ title, open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
  });

  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setForm({
      name: initial?.name || "",
    });
  }, [initial]);

  if (!open) return null;

  async function handleSave() {
    if (!form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter Vehicle Brand name.",
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
          <button className="p-2 hover:bg-gray-100 rounded-md" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {[
              ["Brand", "name", "Enter Vehicle Brand"],
            ].map(([label, key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1">
                  {label}
                </label>
                <input
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

export default function VehicleBrand() {
  const { fetchedData, postData, patchData, deleteData } = useAppContext();
  const [brand, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setBrand(fetchedData.brands || []);
  }, [fetchedData.brands]);

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
        const res = await patchData(`/brand/${editing.id}/`, payload, "Brand");
        // Update local state immediately
        setBrand((prev) =>
          prev.map((v) => (v.id === editing.id ? { ...v, ...formData } : v))
        );
      } else {
        const res = await postData("/brand/", payload, "Brand");
        // Add new item locally (if response has data)
        if (res) {
          setBrand((prev) => [...prev, res.data || res]);
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
      await deleteData(`/brand/${id}/`);
      // Remove deleted row immediately
      setBrand((prev) => prev.filter((v) => v.id !== id));
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
                <th className="px-4 py-3 font-medium">Brand Name</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brand.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
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
              {brand.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No Vehicle Brands yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editing ? "Edit Vehicle Brand" : "Add Vehicle Brand"}
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
