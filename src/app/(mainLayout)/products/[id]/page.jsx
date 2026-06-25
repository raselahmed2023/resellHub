"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Loader2, ShoppingCart, Heart, Share2,
  Package, ChevronLeft, Shield, CheckCircle2,
  Tag, Layers, Box, Calendar, Phone, Mail
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

const CONDITION_COLOR = {
  "Used": "bg-amber-50 text-amber-700 border-amber-200",
  "Like New": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Refurbished": "bg-blue-50 text-blue-700 border-blue-200",
};

const CONDITION_DOT = {
  "Used": "bg-amber-400",
  "Like New": "bg-emerald-400",
  "Refurbished": "bg-blue-400",
};

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      try {
        const res = await axiosSecure.get("/api/wishlist");
        const exists = res.data.some((item) => item.productId === id);
        setWishlist(exists);
      } catch {
      }
    };

    if (id) {
      fetchProduct();
      checkWishlist();
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <Package size={48} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-semibold">Product not found.</p>
      </div>
    </div>
  );

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (wishlist) {
        await axiosSecure.delete(`/api/wishlist/${id}`);
        setWishlist(false);
      } else {
        await axiosSecure.post("/api/wishlist", { productId: id });
        setWishlist(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const initials = product.sellerInfo?.name
    ?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "S";

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${wishlist
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
                }`}
            >
              {wishlistLoading
                ? <Loader2 size={15} className="animate-spin" />
                : <Heart size={15} fill={wishlist ? "currentColor" : "none"} />
              }
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 text-gray-400 flex items-center justify-center hover:text-gray-600 transition">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT — Images */}
          <div className="lg:w-[240px] flex-shrink-0 flex flex-col gap-3">

            {/* Main image */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square relative">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className=" min-w-1 "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-gray-300" />
                </div>
              )}
              {/* Condition badge on image */}
              <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${CONDITION_DOT[product.condition] || "bg-gray-400"}`} />
                {product.condition}
              </span>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i
                      ? "border-emerald-500 scale-105"
                      : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Title + price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{product.category}</p>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.title}</h1>

              <div className="mt-4 flex items-end gap-3">
                <p className="text-3xl font-bold text-orange-500">
                  ৳{Number(product.price).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  {product.stock > 0
                    ? <span className="text-emerald-600 font-semibold">{product.stock} in stock</span>
                    : <span className="text-red-500 font-semibold">Out of stock</span>
                  }
                </p>
              </div>

              {/* Buy button */}
              <Link
                href={`/checkout?productId=${product._id}`}
                className="mt-5 w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart size={17} /> Buy Now
              </Link>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details grid */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Tag, label: "Category", value: product.category },
                  { icon: Layers, label: "Condition", value: product.condition },
                  { icon: Box, label: "Stock", value: `${product.stock} units` },
                  { icon: Shield, label: "Status", value: product.status },
                  { icon: Calendar, label: "Listed", value: new Date(product.createdAt).toLocaleDateString("en-BD") },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 flex items-start gap-2.5">
                    <Icon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-700 capitalize mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}