"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Trash2, Search, Shield } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const ROLE_COLOR = {
  "admin": "bg-purple-100 text-purple-700",
  "seller": "bg-blue-100 text-blue-700",
  "buyer": "bg-emerald-100 text-emerald-700",
};

const STATUS_COLOR = {
  "active": "bg-green-100 text-green-700",
  "blocked": "bg-red-100 text-red-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    axiosSecure.get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id, data) => {
    setUpdating(id);
    try {
      await axiosSecure.patch(`/api/admin/users/${id}`, data);
      setUsers((p) => p.map((u) => u._id === id ? { ...u, ...data } : u));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    setDeleting(id);
    try {
      await axiosSecure.delete(`/api/admin/users/${id}`);
      setUsers((p) => p.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
            <Users size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manage users</h1>
            <p className="text-xs text-gray-500">{users.length} total users.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <div key={user._id} className="flex items-center gap-4 px-5 py-3 flex-wrap sm:flex-nowrap">

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-indigo-700">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  {/* Role */}
                  <select
                    value={user.role || "buyer"}
                    onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                    disabled={updating === user._id}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${ROLE_COLOR[user.role] || "bg-gray-100 text-gray-600"}`}
                  >
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>

                  {/* Status */}
                  <button
                    onClick={() => handleUpdate(user._id, { status: user.status === "active" ? "blocked" : "active" })}
                    disabled={updating === user._id}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLOR[user.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {user.status || "active"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deleting === user._id}
                    className="w-8 h-8 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50 flex-shrink-0"
                  >
                    {deleting === user._id
                      ? <Loader2 size={13} className="animate-spin text-red-400" />
                      : <Trash2 size={13} className="text-red-500" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}