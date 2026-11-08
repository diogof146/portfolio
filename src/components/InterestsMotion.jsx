"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const MOVES = {
  guitar: function (icon) {
    return gsap
      .timeline()
      .to(icon, { rotation: -12, duration: 0.12, ease: "power2.in" })
      .to(icon, { rotation: 4, duration: 0.14, ease: "power2.out" })
      .to(icon, { rotation: -12, duration: 0.12, ease: "power2.in" })
      .to(icon, { rotation: -5, duration: 0.08 })
      .to(icon, { rotation: -12, duration: 0.08 })
      .to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" })
  },
  chess: function (icon) {
    return gsap
      .timeline()
      .to(icon, { y: -24, duration: 0.25, ease: "power2.out" })
      .to(icon, { x: 14, duration: 0.2, ease: "power1.inOut" })
      .to(icon, { y: 0, duration: 0.3, ease: "bounce.out" })
      .to(icon, { y: -24, duration: 0.25, ease: "power2.out", delay: 0.35 })
      .to(icon, { x: 0, duration: 0.2, ease: "power1.inOut" })
      .to(icon, { y: 0, duration: 0.3, ease: "bounce.out" })
  },
  games: function (icon) {
    return gsap
      .timeline()
      .to(icon, { scale: 0.86, duration: 0.07 })
      .to(icon, { scale: 1, duration: 0.28, ease: "elastic.out(1, 0.4)" })
      .to(icon, { scale: 0.9, duration: 0.07 })
      .to(icon, { scale: 1, duration: 0.28, ease: "elastic.out(1, 0.4)" })
      .to(icon, { x: -3, rotation: -6, duration: 0.06, repeat: 3, yoyo: true })
      .to(icon, { x: 0, rotation: 0, duration: 0.1 })
  },
  manga: function (icon) {
    return gsap
      .timeline()
      .to(icon, { scaleX: -1, duration: 0.45, ease: "power2.inOut" })
      .to(icon, { scaleX: 1, duration: 0.45, ease: "power2.inOut", delay: 0.25 })
  },
  gym: function (icon) {
    return gsap
      .timeline({ repeat: 2 })
      .to(icon, { y: -16, rotation: -6, duration: 0.35, ease: "power2.out" })
      .to(icon, { y: 0, rotation: 0, duration: 0.35, ease: "power2.in" })
  },
  setup: function (icon) {
    return gsap
      .timeline()
      .to(icon, { x: 3, duration: 0.04, repeat: 7, yoyo: true })
      .to(icon, { skewX: 8, duration: 0.05 })
      .to(icon, { skewX: 0, duration: 0.15 })
  },
}

function animate(icon, index) {
  let lean = -3
  if (index % 2 === 1) lean = 3
  const float = gsap.to(icon.parentElement, {
    y: -6,
    rotation: lean,
    duration: gsap.utils.random(1.6, 2.4),
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
  })

  const move = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(0.4, 0.9), paused: true, delay: index * 0.15 })
  const signature = MOVES[icon.dataset.interest]
  if (signature) move.add(signature(icon))

  ScrollTrigger.create({
    trigger: icon,
    start: "top bottom",
    end: "bottom top",
    onToggle: function (self) {
      if (self.isActive) {
        float.play()
        move.play()
      } else {
        float.pause()
        move.pause()
      }
    },
  })
}

export default function InterestsMotion({ children }) {
  const root = useRef(null)

  useGSAP(
    function () {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", function () {
        const icons = root.current.querySelectorAll("[data-interest]")
        for (let i = 0; i < icons.length; i++) {
          animate(icons[i], i)
        }
      })
    },
    { scope: root },
  )

  return <section ref={root}>{children}</section>
}
