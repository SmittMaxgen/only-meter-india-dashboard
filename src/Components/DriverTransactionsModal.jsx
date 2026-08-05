import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";

/**
 * @param {() => void} onClose
 * @param {number|string} driverId
 * @param {string} driverLabel - display name shown in the header
 */
export default function DriverTransactionsModal({
  onClose,
  driverId,
  driverLabel,
}) {
  const { baseUrl } = useAppContext();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [paymentType, setPaymentType] = useState("");
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const PAGE_SIZE = 20;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    setPage(1);
  }, [paymentType, category, period, dateFrom, dateTo]);

  useEffect(() => {
    if (!driverId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (paymentType) params.append("payment_type", paymentType);
        if (category) params.append("category", category);
        if (dateFrom) params.append("date_from", dateFrom);
        if (dateTo) params.append("date_to", dateTo);
        if (!dateFrom && !dateTo && period) params.append("period", period);
        params.append("page", page);

        const res = await fetch(
          `${baseUrl}/driver_transactions/driver/${driverId}/?${params.toString()}`,
          { headers: { ...getAuthHeaders() } },
        );
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        setTransactions(list);
        setSummary(json.summary || null);
        setCount(json.count ?? list.length);
        setHasNext(Boolean(json.next));
        setHasPrevious(Boolean(json.previous));
      } catch (err) {
        console.error("Failed to fetch driver transactions:", err);
        setTransactions([]);
        setSummary(null);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    driverId,
    baseUrl,
    page,
    paymentType,
    category,
    period,
    dateFrom,
    dateTo,
  ]);

  const clearFilters = () => {
    setPaymentType("");
    setCategory("");
    setPeriod("");
    setDateFrom("");
    setDateTo("");
  };

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Wallet & Transactions — {driverLabel || ""}
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard{" "}
              <span className="text-orange-500">
                / Drivers / Transaction History
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryCard
            label="Wallet Balance"
            value={`₹${summary.wallet_balance ?? 0}`}
            highlight={summary.wallet_low}
          />
          <SummaryCard label="Active Plan" value={summary.active_plan || "-"} />
          <SummaryCard
            label="Plan Remaining KM"
            value={summary.plan_remaining_km ?? "-"}
          />
          <SummaryCard
            label="Blocked"
            value={summary.is_blocked ? "Yes" : "No"}
            highlight={summary.is_blocked}
          />
          <SummaryCard
            label="Earnings (Daily)"
            value={`₹${summary.earnings?.daily ?? 0}`}
          />
          <SummaryCard
            label="Earnings (Weekly)"
            value={`₹${summary.earnings?.weekly ?? 0}`}
          />
          <SummaryCard
            label="Earnings (Monthly)"
            value={`₹${summary.earnings?.monthly ?? 0}`}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Payment Types</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option value="joining_bonus">Joining Bonus</option>
            <option value="ride_deduction">Ride Deduction</option>
            <option value="plan_purchase">Plan Purchase</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            disabled={Boolean(dateFrom || dateTo)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <option value="">Any Period</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {loading && (
          <div className="py-10 text-center text-gray-500">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="mt-3">Loading transactions...</div>
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            No transactions found.
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-medium">ID</th>
                    <th className="px-3 py-2 font-medium">Ride ID</th>
                    <th className="px-3 py-2 font-medium">Category</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Payment Type</th>
                    <th className="px-3 py-2 font-medium">Amount</th>
                    <th className="px-3 py-2 font-medium">Balance After</th>
                    <th className="px-3 py-2 font-medium">KM Value</th>
                    <th className="px-3 py-2 font-medium">Plan</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                    <th className="px-3 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-gray-100 hover:bg-orange-50"
                    >
                      <td className="px-3 py-2 font-medium text-gray-900">
                        #{t.id}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {t.ride_id ?? "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-700 capitalize">
                        {t.category?.replace(/_/g, " ") || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            t.transaction_type === "credit"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700 capitalize">
                        {t.payment_type || "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {t.amount != null ? `₹${t.amount}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {t.balance_after != null ? `₹${t.balance_after}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {t.km_value != null
                          ? `${t.km_value} km`
                          : t.km_balance_after != null
                            ? `${t.km_balance_after} km left`
                            : "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {t.plan_name || "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-500 max-w-xs truncate">
                        {t.description || "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages} · {count} total transactions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrevious || page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`text-sm font-semibold mt-1 ${
          highlight ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
