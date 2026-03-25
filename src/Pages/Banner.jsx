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
          <h1 className="text-xl font-semibold text-gray-900">Banner</h1>
          <p className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Banner</span>
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add Banner
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
function Modal({ title = "Banner", open, onClose, onSave, initial }) {
  const [image, setImage] = useState("");
  const [title1, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (initial) {
      setImage(initial.image_id || "");
      setTitle(initial.title || "");
      setRedirectUrl(initial.redirect_url || "");
      setPriority(initial.priority || "");
      setStatus(initial.status || "Active");
    } else {
      setImage("");
      setTitle("");
      setRedirectUrl("");
      setPriority("");
      setStatus("Active");
    }
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    if (!title1.trim()) return;

    onSave({
      image,
      title: title1.trim(),
      redirect_url: redirectUrl,
      priority,
      status,
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <UploadBox value={image} onChange={setImage} />

          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              value={title1}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Redirect URL
            </label>
            <input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
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
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setBanners(fetchedData.banners || []);
  }, [fetchedData.banners]);

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
        payload.append("image_id", formData.image);
      }

      // Append other fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image_id") payload.append(key, value);
      });

      if (editing) {
        // keep old image if not updated
        const res = await patchData(
          `/ads_banner/${editing.id}/`,
          payload,
          "Banner"
        );

        setBanners((prev) =>
          prev.map((v) =>
            v.id === editing.id
              ? { ...v, ...formData, image: formData.image || v.image }
              : v
          )
        );
      } else {
        const res = await postData("/ads_banner/", payload, "Banner");
        if (res && res.data) setBanners((prev) => [...prev, res.data]);
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/ads_banner/${id}/`);
      setBanners((prev) => prev.filter((v) => v.id !== id));
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
                <th className="px-4 py-3 font-medium text-left">Redirect Url</th>
                <th className="px-4 py-3 font-medium text-left">Priority</th>
                <th className="px-4 py-3 font-medium text-left">Status</th>
                <th className="px-4 py-3 font-medium text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="h-12 w-28 rounded-md overflow-hidden border">
                      <img
                        src={`https://adminapi.onlymeterindia.com/${r.image_id}`}
                        alt={r.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {r.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.redirect_url || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.priority || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.status || "-"}
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

              {banners.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No Banner yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Banner"
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
