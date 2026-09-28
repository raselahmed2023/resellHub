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
  Package,
  User,
  Phone,
  MapPin,
  Layers3,
  Boxes,
  CalendarDays,
  ShieldCheck,
  Tag,
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const getCurrentUser = async () => {
    try {
      const res = await axiosSecure.get("/api/auth/get-session");
      const currentUser = res.data?.user || null;
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get(`/api/products/${id}`);

        setProduct(res.data);
        setSelectedImage(res.data?.images?.[0] || "");

        await getCurrentUser();
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPage();
    }
  }, [id]);

  const showNotice = (text, type = "success") => {
    setNotice({
      text,
      type,
    });

    window.setTimeout(() => {
      setNotice(null);
    }, 3000);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const stock = Math.max(
      Number(product.stock || 0),
      0
    );

    if (
      stock <= 0 ||
      product.status !== "available"
    ) {
      return;
    }

    const checkoutPath = `/checkout?productId=${product._id}`;

    let currentUser = user;

    if (!currentUser) {
      currentUser = await getCurrentUser();
    }

    if (!currentUser) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(checkoutPath)}`
      );
      return;
    }

    const isOwnProduct =
      product.sellerInfo?.userId === currentUser.id ||
      product.sellerInfo?.email === currentUser.email;

    if (isOwnProduct) {
      showNotice(
        "You cannot purchase your own product.",
        "error"
      );
      return;
    }

    if (
      currentUser.role &&
      currentUser.role !== "buyer"
    ) {
      showNotice(
        "Only buyer accounts can purchase products.",
        "error"
      );
      return;
    }

    router.push(checkoutPath);
  };

  const handleWishlist = async () => {
    if (!product) return;

    let currentUser = user;

    if (!currentUser) {
      currentUser = await getCurrentUser();
    }

    if (!currentUser) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(
          `/products/${product._id}`
        )}`
      );
      return;
    }

    if (
      currentUser.role &&
      currentUser.role !== "buyer"
    ) {
      showNotice(
        "Only buyer accounts can use the wishlist.",
        "error"
      );
      return;
    }

    try {
      setWishlistLoading(true);

      const res = await axiosSecure.post("/api/wishlist", {
        productId: product._id,
      });

      if (
        res.data?.message ===
        "Already in wishlist"
      ) {
        showNotice("Already in your wishlist.");
      } else {
        showNotice("Added to wishlist.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        router.push(
          `/login?callbackURL=${encodeURIComponent(
            `/products/${product._id}`
          )}`
        );
        return;
      }

      showNotice(
        error.response?.data?.message ||
          "Could not update wishlist.",
        "error"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title || "ReSellHub Product",
          text: product?.title
            ? `Check out ${product.title} on ReSellHub`
            : "Check out this product on ReSellHub",
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      showNotice("Product link copied.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        showNotice(
          "Could not share this product.",
          "error"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f7f9fb] flex items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-emerald-500"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#f7f9fb] flex items-center justify-center px-4">
        <div className="text-center">
          <Package
            size={42}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This listing may no longer be available.
          </p>

          <Link
            href="/products"
            className="inline-flex mt-5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stock = Math.max(
    Number(product.stock || 0),
    0
  );

  const isOutOfStock =
    stock <= 0 ||
    product.status !== "available";

  const images =
    Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label="Wishlist"
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition disabled:opacity-50"
            >
              {wishlistLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Heart size={18} />
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share"
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        {notice && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
              notice.type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-[26px] overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="p-5 sm:p-7 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="relative aspect-square max-h-[520px] bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-contain p-6 sm:p-8"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <Package size={52} />
                    <span className="mt-3 text-sm">
                      No image available
                    </span>
                  </div>
                )}

                <span
                  className={`absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border shadow-sm ${
                    isOutOfStock
                      ? "border-red-200 text-red-600"
                      : "border-emerald-200 text-emerald-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOutOfStock
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  {isOutOfStock
                    ? "Out of Stock"
                    : product.condition || "Available"}
                </span>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 bg-slate-50 overflow-hidden transition ${
                        selectedImage === image
                          ? "border-emerald-500"
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.12em]">
                  {product.category || "Other"}
                </span>

                {product.condition && (
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {product.condition}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] font-bold tracking-tight text-slate-950">
                {product.title}
              </h1>

              <p className="mt-5 text-4xl font-bold tracking-tight text-orange-500">
                ৳
                {Number(
                  product.price || 0
                ).toLocaleString("en-US")}
              </p>

              <div className="mt-8 pt-7 border-t border-slate-200">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="text-sm font-bold text-slate-900">
                    Product Details
                  </h2>

                  <span className="text-xs text-slate-400">
                    Listing information
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-0">
                  <DetailRow
                    icon={Layers3}
                    label="Condition"
                    value={product.condition || "N/A"}
                  />

                  <DetailRow
                    icon={ShieldCheck}
                    label="Status"
                    value={
                      isOutOfStock
                        ? "Unavailable"
                        : "Available"
                    }
                  />

                  <DetailRow
                    icon={Boxes}
                    label="Stock"
                    value={`${stock} ${
                      stock === 1 ? "Unit" : "Units"
                    }`}
                  />

                  <DetailRow
                    icon={CalendarDays}
                    label="Listed"
                    value={
                      product.createdAt
                        ? new Date(
                            product.createdAt
                          ).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"
                    }
                  />

                  <DetailRow
                    icon={Tag}
                    label="Category"
                    value={product.category || "N/A"}
                  />

                  <DetailRow
                    icon={Package}
                    label="Availability"
                    value={
                      isOutOfStock
                        ? "Out of Stock"
                        : "In Stock"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 md:mr-1">
                Seller
              </span>

              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User
                  size={16}
                  className="text-emerald-600"
                />
                <span>
                  {product.sellerInfo?.name ||
                    "Seller"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin
                  size={16}
                  className="text-slate-400"
                />
                <span>
                  {product.sellerInfo?.location ||
                    product.location ||
                    "Location not provided"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone
                  size={16}
                  className="text-slate-400"
                />
                <span>
                  {product.sellerInfo?.phone ||
                    "Phone not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
            <div className="max-w-none">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Description
              </p>

              <p className="mt-4 text-[15px] sm:text-base leading-7 text-slate-600 whitespace-pre-line">
                {product.description ||
                  "No description provided for this product."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`mt-8 w-full h-14 sm:h-16 rounded-xl flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold transition ${
                isOutOfStock
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md"
              }`}
            >
              <ShoppingCart size={20} />

              {isOutOfStock
                ? "Out of Stock"
                : "Buy Now"}
            </button>

            {!isOutOfStock && (
              <p className="mt-3 text-center text-xs text-slate-400">
                Secure checkout powered by Stripe
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon
          size={16}
          className="text-slate-400 flex-shrink-0"
        />

        <span className="text-sm text-slate-500">
          {label}
        </span>
      </div>

      <span className="text-sm font-semibold text-slate-900 text-right">
        {value}
      </span>
    </div>
  );
}