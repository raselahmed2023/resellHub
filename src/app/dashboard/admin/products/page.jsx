"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Trash2, CheckCircle, X, Search } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const STATUS_COLOR = {
  "available": "bg-emerald-100 text-emerald-700",
  "pending": "bg-amber-100 text-amber-700",
  "rejected": "bg-red-100 text-red-700",
  "reserved": "bg-gray-100 text-gray-600",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    axiosSecure.get("/api/admin/products")
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axiosSecure.patch(`/api/admin/products/${id}`, { status });
      setProducts((p) => p.map((item) => item._id === id ? { ...item, status } : item));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await axiosSecure.delete(`/api/admin/products/${id}`);
      setProducts((p) => p.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <Package size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manage products</h1>
            <p className="text-xs text-gray-500">{products.length} total products.</p>
          </div>
        </div>

        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by title or category..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{product.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category} · by {product.sellerInfo?.name}</p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status] || "bg-gray-100 text-gray-600"}`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-orange-500 flex-shrink-0">৳{Number(product.price).toLocaleString()}</p>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {product.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatus(product._id, "available")}
                        disabled={updating === product._id}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition disabled:opacity-50"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatus(product._id, "rejected")}
                        disabled={updating === product._id}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <X size={12} /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting === product._id}
                    className="w-8 h-8 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deleting === product._id
                      ? <Loader2 size={13} className="animate-spin text-red-400" />
                      : <Trash2 size={13} className="text-red-500" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}