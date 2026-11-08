"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { isHome } from "@/components/Exposure"
import HoldButton from "@/components/HoldButton"
import s from "./FloatingHold.module.css"

export default function FloatingHold({ text }) {
  const root = useRef(null)
  const pathname = usePathname()

  useEffect(
    function () {
      if (!root.current) return
      const element = root.current
      const visible = new Set()

      function watch(entries) {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        element.dataset.hidden = String(visible.size > 0)
      }

      element.dataset.hidden = "false"
      const observer = new IntersectionObserver(watch)
      for (const footer of document.querySelectorAll("footer")) {
        observer.observe(footer)
      }
      return function () {
        observer.disconnect()
      }
    },
    [pathname],
  )

  if (isHome(pathname)) return null

  return (
    <div ref={root} className={s.floating}>
      <HoldButton text={text} />
    </div>
  )
}
