"use client"

import { useEffect, useRef, useState } from "react"
import s from "./Marquee.module.css"

export default function Marquee({ children }) {
  const box = useRef(null)
  const text = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(
    function () {
      function measure() {
        if (!text.current || !box.current) return
        const textWidth = text.current.offsetWidth
        if (textWidth > box.current.clientWidth + 1) {
          setWidth(textWidth)
        } else {
          setWidth(0)
        }
      }

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(box.current)
      observer.observe(text.current)
      return function () {
        observer.disconnect()
      }
    },
    [children],
  )

  const sliding = width > 0
  let className = s.marquee
  let style = undefined
  if (sliding) {
    className = s.marquee + " " + s.sliding
    style = { "--duration": Math.max(6, width / 32).toFixed(1) + "s" }
  }

  return (
    <span ref={box} className={className} style={style}>
      <span className={s.track}>
        <span className={s.copy}>
          <span ref={text} className={s.text}>
            {children}
          </span>
        </span>
        {sliding && (
          <span className={s.copy} aria-hidden="true">
            {children}
          </span>
        )}
      </span>
    </span>
  )
}
