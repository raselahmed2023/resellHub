
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Zap, Info, Lightbulb,
  CloudUpload, Eye, Leaf, X, Plus,
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";


const CATEGORIES = [
  "Electronics", "Furniture", "Vehicles", "Fashion",
  "Mobile Phones", "Books", "Sports", "Other",
];
const CONDITIONS = ["Used", "Like New", "Refurbished"];

const CONDITION_STYLE = {
  "Used": { active: "bg-amber-500 border-amber-500 text-white", inactive: "border-gray-200 text-gray-500 hover:border-amber-300" },
  "Like New": { active: "bg-emerald-500 border-emerald-500 text-white", inactive: "border-gray-200 text-gray-500 hover:border-emerald-300" },
  "Refurbished": { active: "bg-blue-500 border-blue-500 text-white", inactive: "border-gray-200 text-gray-500 hover:border-blue-300" },
};

const CONDITION_PREVIEW_COLOR = {
  "Used": "text-amber-600", "Like New": "text-emerald-600", "Refurbished": "text-blue-600",
};



export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", category: "", condition: "Used",
    price: "", stock: "", description: "",
    status: "available",
    images: [], });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((p) => ({
      ...p,
      images: [...p.images, ...previews].slice(0, 10),
    }));
  };

  const removeImage = (i) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const uploadToImgBB = async (file) => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!json.success) throw new Error("Image upload failed");
    return json.data.url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const imageUrls = await Promise.all(
        form.images.map((img) => uploadToImgBB(img.file))
      );

      await axiosSecure.post("/api/products", {
        title: form.title,
        category: form.category,
        condition: form.condition,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        status: form.status,
        images: imageUrls,
      });

      router.push("/dashboard/seller/my-products");
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md flex-shrink-0">
            <Plus size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Add new product</h1>
            <p className="text-xs text-gray-500">List your item and reach buyers instantly.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Two column on lg, stack on mobile */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── LEFT ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                  <div className="w-5 h-5  rounded-md bg-emerald-500 flex items-center justify-center flex-shrink-0 gap-2">
                    <Info size={11} color="white" />
                  </div>
                  <span className=" text-xs font-bold text-emerald-800 uppercase tracking-wider">Basic information</span>
                </div>
                <div className="p-5 flex flex-col gap-4">

                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                      Product title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" required
                      placeholder="e.g. Vintage Patagonia Synchilla Fleece"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                    />
                  </div>

                  {/* Category + Condition — stack on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 transition"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">
                        Condition <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 h-10">
                        {CONDITIONS.map((c) => {
                          const active = form.condition === c;
                          const s = CONDITION_STYLE[c];
                          return (
                            <button
                              key={c} type="button"
                              onClick={() => set("condition", c)}
                              className={`flex-1 h-full rounded-xl border-2 text-xs font-bold transition-all ${active ? s.active : s.inactive}`}
                            >{c}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-fuchsia-50">
                  <div className="w-5 h-5 rounded-md bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Eye size={11} color="white" />
                  </div>
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Product description</span>
                </div>
                <div className="p-5">
                  <textarea
                    required rows={4} maxLength={500}
                    placeholder="Describe the item's history, materials, and any flaws..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                  />
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                      <Lightbulb size={11} className="text-amber-600 flex-shrink-0" />
                      <span className="text-xs text-amber-800">Detailed descriptions sell 40% faster.</span>
                    </div>
                    <span className={`text-xs font-semibold ${form.description.length > 450 ? "text-red-500" : "text-gray-400"}`}>
                      {form.description.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Gallery */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <CloudUpload size={11} color="white" />
                    </div>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Media gallery</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {form.images.length}/10 photos
                  </span>
                </div>
                <div className="p-5">
                  <input type="file" id="img-input" hidden multiple accept="image/*" onChange={handleImageChange} />
                  <label
                    htmlFor="img-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl py-8 cursor-pointer bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all"
                  >
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <CloudUpload size={20} className="text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-blue-700">Click to upload or drag and drop</p>
                    <span className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP · Up to 5MB each</span>
                  </label>

                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16">
                          <img
                            src={img.preview} alt=""
                            className="w-full h-full object-cover rounded-xl border-2 border-blue-200"
                          />
                          <button
                            type="button" onClick={() => removeImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      {form.images.length < 10 && (
                        <label htmlFor="img-input" className="w-16 h-16 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                          <Plus size={16} className="text-blue-400" />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-white">৳</span>
                  </div>
                  <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Pricing & inventory</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">Price (৳) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none"></span>
                        <input
                          type="number" required min={0} placeholder="0"
                          value={form.price} onChange={(e) => set("price", e.target.value)}
                          className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl pl-7 pr-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">Stock <span className="text-red-500">*</span></label>
                      <input
                        type="number" required min={1} placeholder="1"
                        value={form.stock} onChange={(e) => set("stock", e.target.value)}
                        className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                      />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">Listing status</label>
                      <select
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                        className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-400 transition"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                      </select>
                    </div>

                  </div>
                </div>
              </div>

            </div>{/* end LEFT */}

            {/* ── RIGHT SIDEBAR — full width on mobile, fixed width on lg ── */}
            <div className="w-full lg:w-60 flex flex-col gap-4 lg:sticky lg:top-4">

           
              {/* Eco Impact */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div style={{ background: "linear-gradient(to right, #059669, #065f46)" }} className="px-4 py-3 flex items-center gap-2">
                  <Leaf size={14} className="text-emerald-200" />
                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Eco impact</span>
                </div>

                <div style={{ backgroundColor: "#064e3b" }} className="p-4">
                  <p className="text-xs text-emerald-200 leading-relaxed mb-3">
                    By listing this pre-owned item, you're preventing waste and saving resources.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "CO₂", lbl: "Emissions saved" },
                      { val: "3,700", lbl: "Liters water" },
                      { val: "1.5x", lbl: "Eco rank" },
                      { val: "♻", lbl: "Circular item" },
                    ].map(({ val, lbl }) => (
                      <div key={lbl} style={{ backgroundColor: "rgba(255,255,255,0.1)" }} className="rounded-xl p-2.5 flex flex-col justify-center min-h-[56px]">
                        <p className="text-base font-bold text-white">{val}</p>
                        <p className="text-xs text-emerald-300 mt-0.5">{lbl}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <Eye size={14} className="text-gray-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live preview</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { label: "Title", value: form.title || "—", cls: "text-gray-800 font-semibold" },
                    { label: "Category", value: form.category || "—", cls: "text-blue-600 font-semibold" },
                    { label: "Price", value: form.price ? `৳${Number(form.price).toLocaleString()}` : "—", cls: "text-orange-600 font-bold" },
                    { label: "Stock", value: form.stock ? `${form.stock} units` : "—", cls: "text-gray-700 font-semibold" },
                    { label: "Condition", value: form.condition, cls: `font-bold ${CONDITION_PREVIEW_COLOR[form.condition]}` },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5 text-xs">
                      <span className="text-gray-400">{label}</span>
                      <span className={`max-w-[110px] truncate text-right ${cls}`} title={value}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="w-full h-12 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                  : <><Zap size={16} /> Publish product</>
                }
              </button>
              <p className="text-center text-xs text-gray-400 -mt-1 leading-relaxed">
                By publishing you agree to our{" "}
                <span className="text-emerald-600 cursor-pointer">Marketplace Terms</span>.
              </p>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}