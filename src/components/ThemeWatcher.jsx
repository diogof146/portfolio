"use client"

import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { THEMES } from "@/motion/themes"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function ThemeWatcher() {
  const pathname = usePathname()

  useGSAP(
    function () {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let duration = 0.9
      if (reduce) duration = 0

      function applyTheme(name) {
        const theme = THEMES[name]
        if (!theme) return
        const vars = { duration: duration, ease: "power2.out", overwrite: "auto" }
        for (const key in theme) {
          vars[key] = theme[key]
        }
        gsap.to(document.documentElement, vars)
        window.dispatchEvent(new CustomEvent("themechange", { detail: name }))
      }

      for (const el of document.querySelectorAll("[data-theme]")) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle(self) {
            if (self.isActive) applyTheme(el.dataset.theme)
          },
        })
      }
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
