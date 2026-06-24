"use client";

import { useEffect, useState } from "react";
import {
    Loader2, Search, SlidersHorizontal, Package,
    ChevronLeft, ChevronRight, Leaf, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import axiosSecure from "@/lib/axiosSecure";

const CATEGORIES = [
    "All", "Electronics", "Furniture", "Vehicles",
    "Fashion", "Mobile Phones", "Books", "Sports", "Other",
];

const CONDITIONS = ["Refurbished", "Like New", "Used"];

const CONDITION_COLOR = {
    "Used": "bg-white text-amber-700",
    "Like New": "bg-white text-amber-700",
    "Refurbished": "bg-white text-amber-700",
};

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [conditions, setConditions] = useState([]);
    const [ecoOnly, setEcoOnly] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (category) params.append("category", category);
            if (sort) params.append("sort", sort);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            if (conditions.length) params.append("condition", conditions.join(","));
            if (ecoOnly) params.append("ecoVerified", "true");
            params.append("page", page);
            params.append("limit", 12);

            const res = await axiosSecure.get(`/api/products?${params.toString()}`);
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [search, category, sort, page, conditions, ecoOnly]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handlePriceFilter = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const toggleCondition = (cond) => {
        setConditions((prev) =>
            prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
        );
        setPage(1);
    };

    const resetFilters = () => {
        setMinPrice(""); setMaxPrice("");
        setConditions([]); setEcoOnly(false);
        setPage(1);
    };

    const pagesToShow = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-3 flex-wrap items-center">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[180px] relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="What are you looking for today?"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full h-9 bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                    </form>
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value === "All" ? "" : e.target.value); setPage(1); }}
                        className="h-9 bg-slate-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        {CATEGORIES.map((c) => <option key={c} value={c === "All" ? "" : c}>{c}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-gray-400" />
                        <select
                            value={sort}
                            onChange={(e) => { setSort(e.target.value); setPage(1); }}
                            className="h-9 bg-slate-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex gap-6 py-6 flex-1">

                {/* Sidebar */}
                <aside className="w-48 flex-shrink-0 hidden md:block">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Filters</p>
                            <button onClick={resetFilters} className="text-xs text-emerald-600 font-semibold hover:underline">Reset</button>
                        </div>

                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Price Range</p>
                        <form onSubmit={handlePriceFilter} className="flex gap-2 mb-4">
                            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full h-8 bg-slate-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-emerald-400" />
                            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full h-8 bg-slate-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-emerald-400" />
                        </form>

                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Condition</p>
                        <div className="flex flex-col gap-1.5 mb-4">
                            {CONDITIONS.map((cond) => (
                                <label key={cond} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={conditions.includes(cond)} onChange={() => toggleCondition(cond)} className="accent-emerald-500" />
                                    <span className="text-xs text-gray-600">{cond}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={() => { setEcoOnly(!ecoOnly); setPage(1); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${ecoOnly ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-slate-50 border-gray-200 text-gray-500 hover:border-emerald-300"}`}
                        >
                            <Leaf size={13} className="text-emerald-500" />
                            Eco-Verified Only
                        </button>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1 min-w-0">
                    {!loading && (
                        <p className="text-xs text-gray-400 mb-4">
                            Showing <span className="font-semibold text-gray-600">{products.length}</span> of{" "}
                            <span className="font-semibold text-gray-600">{total}</span> products
                        </p>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 size={30} className="animate-spin text-emerald-500" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <Package size={44} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-semibold">No products found.</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search or filter.</p>
                        </div>
                    ) : (
                        <div className="grid p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                            {products.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/products/${product._id}`}
                                    className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Image box — HeroUI card figure style */}
                                    <div className="m-3 p-4 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative" style={{ paddingBottom: "calc(75% - 24px)" }}>
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className=" absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Package size={28} className="text-gray-300" />
                                            </div>
                                        )}

                                        {/* Badge  image */}
                                        {product.condition && (
                                            <span className={`absolute top-2 left-2 text-[2px] px-2 py-1 rounded-full ${CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600"}`}>
                                                {product.condition}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-3 pb-3 flex flex-col flex-1">
                                        <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                                            {product.category}
                                        </p>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                                            {product.title}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            by {product.sellerInfo?.name || "Unknown"}
                                        </p>

                                        <div className="mt-auto pt-3">
                                            <p className="text-sm font-bold text-orange-500 mb-2">
                                                ৳{Number(product.price).toLocaleString()}
                                            </p>
                                            <span className="block text-center text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-xl py-1.5 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2" style={{ margin: "40px 0" }}>
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition">
                                <ChevronLeft size={14} className="text-gray-600" />
                            </button>

                            {pagesToShow().map((p, i) =>
                                p === "..." ? (
                                    <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
                                ) : (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded-xl text-sm font-semibold transition-all ${page === p ? "bg-emerald-500 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                        {p}
                                    </button>
                                )
                            )}

                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition">
                                <ChevronRight size={14} className="text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}