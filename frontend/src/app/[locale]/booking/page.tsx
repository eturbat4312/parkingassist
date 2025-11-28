// filename: src/app/[locale]/booking/page.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { t } from "@/app/i18n";

type Locale = "en" | "fr";

export default function BookingPage() {
  // Locale
  const params = useParams<{ locale?: Locale }>();
  const pathname = usePathname() || "";
  const pathLocale = (pathname.split("/")[1] as Locale) || "fr";
  const locale: Locale = (params?.locale as Locale) || pathLocale || "fr";
  const isFr = locale === "fr";

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

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
    requiredLength: "", // 👉 Longueur nécessaire
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

    // Required шалгалт, requiredLength орсон
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.city.trim() ||
      !form.postalCode.trim() ||
      !form.address.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.numberOfSpots.trim() ||
      // !form.requiredLength.trim() ||
      !form.startDate.trim() ||
      !form.startTime.trim() ||
      !form.endDate.trim() ||
      !form.endTime.trim() ||
      !form.vehicleDescription.trim()
    ) {
      alert(
        isFr
          ? "Merci de remplir tous les champs obligatoires."
          : "Please fill in all required fields."
      );
      return;
    }

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

  const inputCls =
    "w-full text-[16px] bg-white border border-gray-300 rounded-lg p-3 " +
    "placeholder:text-gray-400 text-gray-900 " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm";

  const labelCls = "block text-base font-semibold mb-1 text-gray-800";

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-10 flex justify-center px-4">
      <div className="w-full max-w-5xl">
        {/* Титл + тайлбар */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t(locale, "booking.title")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t(locale, "booking.availableFor")}{" "}
            <span className="font-medium text-blue-600">
              {t(locale, "booking.cantonGeneva")}
            </span>{" "}
            {t(locale, "booking.and")}{" "}
            <span className="font-medium text-blue-600">
              {t(locale, "booking.cantonVaud")}
            </span>
          </p>
        </div>

        {/* Зүүн талд форм, баруун талд legal menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid gap-6 lg:grid-cols-[2fr,1.2fr] items-start"
        >
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 text-gray-900"
          >
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.firstName")} *
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.lastName")} *
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className={inputCls}
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className={labelCls}>{t(locale, "booking.company")}</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                autoComplete="organization"
                className={inputCls}
              />
            </div>

            {/* City / Postal */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.city")} *
                </label>
                <input
                  name="city"
                  placeholder={t(locale, "booking.cityPlaceholder")}
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.postalCode")} *
                </label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className={inputCls}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>
                {t(locale, "booking.address")} *
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                className={inputCls}
                required
              />
            </div>

            {/* Email / Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.email")} *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.phone")} *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls}
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-base font-semibold mb-2 text-gray-800">
                {t(locale, "booking.reason")}
              </label>
              <div className="flex flex-wrap gap-6 text-gray-900">
                {["Moving", "Renovation", "Delivery", "Other"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={item}
                      checked={form.reason.includes(item)}
                      onChange={handleChange}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-800">
                      {t(locale, `booking.reason_${item.toLowerCase()}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spots + Length */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.numberOfSpots")} *
                </label>
                <input
                  name="numberOfSpots"
                  type="number"
                  min={1}
                  value={form.numberOfSpots}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  {isFr
                    ? "Longueur nécessaire (en mètres) "
                    : "Required length (in meters) "}
                </label>
                <input
                  name="requiredLength"
                  type="number"
                  min={0}
                  step={0.5}
                  value={form.requiredLength}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder={isFr ? "Ex. 10" : "e.g. 10"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {isFr
                    ? "Indiquez la longueur approximative du secteur à réserver (camion, rampe, etc.)."
                    : "Indicate the approximate length of the reserved sector (truck, ramp, etc.)."}
                </p>
              </div>
            </div>

            {/* Dates */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.startDate")} *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.startTime")} *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className={inputCls}
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
                <label className={labelCls}>
                  {t(locale, "booking.endDate")} *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t(locale, "booking.endTime")} *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>
            </motion.div>

            {/* Vehicle */}
            <div>
              <label className={labelCls}>
                {t(locale, "booking.vehicleDescription")} *
              </label>
              <textarea
                name="vehicleDescription"
                value={form.vehicleDescription}
                onChange={handleChange}
                rows={3}
                placeholder={t(locale, "booking.vehiclePlaceholder")}
                className={`${inputCls} resize-y`}
                required
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.03 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-lg font-semibold transition text-white text-[16px] ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? t(locale, "booking.sending")
                : t(locale, "booking.submit")}
            </motion.button>
          </form>

          {/* LEGAL / CONDITIONS MENU */}
          <aside className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-gray-200">
            <button
              type="button"
              onClick={() => setShowLegal((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {isFr
                    ? "Conditions de réservation & mentions légales"
                    : "Reservation conditions & legal notices"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {isFr
                    ? "Veuillez lire attentivement avant de valider votre demande."
                    : "Please read carefully before submitting your request."}
                </p>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {showLegal
                  ? isFr
                    ? "Fermer"
                    : "Close"
                  : isFr
                  ? "Afficher"
                  : "Show"}
              </span>
            </button>

            {showLegal && (
              <div className="mt-4 space-y-6 text-xs leading-relaxed text-gray-700 max-h-[420px] overflow-y-auto pr-2">
                {/* Mentions légales / Legal notice */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {isFr ? "Mentions légales :" : "Legal notice:"}
                  </h3>

                  {isFr ? (
                    <>
                      <p className="italic text-[11px] text-gray-600 mb-2">
                        Utilisation de la voie publique (H 1-05.01 art.8 / H
                        1-05.12 art.1-12)
                      </p>
                      <ol className="list-decimal ml-4 space-y-2">
                        <li>
                          En prévision de travaux ou d&apos;une manifestation,
                          les véhicules parqués sur la voie publique aux
                          endroits où la durée de parcage n&apos;est pas
                          limitée, peuvent être enlevés sur ordre de la police
                          et mis à la disposition de leur détenteur dans un
                          garage, à l&apos;échéance du délai imparti par la
                          signalisation provisoire placée à cet effet. Ce délai
                          est d&apos;au moins 72 heures, dimanche et jours
                          fériés non compris.
                        </li>
                        <li>
                          Les frais d&apos;enlèvement et de garde des véhicules
                          enlevés sur ordre de la police, ainsi que les
                          émoluments d&apos;intervention de police et de mise en
                          fourrière et les droits de garde sont à la charge de
                          leur détenteur.
                        </li>
                        <li>
                          Toutefois les véhicules parqués avant le placement de
                          la signalisation mentionnée à l&apos;alinéa 1 ou au
                          bénéfice d&apos;un macaron dans la zone bleue, sont
                          enlevés au frais du maître de l&apos;ouvrage ou de
                          l&apos;organisateur de la manifestation. Les
                          émoluments rappelés à l&apos;alinéa 2 sont également
                          dus par lui (après accord écrit sur le formulaire ad
                          hoc).
                        </li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p className="italic text-[11px] text-gray-600 mb-2">
                        Use of public roadways (H 1-05.01 art.8 / H 1-05.12
                        art.1-12)
                      </p>
                      <ol className="list-decimal ml-4 space-y-2">
                        <li>
                          In anticipation of works or an event, vehicles parked
                          on public roads in areas where parking duration is not
                          limited may be removed by order of the police and made
                          available to their owner in a garage, once the period
                          indicated on the temporary signage has expired. This
                          period is at least 72 hours, excluding Sundays and
                          public holidays.
                        </li>
                        <li>
                          The costs of towing and storage of vehicles removed by
                          order of the police, as well as any police
                          intervention fees, impound fees and storage charges,
                          are payable by the vehicle owner.
                        </li>
                        <li>
                          However, vehicles parked before the placement of the
                          signage mentioned in paragraph 1, or benefiting from a
                          residential parking permit in the blue zone, are
                          removed at the expense of the project owner or event
                          organiser. The fees mentioned in paragraph 2 are also
                          payable by them (after written agreement on the
                          appropriate form).
                        </li>
                      </ol>
                    </>
                  )}
                </section>

                {/* Conditions de réservation et tarifs */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {isFr
                      ? "Conditions de réservation et tarifs :"
                      : "Reservation conditions and rates:"}
                  </h3>

                  {isFr ? (
                    <ul className="list-disc ml-4 space-y-2">
                      <li>
                        Toutes les informations nécessaires doivent nous être
                        communiquées au plus tard 12 jours ouvrables avant la
                        date de fermeture prévue du secteur de stationnement (en
                        précisant la date et les horaires concernés).
                      </li>
                      <li>
                        La mise en place des panneaux sera effectuée au minimum
                        72 heures à l’avance, hors dimanches et jours fériés.
                      </li>
                      <li>
                        Les emplacements de stationnement ne peuvent pas être
                        bloqués à des fins de convenance personnelle (par
                        exemple pour un événement privé, un apéritif, une soirée
                        ou une exposition de véhicules).
                      </li>
                      <li>
                        Pour les cas où la réservation de stationnement
                        empièterait sur les voies de circulation ou de
                        transports publics (TPG/TPL), les démarches nécessaires
                        devront être réalisées en amont par vos soins.
                      </li>
                      <li>
                        Nos frais pour les démarches de réservation, pose de nos
                        panneaux et assistance le jour de l’intervention sont de
                        CHF 180.00.
                      </li>
                      <li>
                        Les frais additionnels facturés par les autorités
                        suisses seront refacturés à prix coûtant (CHF 5.00/m²
                        d’utilisation).
                      </li>
                    </ul>
                  ) : (
                    <ul className="list-disc ml-4 space-y-2">
                      <li>
                        All required information must be provided to us no later
                        than 12 working days before the planned closure of the
                        parking sector (clearly indicating the date and time
                        slots concerned).
                      </li>
                      <li>
                        Signage will be installed at least 72 hours in advance,
                        excluding Sundays and public holidays.
                      </li>
                      <li>
                        Parking spaces may not be blocked for purely personal
                        convenience (for example for a private event, drinks
                        reception, party or vehicle exhibition).
                      </li>
                      <li>
                        In cases where the reserved parking area encroaches on
                        traffic lanes or public transport routes (TPG/TPL), the
                        necessary procedures with the relevant authorities must
                        be carried out by you in advance.
                      </li>
                      <li>
                        Our fee for handling the reservation process, installing
                        our signs and providing assistance on the day of the
                        operation is CHF 180.00.
                      </li>
                      <li>
                        Any additional costs charged by the Swiss authorities
                        will be re-invoiced at cost price (CHF 5.00/m² of
                        occupied area).
                      </li>
                    </ul>
                  )}
                </section>
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </main>
  );
}
