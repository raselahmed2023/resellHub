"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@resellhub.com",
    text: "Send us your questions anytime.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+880 1712 345 678",
    text: "Available during business hours.",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Dhaka, Bangladesh",
    text: "Serving buyers and sellers nationwide.",
  },
  {
    icon: Clock,
    title: "Support Time",
    value: "10:00 AM - 8:00 PM",
    text: "Saturday to Thursday.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSent(true);
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setSent(false), 3500);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">
              Contact Us
            </p>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              Need help with buying, selling, or orders?
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 mt-5 leading-7">
              Our support team is here to help you use ReSell Hub smoothly.
              Send us a message and we will get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map(({ icon: Icon, title, value, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      {title}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">
                      {value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      {text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-5 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Send us a message
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill out the form below and we will respond soon.
                </p>
              </div>
            </div>

            {sent && (
              <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                <CheckCircle size={17} />
                Message sent successfully. We will contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={6}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">
                  For order-related issues, include your transaction ID if available.
                </p>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition"
                >
                  Send Message <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}