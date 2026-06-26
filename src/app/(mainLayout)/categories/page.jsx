"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone, Monitor, Sofa, Car,
  Shirt, BookOpen, Dumbbell, Package,
  Loader2, ArrowRight
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { motion } from "framer-motion";

const CATEGORY_META = {
  "Electronics":   { icon: Monitor,    color: "bg-blue-50 text-blue-600",     activeBg: "bg-blue-500",    border: "border-blue-200" },
  "Mobile Phones": { icon: Smartphone, color: "bg-emerald-50 text-emerald-600", activeBg: "bg-emerald-500", border: "border-emerald-200" },
  "Furniture":     { icon: Sofa,       color: "bg-amber-50 text-amber-600",   activeBg: "bg-amber-500",   border: "border-amber-200" },
  "Vehicles":      { icon: Car,        color: "bg-red-50 text-red-600",       activeBg: "bg-red-500",     border: "border-red-200" },
  "Fashion":       { icon: Shirt,      color: "bg-pink-50 text-pink-600",     activeBg: "bg-pink-500",    border: "border-pink-200" },
  "Books":         { icon: BookOpen,   color: "bg-purple-50 text-purple-600", activeBg: "bg-purple-500",  border: "border-purple-200" },
  "Sports":        { icon: Dumbbell,   color: "bg-orange-50 text-orange-600", activeBg: "bg-orange-500",  border: "border-orange-200" },
  "Other":         { icon: Package,    color: "bg-gray-50 text-gray-600",     activeBg: "bg-gray-500",    border: "border-gray-200" },
};

const CONDITION_COLOR = {
  "Used": "bg-white text-amber-700",
  "Like New": "bg-white text-amber-700",
  "Refurbished": "bg-white text-amber-700",
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
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {categories.map(({ _id: name, count }, index) => {
              const meta = CATEGORY_META[name] || CATEGORY_META["Other"];
              const Icon = meta.icon;
              const isSelected = selectedCategory === name;

              return (
                <motion.button
                  key={name}
                  onClick={() => handleCategoryClick(name)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-colors duration-200 ${
                    isSelected
                      ? `${meta.border} ${meta.color.split(" ")[0]} shadow-md`
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${isSelected ? meta.activeBg + " text-white" : meta.color} flex items-center justify-center transition-colors duration-200`}>
                    <Icon size={22} />
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-bold ${isSelected ? "text-gray-900" : "text-gray-700"}`}>{name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{count} items</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Selected Category Products */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-4">
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
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Link
                      href={`/products/${product._id}`}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image — same style as FeaturedProducts */}
                      <div
                        className="m-3 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative"
                        style={{ paddingBottom: "calc(75% - 24px)" }}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package size={24} className="text-gray-300" />
                          </div>
                        )}
                        {product.condition && (
                          <span className={`absolute top-2 left-2 p-4 text-[10px] px-2 py-0.5 rounded font-semibold ${CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600"}`}>
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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}