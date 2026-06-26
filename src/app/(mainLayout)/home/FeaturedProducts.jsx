"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, ArrowRight } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { motion } from "framer-motion";

const CONDITION_COLOR = {
  "Used": "bg-white text-amber-700",
  "Like New": "bg-white text-amber-700",
  "Refurbished": "bg-white text-amber-700",
};

const CONDITION_BADGE = {
  "Like New": "bg-emerald-500",
  "Refurbished": "bg-blue-500",
  "Used": "bg-amber-500",
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosSecure.get("/api/products/featured");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Fresh listings</p>
            <p className="text-sm text-gray-500 mt-2 mb-5">Handpicked deals from verified sellers</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No products yet.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/products/${product._id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Image box — HeroUI card figure style */}
                  <div className="m-3 p-4 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative" style={{ paddingBottom: "calc(75% - 24px)" }}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={28} className="text-gray-300" />
                      </div>
                    )}

                    {/* Badge image */}
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
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile view all */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}