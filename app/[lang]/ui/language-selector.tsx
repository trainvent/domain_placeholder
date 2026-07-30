"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../translations";

type Labels = {
  readonly system: string;
  readonly english: string;
  readonly german: string;
};

export function LanguageSelector({
  lang,
  labels,
}: {
  lang: Locale;
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (next: Locale | "system") => {
    if (next === "system") {
      document.cookie = "trainvent-locale=; path=/; max-age=0; samesite=lax";
      window.location.assign("/");
      return;
    }

    document.cookie = `trainvent-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(`/${next}/`);
  };

  return (
    <div className="language" ref={rootRef}>
      <button
        type="button"
        className="language-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{lang === "de" ? "DE · Deutsch" : "EN · English"}</span>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="m3 5 3.5 3L10 5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {open ? (
        <div className="language-menu" role="menu">
          <button className="language-option" role="menuitem" onClick={() => choose("system")}>
            <span>{labels.system}</span>
            <small>Auto</small>
          </button>
          <button className="language-option" role="menuitem" onClick={() => choose("en")}>
            <span>{labels.english}</span>
            {lang === "en" ? <small>✓</small> : null}
          </button>
          <button className="language-option" role="menuitem" onClick={() => choose("de")}>
            <span>{labels.german}</span>
            {lang === "de" ? <small>✓</small> : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
