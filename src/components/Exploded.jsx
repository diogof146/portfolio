"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import s from "./Exploded.module.css"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function twoDigits(number) {
  if (number < 10) return "0" + number
  return String(number)
}

export default function Exploded({ layers }) {
  const root = useRef(null)

  useGSAP(
    function () {
      const plates = root.current.querySelectorAll("[data-plate]")
      const callouts = root.current.querySelectorAll("[data-callout]")
      const count = plates.length

      function gap() {
        return parseFloat(getComputedStyle(root.current).getPropertyValue("--lift"))
      }

      function liftOf(index, spacing) {
        return (count - 1 - index) * spacing
      }

      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: reduce)", function () {
        for (let i = 0; i < count; i++) {
          gsap.set(plates[i], { z: liftOf(i, gap()) })
        }
      })

      media.add("(prefers-reduced-motion: no-preference)", function () {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: 0.6, invalidateOnRefresh: true },
        })
        timeline.fromTo(
          plates,
          {
            z: function (index) {
              return liftOf(index, 3)
            },
          },
          {
            z: function (index) {
              return liftOf(index, gap())
            },
            ease: "power2.inOut",
            duration: 1,
            stagger: 0.04,
          },
          0,
        )
        timeline.fromTo(callouts, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.12 }, 0.35)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={s.exploded} style={{ "--count": layers.length }}>
      <div className={s.stage}>
        <div className={s.iso}>
          {layers.map((layer, index) => (
            <div key={layer.name} className={s.plate} data-plate data-kind={layer.kind} style={{ zIndex: layers.length - index }}>
              <span className={s.plateName}>{layer.name}</span>
              <span className={"mono " + s.plateKind}>{layer.kindLabel}</span>
            </div>
          ))}
        </div>
        <ol className={s.callouts}>
          {layers.map((layer, index) => (
            <li key={layer.name} data-callout>
              <span className={"mono " + s.calloutNumber}>{twoDigits(index + 1)}</span>
              <b>
                {layer.name} <em className="mono">{layer.kindLabel}</em>
              </b>
              <p>{layer.role}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
