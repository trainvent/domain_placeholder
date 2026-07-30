"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

type Labels = {
  readonly theme: string;
  readonly dark: string;
  readonly light: string;
};

const subscribeToTheme = (onStoreChange: () => void) => {
  window.addEventListener("themechange", onStoreChange);
  return () => window.removeEventListener("themechange", onStoreChange);
};

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const getServerTheme = (): Theme => "dark";

const ThemeIcon = ({ theme }: { theme: Theme }) =>
  theme === "dark" ? (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path
        d="M14.7 11.2A6.4 6.4 0 0 1 6.8 3.3 6.4 6.4 0 1 0 14.7 11.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3.1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1.5v1.3M9 15.2v1.3M1.5 9h1.3M15.2 9h1.3M3.7 3.7l.9.9M13.4 13.4l.9.9M14.3 3.7l-.9.9M4.6 13.4l-.9.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

export function ThemeSelector({ labels }: { labels: Labels }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    getServerTheme,
  );
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

  const choose = (nextTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.style.setProperty("color-scheme", nextTheme);
    localStorage.setItem("trainvent-theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
    setOpen(false);
  };

  return (
    <div className="theme-selector" ref={rootRef}>
      <button
        type="button"
        className="theme-trigger"
        aria-label={`${labels.theme}: ${theme === "dark" ? labels.dark : labels.light}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <ThemeIcon theme={theme} />
      </button>
      {open ? (
        <div className="theme-menu" role="menu" aria-label={labels.theme}>
          {(["dark", "light"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className="theme-option"
              role="menuitemradio"
              aria-checked={theme === option}
              onClick={() => choose(option)}
            >
              <ThemeIcon theme={option} />
              <span>{option === "dark" ? labels.dark : labels.light}</span>
              {theme === option ? <small>✓</small> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
