"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, Package, Trash2, ShoppingCart } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

const CONDITION_COLOR = {
  "Used": "bg-amber-100 text-amber-700",
  "Like New": "bg-emerald-100 text-emerald-700",
  "Refurbished": "bg-blue-100 text-blue-700",
};

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/wishlist");
      // product details নিয়ে আসো
      const withProducts = await Promise.all(
        res.data.map(async (item) => {
          try {
            const p = await axiosSecure.get(`/api/products/${item.productId}`);
            return { ...item, product: p.data };
          } catch {
            return { ...item, product: null };
          }
        })
      );
      setItems(withProducts.filter((i) => i.product));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await axiosSecure.delete(`/api/wishlist/${productId}`);
      setItems((p) => p.filter((i) => i.productId !== productId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Heart size={20} color="black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Wishlist</h1>
            <p className="text-xs text-gray-500">
              {loading ? "Loading..." : `${items.length} saved item${items.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">Your wishlist is empty.</p>
            <p className="text-xs text-gray-400 mt-1">Save items you love to buy later.</p>
            <Link
              href="/products"
              className="mt-4 p-4 px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(({ productId, product }) => (
              <div key={productId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-gray-300" />
                    </div>
                  )}
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(productId)}
                    disabled={removing === productId}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
                  >
                    {removing === productId
                      ? <Loader2 size={14} className="animate-spin text-red-400" />
                      : <Trash2 size={14} className="text-red-400" />
                    }
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{product.category}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{product.title}</p>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base font-bold text-orange-500">
                      ৳{Number(product.price).toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600"}`}>
                      {product.condition}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1">by {product.sellerInfo?.name || "Unknown"}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/products/${productId}`}
                      className="flex-1 h-9 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/checkout?productId=${productId}`}
                      className="flex-1 h-9 rounded-xl bg-emerald-500 text-black text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition"
                    >
                      <ShoppingCart size={13} /> Buy Now
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}