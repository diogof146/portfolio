"use client"

import { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useLenis } from "lenis/react"
import s from "./Work.module.css"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WorkStrip({ hint, children }) {
  const view = useRef(null)
  const track = useRef(null)
  const lenis = useRef(null)
  const [swiped, setSwiped] = useState(false)

  function onScroll() {
    if (!swiped && view.current.scrollLeft > 24) setSwiped(true)
  }
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

      const tween = gsap.to(track.current, {
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

      const strip = track.current

      function cardOf(element) {
        let card = element
        while (card.parentElement !== strip) {
          card = card.parentElement
        }
        return card
      }

      function showFocused(event) {
        const card = cardOf(event.target)
        const wanted = card.offsetLeft - (view.current.clientWidth - card.offsetWidth) / 2
        const shift = Math.min(distance(), Math.max(0, wanted))
        let progress = 0
        if (distance() > 0) progress = shift / distance()
        const trigger = tween.scrollTrigger
        const y = trigger.start + (trigger.end - trigger.start) * progress
        if (lenis.current) {
          lenis.current.scrollTo(y, { immediate: true })
        } else {
          window.scrollTo(0, y)
        }
      }

      strip.addEventListener("focusin", showFocused)

      return function () {
        strip.removeEventListener("focusin", showFocused)
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
    <>
      <div ref={view} className={s.view} onScroll={onScroll}>
        <div ref={track} className={s.track}>
          {children}
        </div>
      </div>
      <p className={"mono " + s.hint} data-swiped={swiped} aria-hidden="true">
        {hint} <ArrowRight size={14} className={s.hintArrow} />
      </p>
    </>
  )
}
