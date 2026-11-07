"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useLenis } from "lenis/react"
import s from "./Work.module.css"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WorkStrip({ children }) {
  const view = useRef(null)
  const track = useRef(null)
  const lenis = useRef(null)
  useLenis(function (instance) {
    lenis.current = instance
  })

  useGSAP(function () {
    const section = view.current.closest("section")
    const media = gsap.matchMedia()

    media.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", function () {
      function distance() {
        return Math.max(0, track.current.scrollWidth - view.current.clientWidth)
      }

      function sideways(self) {
        if (!lenis.current) return
        if (self.isActive) {
          lenis.current.options.gestureOrientation = "both"
        } else {
          lenis.current.options.gestureOrientation = "vertical"
        }
      }

      const html = document.documentElement
      const previousOverscroll = html.style.overscrollBehaviorX
      html.style.overscrollBehaviorX = "none"

      gsap.to(track.current, {
        x: function () {
          return -distance()
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: function () {
            return "+=" + distance()
          },
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onToggle: sideways,
        },
      })

      return function () {
        html.style.overscrollBehaviorX = previousOverscroll
      }
    })

    media.add("(max-width: 1099px)", function () {
      const cards = track.current.querySelectorAll("[data-card]")
      const middle = new IntersectionObserver(
        function (entries) {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            for (const card of cards) {
              card.dataset.developed = String(card === entry.target)
            }
          }
        },
        { root: view.current, rootMargin: "0px -42% 0px -42%" },
      )
      for (const card of cards) {
        middle.observe(card)
      }
      return function () {
        middle.disconnect()
      }
    })
  })

  return (
    <div ref={view} className={s.view}>
      <div ref={track} className={s.track}>
        {children}
      </div>
    </div>
  )
}
