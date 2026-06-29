"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Package, MapPin, Phone, User } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ product, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const productPrice = Number(product.price);
  const deliveryCharge = 100;
  const totalAmount = productPrice + deliveryCharge;

  const set = (key, val) => {
    setDelivery((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setError("");
    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: delivery.name,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        try {
          await axiosSecure.post("/api/orders", {
            productId: product._id,
            transactionId: paymentIntent.id,
            amount: totalAmount,
            deliveryInfo: delivery,
          });

          router.push(
            `/checkout/success?transactionId=${paymentIntent.id}&amount=${totalAmount}&title=${encodeURIComponent(
              product.title
            )}`
          );
        } catch (err) {
          setError(err.response?.data?.message || "Order failed. Try again.");
        }
      }
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Order summary
          </span>
        </div>

        <div className="p-4">
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-gray-100">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={24} className="text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {product.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {product.category}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Seller: {product.sellerInfo?.name || "Unknown"}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-base font-bold text-orange-500">
                ৳{productPrice.toLocaleString()}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600">
                {product.condition}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Product price</span>
              <span>৳{productPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery charge</span>
              <span>৳{deliveryCharge.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100 mt-1">
              <span>Total</span>
              <span>৳{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Delivery information
          </span>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {[
            {
              key: "name",
              label: "Full name",
              icon: User,
              type: "text",
              placeholder: "Your full name",
            },
            {
              key: "phone",
              label: "Phone number",
              icon: Phone,
              type: "tel",
              placeholder: "+880 1X XX XXX XXX",
            },
            {
              key: "address",
              label: "Delivery address",
              icon: MapPin,
              type: "text",
              placeholder: "Your full address",
            },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                <Icon size={11} /> {label}
              </label>

              <input
                required
                type={type}
                placeholder={placeholder}
                value={delivery[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-fuchsia-50">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
            Card payment
          </span>
        </div>

        <div className="p-5">
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#374151",
                    "::placeholder": {
                      color: "#9CA3AF",
                    },
                  },
                },
              }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Test card: 4242 4242 4242 4242 · Any future date · Any CVC
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          <>Pay ৳{totalAmount.toLocaleString()}</>
        )}
      </button>

      <button
        type="button"
        onClick={() => router.push("/products")}
        disabled={loading}
        className="w-full h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-60"
      >
        Cancel Checkout
      </button>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const productRes = await axiosSecure.get(`/api/products/${productId}`);
        const productData = productRes.data;

        const stock = Number(productData.stock || 0);
        const isOutOfStock =
          stock <= 0 || productData.status !== "available";

        if (isOutOfStock) {
          setError("This product is out of stock.");
          setLoading(false);
          return;
        }

        setProduct(productData);

        const totalAmount = Number(productData.price) + 100;

        const intentRes = await axiosSecure.post("/api/create-payment-intent", {
          amount: totalAmount,
          productId,
        });

        setClientSecret(intentRes.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      init();
    } else {
      setError("Product not found.");
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md">
          <p className="text-red-500 font-bold">
            {error || "Product not found."}
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-4 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <Package size={20} color="white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-500">
              Complete your purchase securely.
            </p>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm product={product} clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-emerald-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}