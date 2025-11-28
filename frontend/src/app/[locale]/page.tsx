// filename: frontend/src/app/[locale]/page.tsx (эсвэл одоо хэрэглэж буй HomePage file чинь)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, FileText, Headphones } from "lucide-react";
import { t } from "@/app/i18n";

export default function HomePage() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const locale = rawLocale === "en" || rawLocale === "fr" ? rawLocale : "fr";
  const isFr = locale === "fr";

  // ⬇️ public доторх hero зургууд
  const heroImages = ["/hero-bg1.png", "/hero-bg2.png", "/hero-bg3.png"];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(id);
  }, [heroImages.length]);

  // ⚠️ Эдгээрийг ӨӨРИЙН ЖИНХЭНЭ МЭДЭЭЛЛЭЭР солиорой
  const email = "info@park-assist.ch";
  const phoneDisplay = "+41 22 743 21 11";
  const phoneHref = "+41227432111";

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* HERO */}
      <section className="relative h-screen flex justify-center items-center text-center overflow-hidden">
        {/* Background slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImages[current]}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[current]})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>

          {/* Хар overlay — зураг үгүй байсан ч текст үргэлж уншигдана */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Texts */}
        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl">
            {t(locale, "hero_title")}
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl opacity-95">
            {t(locale, "hero_subtitle")}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href={`/${locale}/booking`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
            >
              {t(locale, "hero_start")}
            </Link>
            {/* 👇 Contact товчийг бүр мөсөн авсан
            <Link
              href={`/${locale}/contact`}
              className="bg-white text-blue-700 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-100 transition"
            >
              {t(locale, "hero_contact")}
            </Link>
            */}
          </div>
        </motion.div>

        {/* Dots */}
        <div className="absolute bottom-8 flex justify-center w-full gap-2 z-10">
          {heroImages.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white text-center" id="how-it-works">
        <motion.h2
          className="text-4xl font-bold mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t(locale, "how_title")}
        </motion.h2>

        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 px-6">
          {[
            {
              icon: <MapPin size={38} className="text-blue-600" />,
              title: t(locale, "how_step1_title"),
              desc: t(locale, "how_step1_desc"),
            },
            {
              icon: <FileText size={38} className="text-blue-600" />,
              title: t(locale, "how_step2_title"),
              desc: t(locale, "how_step2_desc"),
            },
            {
              icon: <Headphones size={38} className="text-blue-600" />,
              title: t(locale, "how_step3_title"),
              desc: t(locale, "how_step3_desc"),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER — contact мэдээлэлтэй хувилбар */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-semibold">
              {isFr ? "Contact" : "Contact"}
            </span>
            <span>
              Email:{" "}
              <a
                href={`mailto:${email}`}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {email}
              </a>
            </span>
            <span>
              {isFr ? "Téléphone" : "Phone"}:{" "}
              <a
                href={`tel:${phoneHref}`}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {phoneDisplay}
              </a>
            </span>
          </div>

          <div className="text-xs text-gray-500 text-center sm:text-right">
            © {new Date().getFullYear()} Park-Assist.{" "}
            {isFr ? "Tous droits réservés." : "All rights reserved."}
          </div>
        </div>
      </footer>
    </main>
  );
}
