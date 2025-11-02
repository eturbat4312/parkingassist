import "../globals.css";
import Navbar from "@/components/Navbar";

type Locale = "en" | "fr";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "en" || raw === "fr" ? raw : "fr";

  return (
    <>
      <Navbar locale={locale} />
      <div className="pt-20">{children}</div>
    </>
  );
}
