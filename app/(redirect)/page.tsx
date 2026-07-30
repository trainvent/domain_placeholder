"use client";

import { useEffect } from "react";

export default function LanguageRedirect() {
  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("trainvent-locale="))
      ?.split("=")[1];
    const system = navigator.language.toLowerCase().startsWith("de")
      ? "de"
      : "en";
    const locale = saved === "de" || saved === "en" ? saved : system;

    window.location.replace(`/${locale}/${window.location.search}${window.location.hash}`);
  }, []);

  return null;
}
