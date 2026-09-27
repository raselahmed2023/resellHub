"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  Loader2,
  Package,
  MapPin,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";

import axiosSecure from "@/lib/axiosSecure";


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);


function formatMoney(value) {
  const amount = Number(value || 0);

  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}


function CheckoutForm({
  product,
  clientSecret,
  checkoutSummary,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [delivery, setDelivery] =
    useState({
      name: "",
      phone: "",
      address: "",
    });


  const productPrice = Number(
    checkoutSummary?.productPrice ??
      product?.price ??
      0
  );

  const deliveryCharge = Number(
    checkoutSummary?.deliveryCharge ??
      0
  );

  const totalAmount = Number(
    checkoutSummary?.amount ??
      productPrice + deliveryCharge
  );

  const currency =
    checkoutSummary?.currency ||
    "bdt";

  const updateDelivery = (
    key,
    value
  ) => {
    setDelivery((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateDelivery = () => {
    if (
      delivery.name.trim().length <
      2
    ) {
      return "Please enter your full name.";
    }

    if (
      delivery.phone.trim().length <
      6
    ) {
      return "Please enter a valid phone number.";
    }

    if (
      delivery.address.trim().length <
      8
    ) {
      return "Please enter your complete delivery address.";
    }

    return "";
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !stripe ||
        !elements
      ) {
        return;
      }

      const deliveryError =
        validateDelivery();

      if (deliveryError) {
        setError(
          deliveryError
        );

        return;
      }

      const cardElement =
        elements.getElement(
          CardElement
        );

      if (!cardElement) {
        setError(
          "Card information could not be loaded."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {

        const {
          error:
            stripeError,

          paymentIntent,
        } =
          await stripe.confirmCardPayment(
            clientSecret,

            {
              payment_method:
                {
                  card:
                    cardElement,

                  billing_details:
                    {
                      name:
                        delivery.name.trim(),
                    },
                },
            }
          );

        if (
          stripeError
        ) {
          throw new Error(
            stripeError.message ||
              "Payment failed. Please check your card information."
          );
        }

        if (
          !paymentIntent
        ) {
          throw new Error(
            "Stripe did not return payment confirmation."
          );
        }

        if (
          paymentIntent.status !==
          "succeeded"
        ) {
          throw new Error(
            `Payment status is ${paymentIntent.status}. Please try again.`
          );
        }

        const orderResponse =
          await axiosSecure.post(
            "/api/orders",

            {
              productId:
                product._id,

              transactionId:
                paymentIntent.id,

              deliveryInfo:
                {
                  name:
                    delivery.name.trim(),

                  phone:
                    delivery.phone.trim(),

                  address:
                    delivery.address.trim(),
                },
            }
          );

        const order =
          orderResponse.data
            ?.order;

        const orderId =
          order?._id;

        if (!orderId) {
          throw new Error(
            "Payment succeeded, but order confirmation was not returned."
          );
        }


        router.replace(
          `/checkout/success?orderId=${encodeURIComponent(
            orderId
          )}`
        );
      } catch (err) {
        console.error(
          "Checkout error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Payment could not be completed.";

        setError(
          message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="flex flex-col gap-5"
    >
      {/* ===================================================
          ORDER SUMMARY
      ==================================================== */}

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
                  src={
                    product
                      .images[0]
                  }
                  alt={
                    product.title
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package
                    size={24}
                    className="text-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {
                  product.title
                }
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                {
                  product.category
                }
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                Seller:{" "}
                {product
                  .sellerInfo
                  ?.name ||
                  "Unknown"}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-base font-bold text-orange-500">
                {formatMoney(
                  productPrice
                )}
              </p>

              <span className="text-[10px] font-semibold text-emerald-600">
                {
                  product.condition
                }
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Product price
              </span>

              <span>
                {formatMoney(
                  productPrice
                )}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Delivery charge
              </span>

              <span>
                {formatMoney(
                  deliveryCharge
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100 mt-1">
              <span>
                Total
              </span>

              <span>
                {formatMoney(
                  totalAmount
                )}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 text-right uppercase tracking-wide">
              {
                currency
              }
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          DELIVERY INFORMATION
      ==================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Delivery information
          </span>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {[
            {
              key:
                "name",

              label:
                "Full name",

              icon:
                User,

              type:
                "text",

              placeholder:
                "Your full name",

              autoComplete:
                "name",
            },

            {
              key:
                "phone",

              label:
                "Phone number",

              icon:
                Phone,

              type:
                "tel",

              placeholder:
                "+880 1X XX XXX XXX",

              autoComplete:
                "tel",
            },

            {
              key:
                "address",

              label:
                "Delivery address",

              icon:
                MapPin,

              type:
                "text",

              placeholder:
                "Your full address",

              autoComplete:
                "street-address",
            },
          ].map(
            ({
              key,
              label,
              icon:
                Icon,
              type,
              placeholder,
              autoComplete,
            }) => (
              <div
                key={key}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor={
                    `checkout-${key}`
                  }
                  className="text-xs font-semibold text-gray-600 flex items-center gap-1.5"
                >
                  <Icon
                    size={11}
                  />

                  {
                    label
                  }
                </label>

                <input
                  id={
                    `checkout-${key}`
                  }
                  required
                  disabled={
                    loading
                  }
                  type={
                    type
                  }
                  autoComplete={
                    autoComplete
                  }
                  placeholder={
                    placeholder
                  }
                  value={
                    delivery[
                      key
                    ]
                  }
                  onChange={(
                    e
                  ) =>
                    updateDelivery(
                      key,
                      e
                        .target
                        .value
                    )
                  }
                  className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-60"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* ===================================================
          CARD PAYMENT
      ==================================================== */}

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
                disabled:
                  loading,

                style: {
                  base: {
                    fontSize:
                      "14px",

                    color:
                      "#374151",

                    "::placeholder":
                      {
                        color:
                          "#9CA3AF",
                      },
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
            <ShieldCheck
              size={13}
            />

            <span>
              Payment is processed securely through Stripe.
            </span>
          </div>

          {process.env.NODE_ENV !==
            "production" && (
            <p className="text-xs text-gray-400 mt-2">
              Test card:
              4242 4242 4242
              4242 · Any future
              date · Any CVC
            </p>
          )}
        </div>
      </div>

      {/* ===================================================
          ERROR
      ==================================================== */}

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
        >
          {
            error
          }
        </div>
      )}


      <button
        type="submit"
        disabled={
          loading ||
          !stripe ||
          !elements
        }
        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all"
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Processing...
          </>
        ) : (
          <>
            Pay{" "}
            {formatMoney(
              totalAmount
            )}
          </>
        )}
      </button>

      {/* Cancel */}

      <button
        type="button"
        onClick={() =>
          router.push(
            `/products/${product._id}`
          )
        }
        disabled={
          loading
        }
        className="w-full h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-60"
      >
        Cancel Checkout
      </button>
    </form>
  );
}


function CheckoutContent() {
  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const productId =
    searchParams.get(
      "productId"
    );

  const [
    product,
    setProduct,
  ] =
    useState(null);

  const [
    clientSecret,
    setClientSecret,
  ] =
    useState("");

  const [
    checkoutSummary,
    setCheckoutSummary,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled =
      false;

    const init =
      async () => {
        if (
          !productId
        ) {
          setError(
            "Product not found."
          );

          setLoading(
            false
          );

          return;
        }

        try {
          setLoading(
            true
          );

          setError(
            ""
          );


          const productResponse =
            await axiosSecure.get(
              `/api/products/${productId}`
            );

          if (
            cancelled
          ) {
            return;
          }

          const productData =
            productResponse.data;

          if (
            !productData?._id
          ) {
            throw new Error(
              "Product not found."
            );
          }

          const stock =
            Number(
              productData.stock ||
                0
            );

          if (
            stock <= 0 ||
            productData.status !==
              "available"
          ) {
            throw new Error(
              "This product is currently unavailable or out of stock."
            );
          }

          setProduct(
            productData
          );


          const intentResponse =
            await axiosSecure.post(
              "/api/create-payment-intent",

              {
                productId,
              }
            );

          if (
            cancelled
          ) {
            return;
          }

          const {
            clientSecret:
              secret,

            amount,

            productPrice,

            deliveryCharge,

            currency,
          } =
            intentResponse.data ||
            {};

          if (
            !secret
          ) {
            throw new Error(
              "Payment could not be initialized."
            );
          }

          setClientSecret(
            secret
          );

          setCheckoutSummary(
            {
              amount:
                Number(
                  amount
                ),

              productPrice:
                Number(
                  productPrice
                ),

              deliveryCharge:
                Number(
                  deliveryCharge
                ),

              currency:
                currency ||
                "bdt",
            }
          );
        } catch (
          err
        ) {
          console.error(
            "Checkout initialization error:",
            err
          );

          if (
            cancelled
          ) {
            return;
          }

          const status =
            err?.response
              ?.status;

          const message =
            err?.response?.data
              ?.message ||
            err?.message ||
            "Failed to load checkout.";

          /*
           * Buyer-only backend route.
           */

          if (
            status ===
            401
          ) {
            router.replace(
              `/login?callbackURL=${encodeURIComponent(
                `/checkout?productId=${productId}`
              )}`
            );

            return;
          }

          if (
            status ===
            403
          ) {
            setError(
              message ||
                "Only buyer accounts can complete purchases."
            );

            return;
          }

          setError(
            message
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    init();

    return () => {
      cancelled =
        true;
    };
  }, [
    productId,
    router,
  ]);



  if (
    loading
  ) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2
          size={32}
          className="animate-spin text-emerald-500"
        />

        <p className="text-sm font-semibold text-gray-500">
          Preparing secure checkout...
        </p>
      </div>
    );
  }


  if (
    error ||
    !product ||
    !clientSecret ||
    !checkoutSummary
  ) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <Package
              size={24}
              className="text-red-400"
            />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mt-4">
            Checkout unavailable
          </h1>

          <p className="text-sm text-red-600 mt-2 leading-relaxed">
            {error ||
              "Checkout could not be loaded."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="flex-1 h-10 px-5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/products"
                )
              }
              className="flex-1 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <Package
              size={20}
              color="white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Checkout
            </h1>

            <p className="text-xs text-gray-500">
              Complete your purchase securely.
            </p>
          </div>
        </div>

        <Elements
          stripe={
            stripePromise
          }
          options={{
            clientSecret,

            appearance: {
              theme:
                "stripe",
            },
          }}
        >
          <CheckoutForm
            product={
              product
            }
            clientSecret={
              clientSecret
            }
            checkoutSummary={
              checkoutSummary
            }
          />
        </Elements>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-emerald-500"
          />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}