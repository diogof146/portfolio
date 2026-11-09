"use client"

import { ArrowUp } from "lucide-react"
import { useLenis } from "lenis/react"

export default function TopButton({ label, className }) {
  const lenis = useLenis()

  function toTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 2.2 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <button type="button" className={className} onClick={toTop} aria-label={label} data-cursor={label}>
      <ArrowUp size={16} aria-hidden="true" />
    </button>
  )
}
