"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Car,
  Dumbbell,
  Loader2,
  Monitor,
  Package,
  Shirt,
  Smartphone,
  Sofa,
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const CATEGORY_META = {
  "Mobile Phones": {
    icon: Smartphone,
    description: "Phones, smartphones and mobile devices",
  },
  Electronics: {
    icon: Monitor,
    description: "Computers, gadgets and electronics",
  },
  Fashion: {
    icon: Shirt,
    description: "Clothing, accessories and fashion",
  },
  Vehicles: {
    icon: Car,
    description: "Cars, bikes and vehicle listings",
  },
  Books: {
    icon: BookOpen,
    description: "Books, study materials and learning",
  },
  Sports: {
    icon: Dumbbell,
    description: "Sports, fitness and outdoor items",
  },
  Furniture: {
    icon: Sofa,
    description: "Furniture for home and workspace",
  },
  Other: {
    icon: Package,
    description: "More pre-owned marketplace products",
  },
};

const CATEGORY_ORDER = [
  "Mobile Phones",
  "Electronics",
  "Fashion",
  "Vehicles",
  "Books",
  "Sports",
  "Furniture",
  "Other",
];

export default function CategoriesPage() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const map = new Map();

    categoryStats.forEach((item) => {
      map.set(item._id, Number(item.count || 0));
    });

    return map;
  }, [categoryStats]);

  const totalProducts = useMemo(() => {
    return categoryStats.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );
  }, [categoryStats]);

  const fetchProducts = async (category = "All") => {
    try {
      setProductsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (category !== "All") {
        params.set("category", category);
      }

      params.set("limit", "12");
      params.set("page", "1");

      const res = await axiosSecure.get(
        `/api/products?${params.toString()}`
      );

      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setError(
        err.response?.data?.message ||
          "Products could not be loaded."
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setStatsLoading(true);

        const res = await axiosSecure.get(
          "/api/categories/stats"
        );

        setCategoryStats(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setStatsLoading(false);
      }

      await fetchProducts("All");
    };

    loadPage();
  }, []);

  const handleCategoryChange = async (category) => {
    if (category === selectedCategory) return;

    setSelectedCategory(category);
    await fetchProducts(category);
  };

  const selectedMeta =
    selectedCategory === "All"
      ? {
          title: "All Products",
          description:
            "Explore available pre-owned products across every category.",
        }
      : {
          title: selectedCategory,
          description:
            CATEGORY_META[selectedCategory]?.description ||
            `Browse available ${selectedCategory.toLowerCase()} products.`,
        };

  const selectedCount =
    selectedCategory === "All"
      ? totalProducts
      : counts.get(selectedCategory) || 0;

  const viewAllHref =
    selectedCategory === "All"
      ? "/products"
      : `/products?category=${encodeURIComponent(
          selectedCategory
        )}`;

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
            Browse Marketplace
          </p>

          <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Shop by Category
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Choose a category and explore available products.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Browse all products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-7 lg:py-10">
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <MobileTab
              label="All Products"
              count={totalProducts}
              active={selectedCategory === "All"}
              onClick={() => handleCategoryChange("All")}
            />

            {CATEGORY_ORDER.map((category) => (
              <MobileTab
                key={category}
                label={category}
                count={counts.get(category) || 0}
                active={selectedCategory === category}
                onClick={() =>
                  handleCategoryChange(category)
                }
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-7 lg:gap-9">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4 px-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Categories
                </p>

                {!statsLoading && (
                  <span className="text-xs text-slate-400">
                    {totalProducts} total
                  </span>
                )}
              </div>

              <nav className="space-y-1">
                <CategoryTab
                  label="All Products"
                  count={totalProducts}
                  icon={Package}
                  active={selectedCategory === "All"}
                  onClick={() => handleCategoryChange("All")}
                />

                {statsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2
                      size={20}
                      className="animate-spin text-emerald-500"
                    />
                  </div>
                ) : (
                  CATEGORY_ORDER.map((category) => {
                    const Icon =
                      CATEGORY_META[category]?.icon ||
                      Package;

                    return (
                      <CategoryTab
                        key={category}
                        label={category}
                        count={counts.get(category) || 0}
                        icon={Icon}
                        active={
                          selectedCategory === category
                        }
                        onClick={() =>
                          handleCategoryChange(category)
                        }
                      />
                    );
                  })
                )}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.12em]">
                  Selected Category
                </p>

                <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                  {selectedMeta.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedMeta.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  <strong className="text-slate-900 font-semibold">
                    {selectedCount}
                  </strong>{" "}
                  {selectedCount === 1
                    ? "product"
                    : "products"}
                </span>

                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {productsLoading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="min-h-[360px] flex flex-col items-center justify-center text-center border-t border-slate-200">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Package
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No products available
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are no available products in this category right now.
                </p>

                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryChange("All")
                    }
                    className="mt-5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Show all products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryTab({
  label,
  count,
  icon: Icon,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-600 hover:bg-white hover:text-slate-950"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-emerald-500" />
      )}

      <Icon
        size={18}
        className={
          active
            ? "text-emerald-600"
            : "text-slate-400"
        }
      />

      <span className="flex-1 text-sm font-semibold">
        {label}
      </span>

      <span
        className={`text-xs ${
          active
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function MobileTab({
  label,
  count,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 px-4 rounded-full border text-sm font-semibold whitespace-nowrap transition ${
        active
          ? "bg-emerald-500 border-emerald-500 text-white"
          : "bg-white border-slate-200 text-slate-600"
      }`}
    >
      {label}
      <span
        className={`ml-2 text-xs ${
          active
            ? "text-emerald-100"
            : "text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain p-5 group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package
              size={36}
              className="text-slate-300"
            />
          </div>
        )}

        {product.condition && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-sm">
            {product.condition}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-600">
          {product.category}
        </p>

        <h3 className="mt-1.5 text-base font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
          {product.title}
        </h3>

        <p className="mt-1 text-xs text-slate-400 truncate">
          Seller: {product.sellerInfo?.name || "Seller"}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-xl font-bold text-orange-500">
            ৳
            {Number(
              product.price || 0
            ).toLocaleString("en-US")}
          </p>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            Details
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-slate-100" />

          <div className="p-4">
            <div className="w-20 h-3 bg-slate-100 rounded" />
            <div className="mt-3 w-3/4 h-5 bg-slate-100 rounded" />
            <div className="mt-2 w-1/2 h-3 bg-slate-100 rounded" />

            <div className="mt-5 flex justify-between">
              <div className="w-24 h-6 bg-slate-100 rounded" />
              <div className="w-14 h-4 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}