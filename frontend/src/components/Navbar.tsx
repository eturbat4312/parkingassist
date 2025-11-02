"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { t } from "@/app/i18n";
// import logo from "@/public/logo.png";

type Props = { locale: "en" | "fr" };

export default function Navbar({ locale }: Props) {
  const pathname = usePathname() || "/";
  // /fr/... эсвэл /en/... префиксийг цэвэрлээд үлдсэн замыг авна
  const cleanPath = useMemo(
    () => pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/",
    [pathname]
  );

  const [open, setOpen] = useState(false);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md hover:bg-gray-100 md:hover:bg-transparent md:p-0"
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* left: logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            // src={logo}
            src="/logo.png"
            alt="Parking Assist Logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          <span className="text-lg font-semibold text-blue-700">
            ParkingAssist
          </span>
        </Link>

        {/* center/right: desktop links */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink href={`/${locale}`}>{t(locale, "navbar_home")}</NavLink>
          <NavLink href={`/${locale}/booking`}>
            {t(locale, "navbar_booking")}
          </NavLink>
          <NavLink href={`/${locale}/contact`}>
            {t(locale, "navbar_contact")}
          </NavLink>
        </div>

        {/* languages: always visible on mobile & desktop */}
        <div className="flex items-center gap-2">
          <Link
            href={`/fr${cleanPath === "/" ? "" : cleanPath}`}
            className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 ${
              locale === "fr" ? "font-bold text-blue-700" : ""
            }`}
          >
            🇫🇷 <span className="hidden sm:inline">FR</span>
          </Link>
          <Link
            href={`/en${cleanPath === "/" ? "" : cleanPath}`}
            className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 ${
              locale === "en" ? "font-bold text-blue-700" : ""
            }`}
          >
            🇬🇧 <span className="hidden sm:inline">EN</span>
          </Link>

          {/* hamburger (desktop-д нуух) */}
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-2 md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 flex flex-col">
            <NavLink href={`/${locale}`}>{t(locale, "navbar_home")}</NavLink>
            <NavLink href={`/${locale}/booking`}>
              {t(locale, "navbar_booking")}
            </NavLink>
            <NavLink href={`/${locale}/contact`}>
              {t(locale, "navbar_contact")}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
