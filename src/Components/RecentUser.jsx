import React, { useState, useEffect } from "react";

const API_URL =
  "https://adminapi.onlymeterindia.com/admin_dashboard_recent_activity/";

const RecentUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch recent users");
        const data = await res.json();
        setUsers(data.recent_users || []);
      } catch (err) {
        console.error("Error fetching recent users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
        <a
          href="/dashboard/customers"
          className="text-sm text-blue-black font-semibold hover:underline"
        >
          View all
        </a>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm">Loading recent users...</p>
      )}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-400 text-sm">No recent users found.</p>
      )}

      <div className="space-y-4">
        {!loading &&
          !error &&
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center hover:bg-gray-200 py-2"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`}
                alt={user.full_name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="font-medium text-gray-800">{user.full_name}</p>
                <p className="text-xs text-gray-500">
                  {user.registration_time}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentUsers;
