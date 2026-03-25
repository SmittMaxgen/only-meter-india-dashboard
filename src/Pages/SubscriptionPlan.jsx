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
            Subscription Plan
          </h1>
          <div className="text-sm text-gray-500">
            Dashboard <span className="text-orange-500">/ Subscription Plan</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          Add Subscription Plan
        </button>
      </div>
    </div>
  );
}

// ---------------------- Modal ----------------------
function Modal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    period: "",
    interval: 0,
  });

  useMemo(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        amount: initial.amount || "",
        period: initial.period || "",
        interval: initial.interval || 0,
      });
    } else {
      setForm({
        name: "",
        amount: "",
        period: "",
        interval: 0,
      });
    }
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    if (!form.name?.trim()) return alert("Please enter a name");
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-sm mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Name"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Amount</label>
              <input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter Amount"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Period</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">
                Interval <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.interval}
                onChange={(e) => setForm({ ...form, interval: e.target.value })}
                placeholder="Enter Interval (e.g. 1)"
                className="w-full border rounded-lg px-3 py-2"
              />
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
export default function SubscriptionPlan() {
  const { fetchedData,postData, patchData } = useAppContext();
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setPlans(fetchedData.subscriptions || []);
  }, [fetchedData.subscriptions]);

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  // function openEdit(plan) {
  //   setEditing(plan);
  //   setOpen(true);
  // }

  const handleSave = async (formData) => {
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

      if (editing) {
        const res = await patchData(`/plans/create/${editing.id}/`, payload, "Plan");
        // Update local state immediately
        setPlans((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...formData } : p))
        );
      } else {
        const res = await postData("/plans/create/", payload, "Plan");
        // Add new item locally (if response has data)
        if (res && res.data) {
          setPlans((prev) => [...prev, res.data]);
        }
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteData(`/plans/${id}/`);
  //     // Remove deleted row immediately
  //     setPlans((prev) => prev.filter((p) => p.id !== id));
  //   } catch (error) {
  //     console.error("Delete Error:", error);
  //   }
  // };

  return (
    <div className="space-y-4">
      <Header onAdd={openAdd} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Id</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-left">Interval</th>
                <th className="px-4 py-3 text-left">Created At</th>
                {/* <th className="px-4 py-3 text-left">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {plans.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.razorpay_plan_id}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.amount}</td>
                  <td className="px-4 py-3">{r.period}</td>
                  <td className="px-4 py-3">{r.interval}</td>
                  <td className="px-4 py-3">{r.created_at}</td>
                  {/* <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 hover:bg-gray-100 text-red-600 rounded-md"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No subscription plans yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
