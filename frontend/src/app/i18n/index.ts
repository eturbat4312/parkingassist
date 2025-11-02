import en from "./en.json";
import fr from "./fr.json";

// --- Бүх хэлнүүдийг нэгтгэнэ ---
export const languages = { en, fr };

// --- Хэлний түлхүүрээр орчуулга авах функц ---
export function t(locale: string, key: string): string {
  // Хэрэв locale буруу эсвэл байхгүй бол default-г fr болгож байна
  const lang = languages[locale as keyof typeof languages] || languages["fr"];
  return (lang as Record<string, string>)[key] || key;
}
