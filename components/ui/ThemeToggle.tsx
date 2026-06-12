"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    } else {
      root.classList.toggle("dark", t === "dark");
      root.classList.toggle("light", t === "light");
    }
  }

  function handleChange(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg p-1 border" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
      {(["light", "dark", "system"] as Theme[]).map((t) => (
        <button
          key={t}
          onClick={() => handleChange(t)}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all capitalize ${
            theme === t
              ? "bg-emerald-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}
        </button>
      ))}
    </div>
  );
}