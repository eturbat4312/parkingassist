"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, FileText, Headphones } from "lucide-react";

export default function HomePage() {
  // --- Hero background images ---
  const heroImages = ["/hero-bg1.png", "/hero-bg2.png", "/hero-bg3.png"];
  const [current, setCurrent] = useState(0);

  // --- Automatically change every 6 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-20 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Parking Assist Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="text-xl font-bold text-blue-700 tracking-tight">
              ParkingAssist
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/booking" className="hover:text-blue-600 transition">
              Booking
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION with slideshow */}
      <section className="relative h-screen flex justify-center items-center text-center overflow-hidden">
        {/* Background slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={heroImages[current]}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[current]})`,
                filter: "brightness(0.6) blur(2px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        {/* Hero text */}
        <motion.div
          className="relative z-10 text-white max-w-2xl px-6 mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Find and Reserve Parking <br /> Easily in Geneva & Vaud
          </h1>
          <p className="text-lg text-gray-200 mb-8 drop-shadow-md">
            Simplify your parking permit or spot booking in just a few clicks.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/booking"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
            >
              Start Now
            </Link>
            <Link
              href="/contact"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-100 transition"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Pagination dots */}
        <div className="absolute bottom-8 flex justify-center w-full gap-2">
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

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-white text-center" id="how-it-works">
        <motion.h2
          className="text-4xl font-bold mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 px-6">
          {[
            {
              icon: <MapPin size={38} className="text-blue-600" />,
              title: "Enter Your Location",
              desc: "Type your address in Geneva or Vaud to find available parking zones.",
            },
            {
              icon: <FileText size={38} className="text-blue-600" />,
              title: "Submit Your Request",
              desc: "Fill out the booking form with your parking reason (delivery, moving, etc.)",
            },
            {
              icon: <Headphones size={38} className="text-blue-600" />,
              title: "Get Assistance",
              desc: "Our support team reviews your request and helps you with the permit quickly.",
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

      {/* WHY CHOOSE US / CTA */}
      <motion.section
        className="py-24 bg-blue-600 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-semibold mb-6">
          Fast, Reliable & Local Support
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-blue-100">
          We operate exclusively in Geneva and Vaud, providing personalized
          assistance for individuals, delivery companies, and event organizers.
        </p>
        <Link
          href="/booking"
          className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-100 transition"
        >
          Reserve Your Parking Now
        </Link>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center py-8 text-sm">
        <div className="mb-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="mx-auto mb-2 opacity-80"
          />
        </div>
        <p>© 2025 Parking Assist Geneva & Vaud. All rights reserved.</p>
      </footer>
    </main>
  );
}
