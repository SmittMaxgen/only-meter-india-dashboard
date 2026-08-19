import { useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

// ---------------------- Header ----------------------
function Header({ onAdd, filters, onFilterChange, drivers }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Driver Plan Purchases
          </h1>
          <div className="text-sm text-gray-500">
            Dashboard{" "}
            <span className="text-orange-500">/ Driver Plan Purchases</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <select
            value={filters.driver_id}
            onChange={(e) =>
              onFilterChange({ ...filters, driver_id: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
          >
            <option value="">All Drivers</option>
            {(drivers || []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.first_name
                  ? `${d.first_name} ${d.last_name || ""}`.trim()
                  : `Driver #${d.id}`}
              </option>
            ))}
          </select> */}

          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ ...filters, status: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          {/* 
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-2 rounded-md"
          >
            <PlusIcon className="h-5 w-5" />
            Purchase Plan
          </button> */}
        </div>
      </div>
    </div>
  );
}

// ---------------------- Modal ----------------------
function Modal({ open, onClose, onSave, drivers, plans }) {
  const [form, setForm] = useState({ driver_data: "", plan_data: "" });

  useEffect(() => {
    if (open) setForm({ driver_data: "", plan_data: "" });
  }, [open]);

  if (!open) return null;

  function handleSave() {
    if (!form.driver_data) return alert("Please select a driver");
    if (!form.plan_data) return alert("Please select a plan");
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-lg mx-auto mt-16 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Purchase Ride Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block font-bold text-sm mb-1">Driver</label>
            <select
              value={form.driver_data}
              onChange={(e) =>
                setForm({ ...form, driver_data: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Driver</option>
              {(drivers || []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name
                    ? `${d.first_name} ${d.last_name || ""}`.trim()
                    : `Driver #${d.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-sm mb-1">Ride Plan</label>
            <select
              value={form.plan_data}
              onChange={(e) => setForm({ ...form, plan_data: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Plan</option>
              {(plans || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.vehicle_type} — ₹{p.final_amount ?? p.amount}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Helpers ----------------------
function StatusBadge({ status }) {
  const isActive = String(status).toLowerCase() === "active";
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function driverLabel(d) {
  if (!d) return "—";
  if (typeof d === "object")
    return d.first_name
      ? `${d.first_name} ${d.last_name || ""}`.trim()
      : `#${d.id}`;
  return `#${d}`;
}

function planLabel(p) {
  if (!p) return "—";
  if (typeof p === "object")
    return `${p.name || "Plan"}${p.vehicle_type ? ` (${p.vehicle_type})` : ""}`;
  return `#${p}`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------------------- Main Component ----------------------
export default function DriverPlanPurchase() {
  const { fetchedData, postData, refetchResource } = useAppContext();
  const [purchases, setPurchases] = useState([]);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ driver_id: "", status: "" });

  const buildEndpoint = (f) => {
    const base = f.driver_id
      ? `/driver_plan_purchase/driver/${f.driver_id}/`
      : `/driver_plan_purchase/`;
    return f.status ? `${base}?status=${f.status}` : base;
  };

  useEffect(() => {
    refetchResource("driverPlanPurchases", buildEndpoint(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Make sure drivers and ride plans are loaded for the purchase modal / driver filter
  useEffect(() => {
    if (!fetchedData.drivers) refetchResource("drivers", "/driver/");
    if (!fetchedData.ridePlans) refetchResource("ridePlans", "/ride_plan/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPurchases(fetchedData.driverPlanPurchases || []);
  }, [fetchedData.driverPlanPurchases]);

  const handlePurchase = async (formData) => {
    try {
      const payload = {
        driver_data: Number(formData.driver_data),
        plan_data: Number(formData.plan_data),
      };

      await postData(
        "/driver_plan_purchase/",
        JSON.stringify(payload),
        "Plan Purchase",
      );

      await refetchResource("driverPlanPurchases", buildEndpoint(filters));
      setOpen(false);
    } catch (error) {
      console.error("Purchase Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Header
        onAdd={() => setOpen(true)}
        filters={filters}
        onFilterChange={setFilters}
        drivers={fetchedData.drivers}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Id</th>
                <th className="px-4 py-3 text-left">Driver</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Amount Paid</th>
                <th className="px-4 py-3 text-left">Ride Points</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Purchased At</th>
                <th className="px-4 py-3 text-left">Expires At</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{r.id}</td>
                  <td className="px-4 py-3">{driverLabel(r.driver_data)}</td>
                  <td className="px-4 py-3">{planLabel(r.plan_data)}</td>
                  <td className="px-4 py-3">
                    {r.final_amount ??
                      (typeof r.plan_data === "object"
                        ? r.plan_data?.final_amount
                        : "—")}
                  </td>
                  <td className="px-4 py-3">
                    {r.ride_point ??
                      (typeof r.plan_data === "object"
                        ? r.plan_data?.ride_point
                        : "—")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(r.purchased_at || r.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(r.expires_at)}
                  </td>
                </tr>
              ))}

              {purchases.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No plan purchases yet.
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
        onSave={handlePurchase}
        drivers={fetchedData.drivers}
        plans={fetchedData.ridePlans}
      />
    </div>
  );
}
