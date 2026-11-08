"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const LANE = 0.16

function cross(timeline, item, index) {
  const lane = ((index % 3) - 1) * LANE
  let tilt = gsap.utils.random(6, 12)
  if (index % 2 === 0) tilt = -tilt

  timeline.fromTo(
    item,
    {
      x: function () {
        return window.innerWidth * (0.72 + lane)
      },
      y: function () {
        return window.innerHeight * 0.95
      },
      rotation: tilt,
    },
    {
      x: function () {
        return window.innerWidth * (-0.72 + lane)
      },
      y: function () {
        return window.innerHeight * -0.95
      },
      rotation: -tilt * 0.5,
      ease: "none",
      duration: 1.2,
      onUpdate: function () {
        const progress = this.progress()
        const developed = String(progress > 0.3 && progress < 0.72)
        if (item.dataset.developed !== developed) item.dataset.developed = developed
      },
    },
    index * 0.5,
  )
}

function land(timeline, record, at) {
  timeline.fromTo(
    record,
    {
      x: function () {
        return window.innerWidth * 0.7
      },
      y: function () {
        return window.innerHeight * 0.9
      },
      rotation: 14,
    },
    {
      x: function () {
        return record.offsetWidth * -0.24
      },
      y: 0,
      rotation: -3,
      ease: "power3.out",
      duration: 0.9,
    },
    at,
  )

  const disc = record.querySelector("[data-disc]")
  if (disc) timeline.fromTo(disc, { xPercent: 0 }, { xPercent: 48, ease: "power2.out", duration: 0.6 }, at + 0.7)

  const caption = record.querySelector("[data-caption]")
  timeline.from(caption, { autoAlpha: 0, y: 30, duration: 0.5 }, at + 0.9)
  timeline.to({}, { duration: 0.6 })
}

export default function SoundtrackMotion({ className, children }) {
  const root = useRef(null)

  useGSAP(
    function () {
      const section = root.current
      const items = section.querySelectorAll("[data-sound]")
      const record = section.querySelector("[data-record]")
      const word = section.querySelector("[data-word]")
      const media = gsap.matchMedia()

      media.add("(prefers-reduced-motion: no-preference)", function () {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
        })
        for (let i = 0; i < items.length; i++) {
          cross(timeline, items[i], i)
        }
        if (record) land(timeline, record, items.length * 0.5 + 0.35)
        timeline.fromTo(word, { xPercent: 10 }, { xPercent: -30, ease: "none", duration: timeline.duration() }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={className}>
      {children}
    </section>
  )
}
