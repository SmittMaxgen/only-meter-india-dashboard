import { useEffect, useMemo, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

/* ----------------------------- HEADER ----------------------------- */
function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">OnBoarding</h1>
          <p className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ OnBoarding</span>
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add OnBoarding
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- UPLOAD BOX ----------------------------- */
function UploadBox({ value, onChange }) {
  const preview = useMemo(() => {
    if (!value) return "";
    if (typeof value === "string") return value.startsWith("http") ? value : `https://adminapi.onlymeterindia.com/${value}`;
    if (value instanceof File) return URL.createObjectURL(value);
    return "";
  }, [value]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 grid place-items-center bg-gray-50">
      <label className="flex flex-col items-center gap-2 cursor-pointer">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-28 w-full object-cover rounded-md border"
          />
        ) : (
          <>
            <PhotoIcon className="h-8 w-8 text-gray-400" />
            <span className="text-gray-500 text-sm">Upload image</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

/* ----------------------------- MODAL ----------------------------- */
function Modal({ title = "OnBoarding", open, onClose, onSave, initial }) {
  const [image, setImage] = useState("");
  const [title1, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initial) {
      setImage(initial.image || "");
      setTitle(initial.title || "");
      setDescription(initial.description || "");
    } else {
      setImage("");
      setTitle("");
      setDescription("");
    }
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    if (!title1.trim()) return;
    onSave({
      image,
      title: title1.trim(),
      description,
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <UploadBox value={image} onChange={setImage} />

          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              value={title1}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- MAIN COMPONENT ----------------------------- */
export default function Banner() {
  const { fetchedData, postData, patchData, deleteData } = useAppContext();
  const [onboarding, setOnboarding] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setOnboarding(fetchedData.onboardings || []);
  }, [fetchedData.onboardings]);

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

      // Only append image if a new File is selected
      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      // Append other fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image") payload.append(key, value);
      });

      if (editing) {
        // keep old image if not updated
        const res = await patchData(
          `/onboarding/${editing.id}/`,
          payload,
          "OnBoarding"
        );

        setOnboarding((prev) =>
          prev.map((v) =>
            v.id === editing.id
              ? { ...v, ...formData, image: formData.image || v.image }
              : v
          )
        );
      } else {
        const res = await postData("/onboarding/", payload, "OnBoarding");
        if (res && res.data) setOnboarding((prev) => [...prev, res.data]);
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/onboarding/${id}/`);
      setOnboarding((prev) => prev.filter((v) => v.id !== id));
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
                <th className="px-4 py-3 font-medium text-left">Image</th>
                <th className="px-4 py-3 font-medium text-left">Title</th>
                <th className="px-4 py-3 font-medium text-left">Description</th>
                <th className="px-4 py-3 font-medium text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {onboarding.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="h-12 w-28 rounded-md overflow-hidden border">
                      <img
                        src={`https://onlymeterindia.info/${r.image}`}
                        alt={r.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {r.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {onboarding.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No OnBoarding yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="OnBoarding"
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
