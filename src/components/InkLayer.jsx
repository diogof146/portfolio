"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { inkPrint } from "@/gl/ink"
import s from "./InkLayer.module.css"

gsap.registerPlugin(ScrollTrigger)

function clamp(value) {
  return Math.min(1.2, Math.max(-0.2, value))
}

function scrubWithScroll(print, handle) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce) {
    const trigger = ScrollTrigger.create({
      trigger: print,
      start: "top 75%",
      onEnter: function () {
        handle.set(1)
      },
      onLeaveBack: function () {
        handle.set(0)
      },
    })
    return function () {
      trigger.kill()
      handle.destroy()
      delete print.dataset.inked
    }
  }

  const ink = { value: 0 }
  const tween = gsap.to(ink, {
    value: 1,
    ease: "none",
    onUpdate: function () {
      handle.set(ink.value)
    },
    scrollTrigger: { trigger: print, start: "top 88%", end: "bottom 62%", scrub: 0.6 },
  })
  return function () {
    tween.scrollTrigger.kill()
    tween.kill()
    handle.destroy()
    delete print.dataset.inked
  }
}

export default function InkLayer({ src, scrub = false }) {
  const canvas = useRef(null)

  useEffect(
    function () {
      const print = canvas.current.parentElement
      let card = print.closest("[data-card]")
      if (!card) card = print

      const handle = inkPrint(canvas.current, src, card, function () {
        print.dataset.inked = "true"
      })
      if (!handle) return

      if (scrub) {
        return scrubWithScroll(print, handle)
      }

      function isDeveloped() {
        return card.dataset.developed === "true"
      }

      function at(event) {
        const rect = print.getBoundingClientRect()
        return { x: clamp((event.clientX - rect.left) / rect.width), y: clamp((event.clientY - rect.top) / rect.height) }
      }

      function enter(event) {
        handle.develop(true, at(event))
      }

      function leave() {
        if (!isDeveloped()) handle.develop(false)
      }

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      if (fine) {
        card.addEventListener("pointerenter", enter)
        card.addEventListener("pointerleave", leave)
      }

      const watcher = new MutationObserver(function () {
        handle.develop(isDeveloped())
      })
      watcher.observe(card, { attributes: true, attributeFilter: ["data-developed"] })
      if (isDeveloped()) handle.develop(true)

      return function () {
        watcher.disconnect()
        card.removeEventListener("pointerenter", enter)
        card.removeEventListener("pointerleave", leave)
        handle.destroy()
        delete print.dataset.inked
      }
    },
    [src, scrub],
  )

  return <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
}
