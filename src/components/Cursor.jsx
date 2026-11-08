"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import s from "./Cursor.module.css"

gsap.registerPlugin(useGSAP)

const INTERACTIVE = "a, button, input, textarea, select, label"

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)
  const hold = useRef(null)

  useGSAP(function () {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.documentElement.classList.add("has-cursor")

    let ringSpeed = 0.45
    if (reduce) ringSpeed = 0.06
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.06, ease: "power3" })
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.06, ease: "power3" })
    const ringX = gsap.quickTo(ring.current, "x", { duration: ringSpeed, ease: "power3" })
    const ringY = gsap.quickTo(ring.current, "y", { duration: ringSpeed, ease: "power3" })
    const holdX = gsap.quickTo(hold.current, "x", { duration: ringSpeed, ease: "power3" })
    const holdY = gsap.quickTo(hold.current, "y", { duration: ringSpeed, ease: "power3" })
    const parts = [dot.current, ring.current, hold.current]

    let shown = false
    function move(event) {
      if (!shown) {
        gsap.to(parts, { autoAlpha: 1, duration: 0.25 })
        shown = true
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      holdX(event.clientX)
      holdY(event.clientY)
    }

    function over(event) {
      if (!(event.target instanceof Element)) return
      const interactive = event.target.closest(INTERACTIVE)
      let tagged = event.target.closest("[data-cursor]")
      if (interactive && tagged && tagged !== interactive && tagged.contains(interactive)) {
        tagged = null
      }

      let text = ""
      if (tagged) text = tagged.getAttribute("data-cursor")
      label.current.textContent = text

      let state = ""
      if (interactive) state = "hover"
      if (text) state = "label"
      ring.current.dataset.state = state
    }

    function down() {
      ring.current.classList.add(s.pressed)
    }

    function up() {
      ring.current.classList.remove(s.pressed)
    }

    function leave() {
      gsap.to(parts, { autoAlpha: 0, duration: 0.2 })
      shown = false
    }

    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerover", over)
    window.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)
    document.documentElement.addEventListener("pointerleave", leave)
    return function () {
      document.documentElement.classList.remove("has-cursor")
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      window.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  })

  return (
    <>
      <div ref={ring} className={s.ring} aria-hidden="true">
        <svg className={s.circle} viewBox="0 0 48 48">
          <circle className={s.track} cx="24" cy="24" r="22" />
        </svg>
        <span ref={label} className={s.label} />
      </div>
      <div ref={hold} className={s.hold} aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <circle className={s.holdFill} cx="24" cy="24" r="22" />
        </svg>
      </div>
      <div ref={dot} className={s.dot} aria-hidden="true" />
    </>
  )
}
