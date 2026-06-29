"use client";

import { motion } from "framer-motion";
import { Quote, Star, ShoppingBag, Store } from "lucide-react";

const stories = [
  {
    name: "Nusrat Jahan",
    role: "Buyer",
    icon: ShoppingBag,
    title: "Found a laptop within my budget",
    story:
      "I needed a laptop for my studies but wanted something affordable. ReSell Hub helped me find a verified second-hand laptop in great condition.",
    rating: 5,
  },
  {
    name: "Rasel Ahmed",
    role: "Seller",
    icon: Store,
    title: "Sold unused items easily",
    story:
      "I listed my old phone and furniture on ReSell Hub. The dashboard made it simple to manage products and orders from one place.",
    rating: 5,
  },
  {
    name: "Tanvir Hasan",
    role: "Buyer",
    icon: ShoppingBag,
    title: "Safe and smooth purchase",
    story:
      "The product details, secure checkout, and order tracking made the buying process simple. I felt confident purchasing from the platform.",
    rating: 5,
  },
];

export default function SuccessStories() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            Success Stories
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Real stories from buyers and sellers
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            See how ReSell Hub helps people buy affordably and sell sustainably.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {stories.map(({ name, role, icon: Icon, title, story, rating }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900">{name}</h3>
                    <p className="text-xs text-emerald-600 font-bold">{role}</p>
                  </div>
                </div>

                <Quote size={24} className="text-gray-200" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <h4 className="text-base font-black text-gray-900 mb-2">
                {title}
              </h4>

              <p className="text-sm text-gray-500 leading-7">
                “{story}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}