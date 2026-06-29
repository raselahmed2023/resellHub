"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Loader2,
  Tag,
  Layers,
  Package,
  Shield,
  Calendar,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 size={34} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-black text-gray-900">
            Product not found
          </h1>
          <Link
            href="/products"
            className="inline-flex mt-4 text-sm font-bold text-emerald-600"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stock = Math.max(Number(product?.stock || 0), 0);

  const isOutOfStock =
    stock <= 0 || product?.status !== "available";

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    router.push(`/checkout?productId=${product._id}`);
  };

  const handleWishlist = async () => {
    try {
      setWishlistLoading(true);
      setMessage("");

      await axiosSecure.post("/api/wishlist", {
        productId: product._id,
      });

      setMessage("Added to wishlist.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Product link copied.");
    } catch (err) {
      setMessage("Could not copy link.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="w-11 h-11 rounded-2xl border border-red-100 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-60"
            >
              {wishlistLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Heart size={18} fill="currentColor" />
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-2xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div className="mb-5 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-600">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Image */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden h-fit">
            <div className="relative h-64 bg-slate-50">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={42} className="text-gray-300" />
                </div>
              )}

              <span
                className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${
                  isOutOfStock
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                {isOutOfStock ? "Out of Stock" : product.condition || "Available"}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">
                {product.category}
              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-end gap-3 mt-5">
                <p className="text-4xl font-black text-orange-500">
                  ৳{Number(product.price || 0).toLocaleString()}
                </p>

                {isOutOfStock && (
                  <span className="text-sm font-bold text-red-500 mb-1">
                    Out of stock
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`mt-6 w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                }`}
              >
                <ShoppingCart size={19} />
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-7">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">
                Details
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={Tag}
                  label="Category"
                  value={product.category || "N/A"}
                />
                <InfoCard
                  icon={Layers}
                  label="Condition"
                  value={product.condition || "N/A"}
                />
                <InfoCard
                  icon={Package}
                  label="Stock"
                  value={`${stock} Units`}
                />
                <InfoCard
                  icon={Shield}
                  label="Status"
                  value={isOutOfStock ? "Out of Stock" : "Available"}
                />
                <InfoCard
                  icon={Calendar}
                  label="Listed"
                  value={
                    product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString("en-BD")
                      : "N/A"
                  }
                />
              </div>
            </div>

            {/* Seller */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">
                Seller Information
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={User}
                  label="Seller"
                  value={product.sellerInfo?.name || "Unknown"}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={product.sellerInfo?.phone || "N/A"}
                />
                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={product.location || product.sellerInfo?.location || "N/A"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-gray-400 mt-1" />
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-black text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}