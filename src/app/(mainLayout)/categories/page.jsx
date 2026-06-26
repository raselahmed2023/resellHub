"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone, Monitor, Sofa, Car,
  Shirt, BookOpen, Dumbbell, Package,
  Loader2, ArrowRight
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const CATEGORY_META = {
  "Electronics":   { icon: Monitor,    color: "bg-blue-50 text-blue-600",     border: "border-blue-100",   hover: "hover:bg-blue-100",   badge: "bg-blue-500" },
  "Mobile Phones": { icon: Smartphone, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", hover: "hover:bg-emerald-100", badge: "bg-emerald-500" },
  "Furniture":     { icon: Sofa,       color: "bg-amber-50 text-amber-600",   border: "border-amber-100",  hover: "hover:bg-amber-100",  badge: "bg-amber-500" },
  "Vehicles":      { icon: Car,        color: "bg-red-50 text-red-600",       border: "border-red-100",    hover: "hover:bg-red-100",    badge: "bg-red-500" },
  "Fashion":       { icon: Shirt,      color: "bg-pink-50 text-pink-600",     border: "border-pink-100",   hover: "hover:bg-pink-100",   badge: "bg-pink-500" },
  "Books":         { icon: BookOpen,   color: "bg-purple-50 text-purple-600", border: "border-purple-100", hover: "hover:bg-purple-100", badge: "bg-purple-500" },
  "Sports":        { icon: Dumbbell,   color: "bg-orange-50 text-orange-600", border: "border-orange-100", hover: "hover:bg-orange-100", badge: "bg-orange-500" },
  "Other":         { icon: Package,    color: "bg-gray-50 text-gray-600",     border: "border-gray-100",   hover: "hover:bg-gray-100",   badge: "bg-gray-500" },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    axiosSecure.get("/api/categories/stats")
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setProductsLoading(true);
    try {
      const res = await axiosSecure.get(`/api/products?category=${encodeURIComponent(categoryName)}&limit=6`);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
          <p className="text-sm text-gray-500 mt-2">Explore products by category</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {categories.map(({ _id: name, count }) => {
              const meta = CATEGORY_META[name] || CATEGORY_META["Other"];
              const Icon = meta.icon;
              const isSelected = selectedCategory === name;

              return (
                <button
                  key={name}
                  onClick={() => handleCategoryClick(name)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group text-left ${
                    isSelected
                      ? `${meta.border} border-2 shadow-md -translate-y-1 ${meta.color.split(" ")[0]}`
                      : `border-gray-100 bg-white hover:${meta.color.split(" ")[0]}`
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${meta.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{count} items</p>
                  </div>
                  {isSelected && (
                    <span className={`text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full ${meta.badge}`}>
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Category Products */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedCategory}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest products in this category</p>
              </div>
              <Link
                href={`/products?category=${encodeURIComponent(selectedCategory)}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={24} className="animate-spin text-emerald-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl border border-gray-200">
                <Package size={36} className="text-gray-300 mb-2" />
                <p className="text-gray-500 font-semibold">No products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100 relative">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-800 truncate">{product.title}</p>
                      <p className="text-sm font-bold text-orange-500 mt-1">
                        ৳{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}