"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Plus, Pencil, Trash2, Search } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";
import { createPortal } from "react-dom";

const CONDITION_COLOR = {
    "Used": "bg-amber-100 text-amber-700",
    "Like New": "bg-emerald-100 text-emerald-700",
    "Refurbished": "bg-blue-100 text-blue-700",
};

const STATUS_COLOR = {
    "available": "bg-green-100 text-green-700",
    "reserved": "bg-gray-100 text-gray-600",
};

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get("/api/products/my-products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id) => {
        const confirmed = confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        setDeleting(id);
        try {
            await axiosSecure.delete(`/api/products/${id}`);
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

                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md flex-shrink-0">
                            <Package size={20} color="white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">My products</h1>
                            <p className="text-xs text-gray-500">Manage your listed items.</p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/seller/add-product"
                        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-black text-sm font-bold shadow hover:scale-[1.02] transition-all"
                    >
                        <Plus size={15} /> Add product
                    </Link>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-emerald-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Package size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 font-semibold">No products found.</p>
                        <p className="text-xs text-gray-400 mt-1">Add your first product to get started.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">

                                {/* Image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-gray-100">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{product.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600"}`}>
                                            {product.condition}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status] || "bg-gray-100 text-gray-600"}`}>
                                            {product.status}
                                        </span>
                                        <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-base font-bold text-orange-500">৳{Number(product.price).toLocaleString()}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Link
                                        href={`/dashboard/seller/my-products/edit/${product._id}`}
                                        className="w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition"
                                    >
                                        <Pencil size={14} className="text-blue-500" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deleting === product._id}
                                        className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                                    >
                                        {deleting === product._id
                                            ? <Loader2 size={14} className="animate-spin text-red-400" />
                                            : <Trash2 size={14} className="text-red-500" />
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