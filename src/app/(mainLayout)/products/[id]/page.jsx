"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Loader2,
  Package,
  User,
  MapPin,
  Layers3,
  CalendarDays,
  ShieldCheck,
  Tag,
  MessageCircleMore,
  BadgeDollarSign,
  GraduationCap,
  PackageCheck,
  Clock3,
  ChevronRight,
  Check,
} from "lucide-react";

import axiosSecure from "@/lib/axiosSecure";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [notice, setNotice] = useState(null);

  const getCurrentUser = async () => {
    try {
      const res = await axiosSecure.get(
        "/api/auth/get-session"
      );

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

        const res = await axiosSecure.get(
          `/api/products/${id}`
        );

        setProduct(res.data);

        setSelectedImage(
          res.data?.images?.[0] || ""
        );

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

  const showNotice = (
    text,
    type = "success"
  ) => {
    setNotice({
      text,
      type,
    });

    window.setTimeout(() => {
      setNotice(null);
    }, 3000);
  };

  const requireLogin = async () => {
    let currentUser = user;

    if (!currentUser) {
      currentUser = await getCurrentUser();
    }

    if (!currentUser) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(
          `/products/${product?._id}`
        )}`
      );

      return null;
    }

    return currentUser;
  };

  const isOwnListing = (currentUser) => {
    if (!currentUser || !product) {
      return false;
    }

    return (
      product.sellerInfo?.userId ===
        currentUser.id ||
      product.sellerInfo?.email ===
        currentUser.email
    );
  };

  const handleChat = async () => {
    const currentUser = await requireLogin();

    if (!currentUser) return;

    if (isOwnListing(currentUser)) {
      showNotice(
        "This is your own listing.",
        "error"
      );

      return;
    }

    showNotice(
      "Real-time Chat will be connected in the next feature."
    );
  };

  const handleOffer = async () => {
    const currentUser = await requireLogin();

    if (!currentUser) return;

    if (isOwnListing(currentUser)) {
      showNotice(
        "You cannot make an offer on your own listing.",
        "error"
      );

      return;
    }

    showNotice(
      "Offer negotiation will be connected with Real-time Chat."
    );
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
        `/login?callbackURL=${encodeURIComponent(
          checkoutPath
        )}`
      );

      return;
    }

    const ownProduct =
      product.sellerInfo?.userId ===
        currentUser.id ||
      product.sellerInfo?.email ===
        currentUser.email;

    if (ownProduct) {
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

      const res = await axiosSecure.post(
        "/api/wishlist",
        {
          productId: product._id,
        }
      );

      if (
        res.data?.message ===
        "Already in wishlist"
      ) {
        showNotice(
          "Already in your wishlist."
        );
      } else {
        showNotice("Added to wishlist.");
      }
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
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
          title:
            product?.title ||
            "ReSellHub Product",

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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8]">
        <Loader2
          size={32}
          className="animate-spin text-emerald-600"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-4">
        <div className="text-center">
          <Package
            size={44}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-4 text-xl font-black text-slate-950">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This listing may no longer be
            available.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-700"
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

  const images = Array.isArray(
    product.images
  )
    ? product.images.filter(Boolean)
    : [];

  /*
    These fields are future-ready.

    If later your product schema contains:
    campus
    university
    studentZone
    isStudentListing

    this badge will appear automatically.
  */

  const campus =
    product.campus ||
    product.university ||
    product.studentInfo?.university ||
    "";

  const isStudentListing =
    Boolean(
      product.isStudentListing ||
        product.studentZone ||
        campus
    );

  /*
    Same for Community Pickup.
    Nothing fake is shown unless data exists.
  */

  const communityPickup =
    product.communityPickup ||
    product.pickupInfo ||
    null;

  const sellerName =
    product.sellerInfo?.name ||
    "ReSellHub Seller";

  const sellerLocation =
    product.sellerInfo?.location ||
    product.location ||
    "Location not provided";

  const listedDate =
    product.createdAt
      ? new Date(
          product.createdAt
        ).toLocaleDateString("en-BD", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  return (
    <main className="min-h-screen bg-[#f7faf8]">

      {/* TOP BAR */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />

            Back
          </button>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label="Wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
            >
              {wishlistLoading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Heart size={17} />
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Share2 size={17} />
            </button>

          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">

        {/* NOTIFICATION */}

        {notice && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
              notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* MAIN AREA */}

        <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr]">

          {/* LEFT / IMAGES */}

          <div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="relative flex aspect-square max-h-[600px] items-center justify-center overflow-hidden rounded-[22px] bg-slate-50">

                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="h-full w-full object-contain p-5 sm:p-8"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">

                    <Package size={54} />

                    <span className="mt-3 text-sm">
                      No image available
                    </span>

                  </div>
                )}

                {/* CONDITION */}

                <div className="absolute left-4 top-4">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-black shadow-sm ${
                      isOutOfStock
                        ? "border-red-200 text-red-600"
                        : "border-emerald-200 text-emerald-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isOutOfStock
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                    />

                    {isOutOfStock
                      ? "Unavailable"
                      : product.condition ||
                        "Available"}
                  </span>

                </div>

                {/* STUDENT ZONE */}

                {isStudentListing && (
                  <div className="absolute right-4 top-4">

                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-black text-blue-700 shadow-sm">

                      <GraduationCap size={14} />

                      Student Exchange
                    </span>

                  </div>
                )}
              </div>

              {/* THUMBNAILS */}

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">

                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                        className={`h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition ${
                          selectedImage ===
                          image
                            ? "border-emerald-500"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${
                            index + 1
                          }`}
                          className="h-full w-full object-contain p-1"
                        />
                      </button>
                    )
                  )}

                </div>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-lg font-black text-slate-950">
                About this product
              </h2>

              <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {product.description ||
                  "No description provided for this product."}
              </p>

            </div>

            {/* DETAILS */}

            <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-lg font-black text-slate-950">
                Product details
              </h2>

              <div className="mt-4 grid sm:grid-cols-2 sm:gap-x-10">

                <DetailRow
                  icon={Layers3}
                  label="Condition"
                  value={
                    product.condition ||
                    "N/A"
                  }
                />

                <DetailRow
                  icon={Tag}
                  label="Category"
                  value={
                    product.category ||
                    "N/A"
                  }
                />

                <DetailRow
                  icon={ShieldCheck}
                  label="Availability"
                  value={
                    isOutOfStock
                      ? "Unavailable"
                      : "Available"
                  }
                />

                <DetailRow
                  icon={CalendarDays}
                  label="Listed"
                  value={listedDate}
                />

              </div>

            </div>
          </div>

          {/* RIGHT / PURCHASE INFO */}

          <div className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:p-8">

              {/* TAGS */}

              <div className="flex flex-wrap gap-2">

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                  {product.category ||
                    "Other"}
                </span>

                {product.condition && (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
                    {product.condition}
                  </span>
                )}

                {isStudentListing && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">
                    Student Zone
                  </span>
                )}

              </div>

              {/* TITLE */}

              <h1 className="mt-5 text-3xl font-black leading-[1.14] tracking-tight text-slate-950 sm:text-4xl">
                {product.title}
              </h1>

              {/* LOCATION */}

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                <MapPin size={16} />

                {sellerLocation}

              </div>

              {/* PRICE */}

              <div className="mt-7 flex items-end gap-2">

                <span className="text-[38px] font-black tracking-tight text-slate-950">
                  ৳
                  {Number(
                    product.price || 0
                  ).toLocaleString(
                    "en-US"
                  )}
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-400">
                Listed price
              </p>

              {/* PRIMARY ACTIONS */}

              <div className="mt-7 space-y-3">

                <button
                  type="button"
                  onClick={handleChat}
                  disabled={isOutOfStock}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  <MessageCircleMore
                    size={19}
                  />

                  Chat with Seller
                </button>

                <button
                  type="button"
                  onClick={handleOffer}
                  disabled={isOutOfStock}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white text-sm font-black text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  <BadgeDollarSign
                    size={19}
                  />

                  Make an Offer
                </button>

              </div>

              {/* EXISTING BUY NOW */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  or
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <ShoppingBag size={17} />

                {isOutOfStock
                  ? "Unavailable"
                  : "Buy at listed price"}
              </button>

              {!isOutOfStock && (
                <p className="mt-3 text-center text-[11px] text-slate-400">
                  Buy directly without
                  negotiation
                </p>
              )}

              {/* SELLER */}

              <div className="mt-7 border-t border-slate-100 pt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-slate-400">
                  Seller
                </p>

                <div className="mt-4 flex items-center gap-3">

                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">
                    {sellerName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-black text-slate-950">
                      {sellerName}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                      <MapPin size={12} />

                      <span className="truncate">
                        {sellerLocation}
                      </span>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-300"
                  />

                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3">

                  <ShieldCheck
                    size={16}
                    className="mt-0.5 flex-none text-emerald-600"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    Check the product details
                    carefully and use ReSellHub
                    communication before making
                    a deal.
                  </p>

                </div>

              </div>
            </div>

            {/* STUDENT ZONE */}

            {isStudentListing && (
              <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-blue-700">
                    <GraduationCap
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="text-sm font-black text-slate-950">
                      Student Exchange
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Listed for the student
                      community
                      {campus
                        ? ` at ${campus}.`
                        : "."}
                    </p>

                  </div>
                </div>

              </div>
            )}

            {/* COMMUNITY PICKUP */}

            {communityPickup && (
              <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-emerald-700">
                    <PackageCheck
                      size={19}
                    />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-black text-slate-950">
                      Community Pickup
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      This listing supports a
                      scheduled local community
                      pickup.
                    </p>

                    {communityPickup?.area && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700">

                        <MapPin size={13} />

                        {
                          communityPickup.area
                        }

                      </div>
                    )}

                    {communityPickup?.schedule && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">

                        <Clock3 size={13} />

                        {
                          communityPickup.schedule
                        }

                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

            {/* REUSE MESSAGE */}

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Check size={18} />
                </div>

                <div>

                  <p className="text-sm font-black text-slate-950">
                    Give it another useful
                    life
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Buying a useful pre-owned
                    product keeps its value in
                    circulation instead of
                    letting it sit unused.
                  </p>

                </div>

              </div>

            </div>

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
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4">

      <div className="flex min-w-0 items-center gap-2.5">

        <Icon
          size={16}
          className="flex-shrink-0 text-slate-400"
        />

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-right text-sm font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}