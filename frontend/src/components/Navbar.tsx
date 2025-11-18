// filename: frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation"; // ✅ одоогийн path

type Props = { locale: "en" | "fr" };

export default function Navbar({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname() || "/";

  const buildLocalePath = (target: "en" | "fr") => {
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = target;
    } else {
      segments.push(target);
    }
    const newPath = segments.join("/") || "/";
    return newPath;
  };

  const frHref = buildLocalePath("fr");
  const enHref = buildLocalePath("en");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (popRef.current && !popRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/85 backdrop-blur-md border-b">
      <div className="mx-auto max-w-6xl px-4">
        {/* NAVBAR HEIGHT stays 64px */}
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-16 w-16 -my-2 overflow-visible shrink-0">
              <Image
                src="/logo.png" // одоо байгаа logo.png
                alt="Park-Assist logo"
                fill
                className="object-contain scale-110" // арай томруулна
                priority
              />
            </div>
            <span className="text-[22px] sm:text-[24px] font-semibold text-blue-700 leading-tight">
              Park-Assist
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href={`/${locale}`}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 text-gray-900"
            >
              Home
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 text-gray-900"
            >
              Booking
            </Link>
            {/* Contact menu хассан */}
          </div>

          {/* Lang + Mobile toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                href={frHref}
                className={`px-2 py-1 rounded border text-xs ${
                  locale === "fr"
                    ? "bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                }`}
              >
                🇫🇷 FR
              </Link>
              <Link
                href={enHref}
                className={`px-2 py-1 rounded border text-xs ${
                  locale === "en"
                    ? "bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                }`}
              >
                🇬🇧 EN
              </Link>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
              type="button"
            >
              {open ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>

            {/* Mobile dropdown */}
            {open && (
              <>
                <div className="fixed inset-0 z-[19999]" aria-hidden="true" />
                <div
                  ref={popRef}
                  className="fixed right-3 top-16 z-[20000] w-72 rounded-2xl bg-white shadow-xl ring-1 ring-black/10 text-gray-900"
                >
                  <div className="py-2">
                    <Link
                      href={`/${locale}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-base hover:bg-gray-50 text-gray-900"
                    >
                      Home
                    </Link>
                    <Link
                      href={`/${locale}/booking`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-base hover:bg-gray-50 text-gray-900"
                    >
                      Booking
                    </Link>
                    {/* Mobile menu доторхи Contact-ийг бас хассан */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
