"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Smartphone, Monitor, Sofa, Car, Shirt, BookOpen, Dumbbell, Package, Loader2 } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const CATEGORY_META = {
  "Electronics":   { icon: Monitor,     color: "bg-blue-50 text-blue-600",    border: "border-blue-100",   hover: "hover:bg-blue-100" },
  "Mobile Phones": { icon: Smartphone,  color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", hover: "hover:bg-emerald-100" },
  "Furniture":     { icon: Sofa,        color: "bg-amber-50 text-amber-600",  border: "border-amber-100",  hover: "hover:bg-amber-100" },
  "Vehicles":      { icon: Car,         color: "bg-red-50 text-red-600",      border: "border-red-100",    hover: "hover:bg-red-100" },
  "Fashion":       { icon: Shirt,       color: "bg-pink-50 text-pink-600",    border: "border-pink-100",   hover: "hover:bg-pink-100" },
  "Books":         { icon: BookOpen,    color: "bg-purple-50 text-purple-600", border: "border-purple-100", hover: "hover:bg-purple-100" },
  "Sports":        { icon: Dumbbell,    color: "bg-orange-50 text-orange-600", border: "border-orange-100", hover: "hover:bg-orange-100" },
  "Other":         { icon: Package,     color: "bg-gray-50 text-gray-600",    border: "border-gray-100",   hover: "hover:bg-gray-100" },
};

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosSecure.get("/api/categories/stats");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Browse by category</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Categories</h2>
          <p className="text-sm text-gray-500 mt-2">Find exactly what you're looking for</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(({ _id: name, count }) => {
              const meta = CATEGORY_META[name] || CATEGORY_META["Other"];
              const Icon = meta.icon;
              return (
                <Link
                  key={name}
                  href={`/products?category=${encodeURIComponent(name)}`}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${meta.border} ${meta.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-md group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${meta.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">{name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{count}+ items</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}