import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr"];

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return "fr";
  const lang = acceptLang.split(",")[0].split("-")[0];
  return locales.includes(lang) ? lang : "fr";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) _next, api, favicon, болон бүх статик ассет (public/*) -> ҮЛ ТООНО
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    // өргөтгөлтэй файлуудыг бүгдийг нь алгасах
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2) Хэрвээ аль хэдийн /fr эсвэл /en гэж эхэлж байвал оролдохгүй
  if (locales.some((l) => pathname.startsWith(`/${l}`))) {
    return NextResponse.next();
  }

  // 3) Үлдсэн бүх маршрут дээр locale префикс нэмнэ
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

// 4) Matcher — цэгтэй (файл) URL-ууд, _next, api зэргийг аль хэдийн алгассан хэвээр
export const config = {
  matcher: ["/((?!_next|api).*)"],
};
