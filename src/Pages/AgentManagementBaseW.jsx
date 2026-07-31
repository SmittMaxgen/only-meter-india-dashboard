import { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  EyeSlashIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { State, City } from "country-state-city";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

// NOTE: The sample GET response you shared shows role as a nested object:
//   "role": { "id": 2, "role_name": "customer_manager" }
// For POST/PATCH we don't know if your backend wants the numeric id or the
// role_name slug. This sends the slug ("driver_manager" / "customer_manager").
// If your API instead expects the numeric id, change ROLE_ID below (the
// sample response showed id 2 for customer_manager, driver_manager's id is
// unconfirmed) and swap the payload.append("role", ...) line to use it.
const ROLE_IDS = {
  driver_manager: 1, // TODO: confirm this id with your backend
  customer_manager: 2,
};

/**
 * Shared list/detail management screen for /admin_data/?role=<role>
 *
 * @param {"driver_manager"|"customer_manager"} role
 * @param {string} title - Heading shown on the page
 * @param {string} breadcrumbLabel - Text shown in the breadcrumb
 */
export default function AgentManagementBase({
  role,
  roles,
  title,
  breadcrumbLabel,
}) {
  const { baseUrl, postData, patchData, deleteData } = useAppContext();

  // Support either a single `role` (backward compatible) or a `roles` array
  // for pages that manage agents across multiple roles (e.g. drv_pls_cust).
  const roleList = roles && roles.length ? roles : [role];
  const isMultiRole = roleList.length > 1;

  const [agents, setAgents] = useState([]);
  const [roleIdMap, setRoleIdMap] = useState({});
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailQuery, setEmailQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    state: "",
    cities: [],
    roleSelect: "",
  });

  // India states/cities from the country-state-city package
  // npm install country-state-city
  const indiaStates = useMemo(() => State.getStatesOfCountry("IN"), []);

  const availableCities = useMemo(() => {
    if (!formData.state) return [];
    const st = indiaStates.find((s) => s.name === formData.state);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [formData.state, indiaStates]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchRoleId = async () => {
    try {
      const res = await fetch(`${baseUrl}/admin_role/`, {
        headers: { ...getAuthHeaders() },
      });
      const data = await res.json();
      const all = data.data || [];

      const map = {};
      roleList.forEach((r) => {
        const matched = all.find((x) => x.role_name === r);
        map[r] = matched ? matched.id : null;
      });
      setRoleIdMap(map);

      // Keep single roleId for backward-compat (single-role pages)
      if (!isMultiRole) {
        setRoleId(map[roleList[0]] ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch role id:", error);
    }
  };

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        roleList.map((r) =>
          fetch(`${baseUrl}/admin_data/?role=${r}`, {
            headers: { ...getAuthHeaders() },
          }).then((res) => res.json()),
        ),
      );

      const merged = results.flatMap((data) => data.data || []);
      const deduped = Array.from(
        new Map(merged.map((a) => [a.id, a])).values(),
      );

      setAgents(deduped);
      setPage(1);
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire("Error", "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleId();
    fetchAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Client-side search/filter (role filter is server-side via query param above)
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchesEmail = a.email
        ?.toLowerCase()
        .includes(emailQuery.trim().toLowerCase());
      const matchesState = stateFilter ? a.state === stateFilter : true;
      return (emailQuery ? matchesEmail : true) && matchesState;
    });
  }, [agents, emailQuery, stateFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      state: "",
      cities: [],
      roleSelect: isMultiRole ? "" : roleList[0],
    });
    setEditingAgent(null);
    setShowPassword(false);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    const agentRoleName =
      typeof agent.role === "object" ? agent.role?.role_name : agent.role;
    setFormData({
      email: agent.email || "",
      password: "",
      state: agent.state || "",
      cities: Array.isArray(agent.cities) ? agent.cities : [],
      roleSelect: agentRoleName || (isMultiRole ? "" : roleList[0]),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const toggleCity = (cityName) => {
    setFormData((prev) => {
      const exists = prev.cities.includes(cityName);
      return {
        ...prev,
        cities: exists
          ? prev.cities.filter((c) => c !== cityName)
          : [...prev.cities, cityName],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.state ||
      formData.cities.length === 0 ||
      (isMultiRole && !formData.roleSelect)
    ) {
      Swal.fire(
        "Error",
        `Email, State, at least one City${
          isMultiRole ? ", and Role" : ""
        } are required!`,
        "error",
      );
      return;
    }
    if (!editingAgent && !formData.password) {
      Swal.fire("Error", "Password is required for a new agent!", "error");
      return;
    }

    const selectedRoleId = isMultiRole
      ? roleIdMap[formData.roleSelect]
      : roleId;

    if (!selectedRoleId) {
      Swal.fire("Error", "Role id could not be loaded. Please retry.", "error");
      return;
    }

    const payload = new FormData();
    payload.append("email", formData.email);
    if (formData.password) {
      payload.append("password", formData.password);
    }
    payload.append("role", selectedRoleId);
    payload.append("state", formData.state);
    // cities sent as a single JSON array string, e.g. '["Ahmedabad","Agol","Adalaj"]'
    payload.append("cities", JSON.stringify(formData.cities));

    try {
      if (editingAgent) {
        await patchData(`/admin_data/${editingAgent.id}/`, payload, title);
      } else {
        payload.append("is_active", true);
        await postData(`/admin_data/`, payload, title);
      }
      fetchAgents();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/admin_data/${id}/`);
      fetchAgents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (agent) => {
    const payload = new FormData();
    payload.append("is_active", !agent.is_active);
    try {
      await patchData(`/admin_data/${agent.id}/`, payload, title);
      fetchAgents();
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const exportToExcel = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((agent) => ({
      Email: agent.email || "-",
      State: agent.state || "-",
      Cities: Array.isArray(agent.cities) ? agent.cities.join(", ") : "-",
      Active: agent.is_active ? "Yes" : "No",
      "Created At": agent.timestamp
        ? new Date(agent.timestamp).toLocaleString()
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
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(
      workbook,
      `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="text-sm text-gray-500">
              Dashboard{" "}
              <span className="text-orange-500">/ {breadcrumbLabel}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Email Search */}
            <div className="relative w-56">
              <input
                type="text"
                placeholder="Search by Email..."
                value={emailQuery}
                onChange={(e) => {
                  setEmailQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All States</option>
              {indiaStates.map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Add
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
                <th className="px-4 py-3 font-medium">Email</th>
                {isMultiRole && (
                  <th className="px-4 py-3 font-medium">Role</th>
                )}
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Cities</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                current.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{agent.email}</td>
                    {isMultiRole && (
                      <td className="px-4 py-3 capitalize">
                        {typeof agent.role === "object"
                          ? agent.role?.role_name?.replace(/_/g, " ")
                          : agent.role?.replace(/_/g, " ") || "-"}
                      </td>
                    )}
                    <td className="px-4 py-3">{agent.state}</td>
                    <td className="px-4 py-3">
                      {Array.isArray(agent.cities)
                        ? agent.cities.join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!agent.is_active}
                          onChange={() => handleToggleActive(agent)}
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
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && current.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No records found
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-5 text-gray-900">
              {editingAgent ? `Edit ${title}` : `Add New ${title}`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password{" "}
                  {!editingAgent && <span className="text-red-500">*</span>}
                  {editingAgent && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      (leave blank to keep unchanged)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingAgent}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {isMultiRole && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.roleSelect}
                    onChange={(e) =>
                      setFormData({ ...formData, roleSelect: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Role</option>
                    {roleList.map((r) => (
                      <option key={r} value={r}>
                        {r === "driver_manager" ? "Driver Manager" : "Customer Manager"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      cities: [],
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select State</option>
                  {indiaStates.map((s) => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cities <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-xl max-h-40 overflow-y-auto p-2 space-y-1">
                  {!formData.state && (
                    <p className="text-sm text-gray-400 px-2 py-1">
                      Select a state first
                    </p>
                  )}
                  {formData.state && availableCities.length === 0 && (
                    <p className="text-sm text-gray-400 px-2 py-1">
                      No cities found for this state
                    </p>
                  )}
                  {availableCities.map((c) => (
                    <label
                      key={c.name}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.cities.includes(c.name)}
                        onChange={() => toggleCity(c.name)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{c.name}</span>
                    </label>
                  ))}
                </div>
                {formData.cities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.cities.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => toggleCity(c)}
                          className="hover:text-orange-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                  {editingAgent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
