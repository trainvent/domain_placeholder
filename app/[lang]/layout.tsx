import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { hasLocale, type Locale } from "./translations";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const isGerman = lang === "de";
  return {
    title: isGerman
      ? "Diese Domain macht gerade Pause | Trainvent"
      : "This domain is taking a break | Trainvent",
    description: isGerman
      ? "Diese Domain gehört zu Trainvent und ist für eine zukünftige Idee reserviert."
      : "This domain belongs to Trainvent and is reserved for a future idea.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang as Locale}>
      <body>{children}</body>
    </html>
  );
}
