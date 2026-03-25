import { useMemo, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function Header({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Offers</h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Offers</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add Offer
        </button>
      </div>
    </div>
  );
}

function Modal({ title = "Offers", open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    code: initial?.code || "",
    minAmount: initial?.minAmount ?? "",
    amount: initial?.amount ?? "",
    commissionType: initial?.commissionType || "Fix",
    couponType: initial?.couponType || "Public",
    expire: initial?.expire || "",
    active: initial?.active ?? false,
  });
  
  useMemo(() => {
    setForm({
      title: initial?.title || "",
      code: initial?.code || "",
      minAmount: initial?.minAmount ?? "",
      amount: initial?.amount ?? "",
      commissionType: initial?.commissionType || "Fix",
      couponType: initial?.couponType || "Public",
      expire: initial?.expire || "",
      active: initial?.active ?? false,
    });
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    if (!form.title?.trim()) return;
    onSave({
      title: form.title.trim(),
      code: form.code.trim(),
      minAmount: Number(form.minAmount) || 0,
      amount: Number(form.amount) || 0,
      commissionType: form.commissionType,
      couponType: form.couponType,
      expire: form.expire,
      active: !!form.active,
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter Coupon Title"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Code</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Enter Coupon Code"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Minimum Amount</label>
              <input
                type="number"
                value={form.minAmount}
                onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                placeholder="Enter Minimum Amount"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter Amount"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Commission Type</label>
              <select
                value={form.commissionType}
                onChange={(e) => setForm({ ...form, commissionType: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Fix">Fix</option>
                <option value="Percent">Percent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Coupon Type</label>
              <select
                value={form.couponType}
                onChange={(e) => setForm({ ...form, couponType: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Coupon Expire Date</label>
              <input
                type="date"
                value={form.expire}
                onChange={(e) => setForm({ ...form, expire: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <span className="block text-sm text-gray-700 mb-1">Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Offer() {
  const [rows, setRows] = useState([
    {
        id: 1,
        title: "Weekend Special",
        code: "WEEKEND20",
        expire: "2025-12-31",
        active: true,
        couponType: "Discount",
        commissionType: "Percentage",
        minAmount: 200,
        amount: 20,
    },
    {
        id: 2,
        title: "Happy Hours Offer",
        code: "HAPPY25",
        expire: "2025-11-30",
        active: true,
        couponType: "Time-Limited",
        commissionType: "Percentage",
        minAmount: 150,
        amount: 25,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row or null

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setOpen(true);
  }
  function handleSave(data) {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)));
    } else {
      setRows((prev) => [
        ...prev,
        { id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1, ...data },
      ]);
    }
    setOpen(false);
  }

  function remove(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleActive(id) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  }

  return (
    <div className="space-y-4">
      <Header onAdd={openAdd} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Expire</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Coupon Type</th>
                <th className="px-4 py-3 font-medium">Commission Type</th>
                <th className="px-4 py-3 font-medium">MinAmount</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.code}</td>
                  <td className="px-4 py-3">{r.expire}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={r.active}
                        onChange={() => toggleActive(r.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3">{r.couponType}</td>
                  <td className="px-4 py-3">{r.commissionType}</td>
                  <td className="px-4 py-3">₹{r.minAmount}</td>
                  <td className="px-4 py-3">₹{r.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-md hover:bg-gray-100"
                        onClick={() => openEdit(r)}
                        aria-label="Edit"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        className="p-2 rounded-md hover:bg-gray-100 text-red-600"
                        onClick={() => remove(r.id)}
                        aria-label="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No offers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Offer"
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}