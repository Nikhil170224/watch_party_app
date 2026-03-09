import { useState, useEffect } from "react";

/**
 * useDarkMode — persists dark-mode preference in localStorage and
 * syncs with the system `prefers-color-scheme` on first load.
 *
 * @returns {{ dark: boolean, toggle: () => void, setDark: (v: boolean) => void }}
 */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("watchparty-dark");
      if (saved !== null) return saved === "true";
    } catch (_) { /* localStorage unavailable */ }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    try { localStorage.setItem("watchparty-dark", String(dark)); } catch (_) {}
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, setDark, toggle };
}
