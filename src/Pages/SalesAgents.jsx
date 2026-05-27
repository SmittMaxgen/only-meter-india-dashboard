import { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function SalesAgents() {
  const { fetchedData, deleteData, postData, patchData } = useAppContext();

  const [agents, setAgents] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  // Load Data
  useEffect(() => {
    setAgents(fetchedData.salesAgents || []);
  }, [fetchedData.salesAgents]);

  // Dynamic Search
  const filtered = useMemo(() => {
    if (!query.trim()) return agents;
    const q = query.toLowerCase().trim();
    return agents.filter(
      (agent) =>
        agent.name?.toLowerCase().includes(q) ||
        agent.mobile?.toLowerCase().includes(q),
    );
  }, [query, agents]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setFormData({ name: "", mobile: "" });
    setEditingAgent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name || "",
      mobile: agent.mobile || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // ✅ Smart Submit - Send only changed fields in PATCH
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile) {
      Swal.fire("Error", "Name and Mobile Number are required!", "error");
      return;
    }

    const payload = new FormData();

    if (editingAgent) {
      // PATCH - Only send changed fields
      let hasChanges = false;

      if (formData.name !== editingAgent.name) {
        payload.append("name", formData.name);
        hasChanges = true;
      }
      if (formData.mobile !== editingAgent.mobile) {
        payload.append("mobile", formData.mobile);
        hasChanges = true;
      }

      if (!hasChanges) {
        Swal.fire("No Changes", "Nothing was changed.", "info");
        closeModal();
        return;
      }

      try {
        await patchData(
          `/sales_agent/${editingAgent.agent_id}/`,
          payload,
          "Sales Agent",
        );

        // Update local state
        setAgents((prev) =>
          prev.map((a) =>
            a.agent_id === editingAgent.agent_id ? { ...a, ...formData } : a,
          ),
        );
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      // CREATE - Send all fields
      payload.append("name", formData.name);
      payload.append("mobile", formData.mobile);
      try {
        await postData("/sales_agent/", payload, "Sales Agent");
        window.location.reload();
      } catch (err) {
        console.error(err);
        return;
      }
    }

    closeModal();
  };

  const handleDelete = async (agent_id) => {
    try {
      await deleteData(`/sales_agent/${agent_id}/`);
      setAgents((prev) => prev.filter((a) => a.agent_id !== agent_id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const exportToExcel = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((agent) => ({
      "Agent ID": agent.agent_id || "-",
      Name: agent.name || "-",
      Mobile: agent.mobile || "-",
      "Created At": agent.created_at
        ? new Date(agent.created_at).toLocaleString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch:
        Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) +
        2,
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales_Agents");
    XLSX.writeFile(
      workbook,
      `SalesAgents_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sales Agents
            </h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Sales Agents</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Add Agent
            </button>

            <button
              onClick={exportToExcel}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((agent) => (
                <tr
                  key={agent.agent_id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{agent.name}</td>
                  <td className="px-4 py-3">{agent.mobile}</td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/dashboard/sales-agent-detail/${agent.agent_id}`}
                    >
                      <button className="text-gray-600 hover:text-gray-800">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(agent.agent_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No sales agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4 border-t">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            «
          </button>
          {Array.from({ length: pageCount })
            .slice(0, 5)
            .map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold mb-5 text-gray-900">
              {editingAgent ? "Edit Sales Agent" : "Add New Sales Agent"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium"
                >
                  {editingAgent ? "Update Agent" : "Add Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
