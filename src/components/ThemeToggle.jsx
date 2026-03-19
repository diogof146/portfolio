"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-[60px] h-8 rounded-full bg-muted animate-pulse" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-5 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDark
          ? "bg-cyan-500 shadow-sm"
          : "bg-slate-200 shadow-sm"
      )}
    >
      <span className="sr-only">Toggle theme</span>

      <span
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-in-out",
          isDark
            ? "translate-x-7 bg-slate-900"
            : "translate-x-0.5 bg-white"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-cyan-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-cyan-900" />
        )}
      </span>
    </button>
  )
}
