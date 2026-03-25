import { useMemo, useState, useEffect } from "react";
import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { Link } from "react-router-dom";

const getStatusChip = (status) => {
  switch (status) {
    case "active":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Active
        </span>
      );
    case "created":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          Created
        </span>
      );
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          Completed
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
};

export default function DriverSubscription() {
  const { fetchedData } = useAppContext();
  const [driverSubscriptionData, setDriverSubscriptionData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // ✅ new state
  const pageSize = 10;

  // ✅ Load data from context
  useEffect(() => {
    setDriverSubscriptionData(fetchedData.driverSubscriptions || []);
  }, [fetchedData.driverSubscriptions]);

  // ✅ Search filter
  const filtered = useMemo(() => {
    if (!query) return driverSubscriptionData;
    const q = query.toLowerCase();
    return driverSubscriptionData.filter(
      (r) =>
        r.driver_data.name?.toLowerCase().includes(q) ||
        r.plan_data.name?.toLowerCase().includes(q) ||
        r.razorpay_subscription_id?.toLowerCase().includes(q)
    );
  }, [query, driverSubscriptionData]);

  // ✅ Pagination logic
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ✅ Delete driver
  // const handleDelete = async (id) => {
  //   try {
  //     await deleteData(`/driver_subscription/${id}/`);
  //     setDriverSubscriptionData((prev) => prev.filter((d) => d.id !== id));
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: Title + breadcrumb */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Driver Subscription</h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Driver Subscription</span>
            </div>
          </div>

          {/* Right: Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            // ✅ Loader section
            <div className="py-10 text-center text-gray-500">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="mt-3">Loading drivers subscription...</div>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Id</th>
                  <th className="px-4 py-3 font-medium">Driver Name</th>
                  <th className="px-4 py-3 font-medium">Plan Name</th>
                  <th className="px-4 py-3 font-medium">Total Count</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {current.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {r.razorpay_subscription_id|| "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.driver_data.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{r.plan_data.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{r.total_count || "-"}</td>
                    <td className={`px-4 py-3 text-gray-700`}>{getStatusChip(r.status) || "-"}</td>
                    <td className="px-4 py-3">
                        <Link to={`/dashboard/driver-subscription-detail/${r.razorpay_subscription_id}`}>
                          <button
                            className="text-gray-700 text-sm px-1 cursor-pointer"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        {/* <button
                          onClick={() => handleDelete(r.razorpay_subscription_id)}
                          className="text-sm px-1 text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button> */}
                    </td>
                  </tr>
                ))}

                {!loading && current.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No driver subscription found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
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
  );
}
