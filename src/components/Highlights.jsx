"use client"

import { useState } from "react"
import Print from "@/components/Print"
import InkLayer from "@/components/InkLayer"
import s from "./Highlights.module.css"

function numberOf(index) {
  return String(index + 1).padStart(2, "0")
}

export default function Highlights({ items, label }) {
  const [current, setCurrent] = useState(0)
  const shown = items[current]

  return (
    <figure className={s.figure} data-reveal="up">
      <div className={s.frame}>
        {items.map((item, index) => (
          <div key={item.id} className={s.slide} data-active={index === current} aria-hidden={index !== current}>
            <Print src={item.photo} alt={item.title} sizes="(min-width: 768px) 400px, 90vw">
              <InkLayer scrub />
            </Print>
          </div>
        ))}
      </div>

      <div className={s.foot}>
        <figcaption aria-live="polite">
          <span className="mono">{shown.title}</span>
          <span>{shown.people}</span>
        </figcaption>

        {items.length > 1 && (
          <div className={s.switcher} role="group" aria-label={label}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={"mono " + s.choice}
                aria-pressed={index === current}
                aria-label={item.title}
                data-cursor={item.title}
                onClick={function () {
                  setCurrent(index)
                }}
              >
                {numberOf(index)}
              </button>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}
