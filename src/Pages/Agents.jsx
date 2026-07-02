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

export default function Agents() {
  const { fetchedData, deleteData, postData, patchData, baseUrl, refetchResource } =
    useAppContext();

  const [agents, setAgents] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  // Fetch with search parameters
  const fetchAgents = async (name = "", phone = "") => {
    try {
      let endpoint = "/agent/";
      const params = new URLSearchParams();

      if (name.trim()) params.append("full_name", name.trim());
      if (phone.trim()) params.append("phone", phone.trim());

      if (params.toString()) {
        endpoint += "?" + params.toString();
      }

      const res = await fetch(`${baseUrl}${endpoint}`);
      const data = await res.json();
      setAgents(data.data || []);
      setPage(1);
    } catch (error) {
      console.error("Search Error:", error);
      Swal.fire("Error", "Failed to fetch agents", "error");
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAgents();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAgents(nameQuery, phoneQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [nameQuery, phoneQuery]);

  const pageCount = Math.max(1, Math.ceil(agents.length / pageSize));
  const current = agents.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setFormData({ full_name: "", phone: "" });
    setEditingAgent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      full_name: agent.full_name || "",
      phone: agent.phone || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      Swal.fire("Error", "Full Name and Phone Number are required!", "error");
      return;
    }

    const payload = new FormData();
    let hasChanges = false;

    if (editingAgent) {
      if (formData.full_name !== editingAgent.full_name) {
        payload.append("full_name", formData.full_name);
        hasChanges = true;
      }
      if (formData.phone !== editingAgent.phone) {
        payload.append("phone", formData.phone);
        hasChanges = true;
      }

      if (!hasChanges) {
        closeModal();
        return;
      }

      await patchData(
        `/agent/${editingAgent.id}/`,
        payload,
        "Agent"
      );
      fetchAgents(nameQuery, phoneQuery);
    } else {
      payload.append("full_name", formData.full_name);
      payload.append("phone", formData.phone);
      await postData("/agent/", payload, "Agent");
      fetchAgents(nameQuery, phoneQuery);
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/agent/${id}/`);
      fetchAgents(nameQuery, phoneQuery);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle isApproved
  const handleToggleApproval = async (agent) => {
    const newStatus = !agent.isApproved;
    
    const payload = new FormData();
    payload.append("isApproved", newStatus);

    try {
      await patchData(
        `/agent/${agent.id}/`,
        payload,
        "Agent Approval"
      );
      fetchAgents(nameQuery, phoneQuery); // Refresh list
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const exportToExcel = () => {
    if (agents.length === 0) return;

    const rows = agents.map((agent) => ({
      "Agent ID": agent.agent_id || "-",
      "Full Name": agent.full_name || "-",
      Phone: agent.phone || "-",
      Status: agent.status || "-",
"Approved": agent.isApproved ? "Yes" : "No",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
    XLSX.writeFile(
      workbook,
      `Agents_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Agents</h1>
            <div className="text-sm text-gray-500">
              Dashboard <span className="text-orange-500">/ Agents</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Name Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by Name..."
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Phone Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by Phone..."
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Add Agent
            </button> */}

            <button
              onClick={exportToExcel}
              disabled={agents.length === 0}
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
                <th className="px-4 py-3 font-medium">Full Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Approved</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{agent.full_name}</td>
                  <td className="px-4 py-3">{agent.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        agent.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>

                  {/* Toggle Switch */}
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!agent.isApproved}
                        onChange={() => handleToggleApproval(agent)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </td>

                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <Link to={`/dashboard/agent-detail/${agent.agent_id}`}>
                      <button className="text-gray-600 hover:text-gray-800">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(agent.id)}
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
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No agents found
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold mb-5 text-gray-900">
              {editingAgent ? "Edit Agent" : "Add New Agent"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
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