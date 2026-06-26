"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, User, Phone, MapPin, Lock, Save, Eye, EyeOff } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { authClient } from "@/lib/auth-client";

export default function BuyerProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "", phone: "", address: "",
    photo: null, photoPreview: null,
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));


  useEffect(() => {
    const loadUser = async () => {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const u = session.data.user;
        setForm((p) => ({
          ...p,
          name: u.name || "",
          phone: u.phone || "",
          address: u.location || "",
          photoPreview: u.image || null,
        }));
      }
    };
    loadUser();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("photo", file);
    set("photoPreview", URL.createObjectURL(file));
  };

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
    setSuccess("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match.");
    }

    setLoading(true);
    try {
      // Password change
      if (form.currentPassword && form.newPassword) {
        await authClient.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      // Profile update
      let photoUrl = null;
      if (form.photo) photoUrl = await uploadToImgBB(form.photo);

      const payload = {};
      if (form.name) payload.name = form.name;
      if (form.phone) payload.phone = form.phone;
      if (form.address) payload.location = form.address;
      if (photoUrl) payload.photo = photoUrl;

      await axiosSecure.patch("/api/users/profile", payload);
      setSuccess("Profile updated successfully!");

      // Password fields clear
      setForm((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));

    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) => setShowPass((p) => ({ ...p, [field]: !p[field] }));

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <User size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Profile settings</h1>
            <p className="text-xs text-gray-500">Update your personal information.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Photo */}
          <div className="p-5 flex items-center gap-5">
            <div className="w-16 h-16 flex-shrink-0">  
              {form.photoPreview ? (
                <img
                  src={form.photoPreview}
                  alt="preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Upload new photo</p>
            
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="mt-2 text-xs font-semibold text-emerald-600 border border-emerald-300 rounded-lg px-3 py-1 hover:bg-emerald-50 transition"
              >
                Choose file
              </button>
            </div>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={handlePhoto} />
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
              <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                <User size={11} color="white" />
              </div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Personal information</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Full name</label>
                <input
                  type="text" placeholder="Your full name" value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <Phone size={11} /> Phone number
                </label>
                <input
                  type="tel" placeholder="+880 1X XX XXX XXX" value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <MapPin size={11} /> Address
                </label>
                <input
                  type="text" placeholder="e.g. Dhaka, Bangladesh" value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center">
                <Lock size={11} color="white" />
              </div>
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Change password</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { key: "current", label: "Current password", val: form.currentPassword, field: "currentPassword" },
                { key: "new", label: "New password", val: form.newPassword, field: "newPassword" },
                { key: "confirm", label: "Confirm new password", val: form.confirmPassword, field: "confirmPassword" },
              ].map(({ key, label, val, field }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">{label}</label>
                  <div className="relative">
                    <input
                      type={showPass[key] ? "text" : "password"}
                      placeholder="••••••••" value={val}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-gray-200 rounded-xl px-4 pr-10 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                    <button type="button" onClick={() => toggle(key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400">Leave password fields empty if you don't want to change it.</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="text-black p-4 w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
              : <><Save size={16} /> Save changes</>
            }
          </button>

        </form>
      </div>
    </div>
  );
}