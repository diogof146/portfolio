"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useLenis } from "lenis/react"
import { INKS, absorb, createFluid } from "@/gl/fluid"
import s from "./InkWell.module.css"

const PAPER = [0.957, 0.973, 0.98]

function pickInk() {
  if (Math.random() < 0.6) return INKS[0]
  return INKS[1]
}

function scaled(ink, amount) {
  return [ink[0] * amount, ink[1] * amount, ink[2] * amount]
}

export default function InkWell({ tone, label }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const control = useRef(null)
  const speed = useRef(0)

  useLenis(function (lenis) {
    speed.current = lenis.velocity
  })

  useEffect(function () {
    const box = wrap.current
    const element = canvas.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const density = Math.min(window.devicePixelRatio || 1, 2)

    let fluid = null
    let failed = false
    let builtWidth = 0
    let builtHeight = 0
    let changedAt = 0
    const resizer = new ResizeObserver(function () {
      changedAt = performance.now()
    })
    resizer.observe(element)

    function drop(ink, amount, x, y) {
      if (!fluid) return
      const angle = Math.random() * Math.PI * 2
      fluid.splat(x, y, Math.cos(angle) * 260, Math.sin(angle) * 260, scaled(ink, amount), 0.014)
    }

    function randomDrop() {
      drop(pickInk(), 1.1, 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6)
    }

    function build(width, height) {
      if (fluid) fluid.destroy()
      element.width = Math.round(width * density)
      element.height = Math.round(height * density)
      fluid = createFluid(element, { simRes: 64, dyeRes: 256, paper: PAPER, fade: { velocity: 0.45, ink: 0.16 } })
      builtWidth = width
      builtHeight = height
      if (!fluid) {
        failed = true
        return
      }
      for (let i = 0; i < 3; i++) randomDrop()
      if (reduce) {
        for (let i = 0; i < 90; i++) fluid.step(1 / 60)
        fluid.render()
      }
    }

    control.current = {
      tone: function (hex) {
        if (!fluid || reduce) return
        const x = 0.3 + Math.random() * 0.4
        fluid.splat(x, 0.9, (Math.random() - 0.5) * 120, -560, scaled(absorb(hex, PAPER), 1.25), 0.024)
      },
    }

    const pointer = { x: 0, y: 0, moved: false, ink: pickInk() }
    function pointIn(event) {
      const rect = element.getBoundingClientRect()
      return { x: (event.clientX - rect.left) / rect.width, y: 1 - (event.clientY - rect.top) / rect.height }
    }

    function move(event) {
      if (!fluid || reduce) return
      const point = pointIn(event)
      if (pointer.moved) {
        const dx = (point.x - pointer.x) * 4000
        const dy = (point.y - pointer.y) * 4000
        if (Math.abs(dx) + Math.abs(dy) > 0.5) {
          fluid.splat(point.x, point.y, dx, dy, scaled(pointer.ink, 0.3), 0.006)
        }
      }
      pointer.x = point.x
      pointer.y = point.y
      pointer.moved = true
    }

    function press(event) {
      if (reduce) return
      pointer.ink = pickInk()
      const point = pointIn(event)
      drop(pointer.ink, 1.4, point.x, point.y)
    }

    function leave() {
      pointer.moved = false
    }

    box.addEventListener("pointermove", move, { passive: true })
    box.addEventListener("pointerdown", press)
    box.addEventListener("pointerleave", leave)

    let onScreen = false
    const visibility = new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting
    })
    visibility.observe(element)

    let frame = 0
    let shown = false
    let idle = 0
    function tick(now, deltaMs) {
      if (!onScreen || failed) return
      if (frame % 15 === 0) {
        shown = true
        if (element.checkVisibility) {
          shown = element.checkVisibility({ visibilityProperty: true, opacityProperty: true })
        }
      }
      frame = frame + 1
      if (!shown) return

      const width = element.clientWidth
      const height = element.clientHeight
      if (width !== builtWidth || height !== builtHeight) {
        if (performance.now() - changedAt < 220 || width < 8 || height < 8) return
        build(width, height)
        if (!fluid) return
      }
      if (reduce) return

      const step = Math.min(deltaMs, 33) / 1000
      idle = idle + step
      if (idle > 3.2) {
        idle = Math.random() * 1.2
        randomDrop()
      }

      const push = gsap.utils.clamp(-30, 30, speed.current)
      if (Math.abs(push) > 0.6) {
        let fromY = 0.92
        if (push > 0) fromY = 0.08
        fluid.splat(0.2 + Math.random() * 0.6, fromY, 0, push * 9, null, 0.05)
      }
      fluid.step(step)
      fluid.render()
    }
    gsap.ticker.add(tick)

    return function () {
      gsap.ticker.remove(tick)
      resizer.disconnect()
      visibility.disconnect()
      box.removeEventListener("pointermove", move)
      box.removeEventListener("pointerdown", press)
      box.removeEventListener("pointerleave", leave)
      if (fluid) fluid.destroy()
      control.current = null
    }
  }, [])

  useEffect(
    function () {
      if (tone && control.current) control.current.tone(tone)
    },
    [tone],
  )

  return (
    <div ref={wrap} className={s.well} data-cursor={label} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  )
}
