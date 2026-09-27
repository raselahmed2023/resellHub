"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  Loader2,
  Search,
  SlidersHorizontal,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";
import axiosSecure from "@/lib/axiosSecure";
import { motion } from "framer-motion";

const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Vehicles",
  "Fashion",
  "Mobile Phones",
  "Books",
  "Sports",
  "Other",
];

const CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Used",
  "Refurbished",
];

const CONDITION_COLOR = {
  New: "bg-white text-emerald-700",
  "Like New": "bg-white text-emerald-700",
  Good: "bg-white text-blue-700",
  Fair: "bg-white text-orange-700",
  Used: "bg-white text-amber-700",
  Refurbished: "bg-white text-purple-700",
};

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlSort = searchParams.get("sort") || "";

    const validCategory = CATEGORIES.includes(urlCategory)
      ? urlCategory
      : "";

    setCategory(validCategory === "All" ? "" : validCategory);
    setSearch(urlSearch);
    setSearchInput(urlSearch);
    setSort(urlSort);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search) {
          params.append("search", search);
        }

        if (category) {
          params.append("category", category);
        }

        if (sort) {
          params.append("sort", sort);
        }

        if (appliedMinPrice) {
          params.append("minPrice", appliedMinPrice);
        }

        if (appliedMaxPrice) {
          params.append("maxPrice", appliedMaxPrice);
        }

        if (conditions.length) {
          params.append(
            "condition",
            conditions.join(",")
          );
        }

        params.append("page", String(page));
        params.append("limit", "12");

        const res = await axiosSecure.get(
          `/api/products?${params.toString()}`
        );

        if (cancelled) return;

        const data = res.data || {};

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );

        setTotalPages(
          Math.max(1, Number(data.totalPages) || 1)
        );

        setTotal(
          Math.max(0, Number(data.total) || 0)
        );
      } catch (err) {
        console.error("Products error:", err);

        if (cancelled) return;

        setProducts([]);
        setTotal(0);
        setTotalPages(1);

        setError(
          err?.response?.data?.message ||
            "Could not load products. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    category,
    sort,
    page,
    conditions,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();

    const min =
      minPrice === ""
        ? ""
        : Number(minPrice);

    const max =
      maxPrice === ""
        ? ""
        : Number(maxPrice);

    if (
      min !== "" &&
      (!Number.isFinite(min) || min < 0)
    ) {
      setError("Minimum price must be 0 or greater.");
      return;
    }

    if (
      max !== "" &&
      (!Number.isFinite(max) || max < 0)
    ) {
      setError("Maximum price must be 0 or greater.");
      return;
    }

    if (
      min !== "" &&
      max !== "" &&
      min > max
    ) {
      setError(
        "Minimum price cannot be greater than maximum price."
      );
      return;
    }

    setError("");
    setPage(1);

    setAppliedMinPrice(
      min === "" ? "" : String(min)
    );

    setAppliedMaxPrice(
      max === "" ? "" : String(max)
    );
  };

  const toggleCondition = (cond) => {
    setConditions((prev) =>
      prev.includes(cond)
        ? prev.filter((item) => item !== cond)
        : [...prev, cond]
    );

    setPage(1);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setConditions([]);
    setPage(1);
    setError("");
  };

  const pagesToShow = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-3 flex-wrap items-center">
          <form
            onSubmit={handleSearch}
            className="flex-1 min-w-[180px] relative"
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="What are you looking for today?"
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              className="w-full h-9 bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </form>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-9 bg-slate-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {CATEGORIES.map((item) => (
              <option
                key={item}
                value={item === "All" ? "" : item}
              >
                {item}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={14}
              className="text-gray-400"
            />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-slate-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">
                Newest First
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex gap-6 py-6 flex-1">
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Filters
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Price Range
            </p>

            <form
              onSubmit={handlePriceFilter}
              className="mb-4"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value)
                  }
                  className="w-full min-w-0 h-8 bg-slate-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-emerald-400"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value)
                  }
                  className="w-full min-w-0 h-8 bg-slate-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full h-8 mt-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition"
              >
                Apply
              </button>
            </form>

            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Condition
            </p>

            <div className="flex flex-col gap-1.5 mb-2">
              {CONDITIONS.map((cond) => (
                <label
                  key={cond}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={conditions.includes(cond)}
                    onChange={() =>
                      toggleCondition(cond)
                    }
                    className="accent-emerald-500"
                  />

                  <span className="text-xs text-gray-600">
                    {cond}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {!loading && (
            <p className="text-xs text-gray-400 mb-4">
              Showing{" "}
              <span className="font-semibold text-gray-600">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">
                {total}
              </span>{" "}
              products
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2
                size={30}
                className="animate-spin text-emerald-500"
              />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Package
                size={44}
                className="text-gray-300 mb-3"
              />

              <p className="text-gray-500 font-semibold">
                No products found.
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Try a different search or filter.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
              }}
              className="grid p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start"
            >
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="m-3 p-4 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative"
                    style={{
                      paddingBottom:
                        "calc(75% - 24px)",
                    }}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={
                          product.images[0]
                        }
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package
                          size={28}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                    {product.condition && (
                      <span
                        className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-1 rounded-full ${
                          CONDITION_COLOR[
                            product.condition
                          ] ||
                          "bg-white text-gray-600"
                        }`}
                      >
                        {product.condition}
                      </span>
                    )}
                  </div>

                  <div className="px-3 pb-3 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                      {product.category}
                    </p>

                    <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                      {product.title}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                      by{" "}
                      {product.sellerInfo?.name ||
                        "Unknown"}
                    </p>

                    <div className="mt-auto pt-3">
                      <p className="text-sm font-bold text-orange-500 mb-2">
                        ৳
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </p>

                      <span className="block text-center text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-xl py-1.5 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && !loading && (
            <div
              className="flex items-center justify-center gap-2"
              style={{
                margin: "40px 0",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                  )
                }
                disabled={page === 1}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft
                  size={14}
                  className="text-gray-600"
                />
              </button>

              {pagesToShow().map(
                (item, index) =>
                  item === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      onClick={() =>
                        setPage(item)
                      }
                      className={`w-8 h-8 rounded-xl text-sm font-semibold transition-all ${
                        page === item
                          ? "bg-emerald-500 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  )
              )}

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                disabled={
                  page === totalPages
                }
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronRight
                  size={14}
                  className="text-gray-600"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AllProducts() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-emerald-500"
          />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}