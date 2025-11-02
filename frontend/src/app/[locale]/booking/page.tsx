// filename: src/app/[locale]/booking/page.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { t } from "@/app/i18n";

type Locale = "en" | "fr";

export default function BookingPage() {
  // Locale-ыг найдвартай тодорхойлох: useParams → pathname fallback
  const params = useParams<{ locale?: Locale }>();
  const pathname = usePathname() || "";
  const pathLocale = (pathname.split("/")[1] as Locale) || "fr";
  const locale: Locale = (params?.locale as Locale) || pathLocale || "fr";

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    city: "",
    postalCode: "",
    address: "",
    email: "",
    phone: "",
    reason: [] as string[],
    numberOfSpots: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    vehicleDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      const updated = new Set(form.reason);
      checked ? updated.add(value) : updated.delete(value);
      setForm((prev) => ({ ...prev, reason: Array.from(updated) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...form }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      alert(t(locale, "booking.sentAlert"));
      router.replace(`/${locale}`);
    } catch (err) {
      console.error("Booking submit failed:", err);
      alert(t(locale, "booking.errorGeneric"));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 flex justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {t(locale, "booking.title")}
        </h1>
        <p className="text-center text-gray-500">
          {t(locale, "booking.availableFor")}{" "}
          <span className="font-medium text-blue-600">
            {t(locale, "booking.cantonGeneva")}
          </span>{" "}
          {t(locale, "booking.and")}{" "}
          <span className="font-medium text-blue-600">
            {t(locale, "booking.cantonVaud")}
          </span>
        </p>

        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.firstName")} *
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.lastName")} *
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            {t(locale, "booking.company")}
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* City / Postal */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.city")} *
            </label>
            <input
              name="city"
              placeholder={t(locale, "booking.cityPlaceholder")}
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.postalCode")} *
            </label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            {t(locale, "booking.address")} *
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Email / Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.email")} *
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.phone")} *
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {t(locale, "booking.reason")}
          </label>
          <div className="flex flex-wrap gap-6">
            {["Moving", "Renovation", "Delivery", "Other"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={item}
                  checked={form.reason.includes(item)}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                {t(locale, `booking.reason_${item.toLowerCase()}`)}
              </label>
            ))}
          </div>
        </div>

        {/* Spots */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            {t(locale, "booking.numberOfSpots")} *
          </label>
          <input
            name="numberOfSpots"
            type="number"
            min={1}
            value={form.numberOfSpots}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Dates (viewPort / whileInView-гүй — "алга болох" баг зассан) */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.startDate")} *
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.startTime")} *
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.endDate")} *
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t(locale, "booking.endTime")} *
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </motion.div>

        {/* Vehicle */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            {t(locale, "booking.vehicleDescription")} *
          </label>
          <textarea
            name="vehicleDescription"
            value={form.vehicleDescription}
            onChange={handleChange}
            rows={3}
            placeholder={t(locale, "booking.vehiclePlaceholder")}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.03 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          className={`w-full py-3 rounded-lg font-semibold transition text-white ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting
            ? t(locale, "booking.sending")
            : t(locale, "booking.submit")}
        </motion.button>
      </motion.form>
    </main>
  );
}
