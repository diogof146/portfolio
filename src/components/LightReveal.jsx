"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { DUOTONE, toneAt } from "@/gl/duotone"
import s from "./LightReveal.module.css"

function random(low, high) {
  return low + Math.random() * (high - low)
}

function optimizedUrl(src) {
  return "/_next/image?url=" + encodeURIComponent(src) + "&w=1080&q=75"
}

function cyanotypePrint(image) {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext("2d", { willReadFrequently: true })
  context.drawImage(image, 0, 0)

  const data = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = data.data
  for (let i = 0; i < pixels.length; i += 4) {
    const grey = (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255
    pixels[i] = toneAt(DUOTONE.r, grey) * 255
    pixels[i + 1] = toneAt(DUOTONE.g, grey) * 255
    pixels[i + 2] = toneAt(DUOTONE.b, grey) * 255
  }
  context.putImageData(data, 0, 0)
  return canvas
}

const TRAIL_SCALE = 0.5

export default function LightReveal({ src, focusX = 0.5, focusY = 1, intensity = 1, cursorLabel, children }) {
  const wrap = useRef(null)
  const canvas = useRef(null)

  useEffect(
    function () {
      const box = wrap.current
      const element = canvas.current
      const context = element.getContext("2d")
      const trail = document.createElement("canvas")
      const trailContext = trail.getContext("2d")

      let print = null
      const image = new Image()
      image.decoding = "async"
      image.onload = function () {
        print = cyanotypePrint(image)
      }
      image.src = optimizedUrl(src)

      const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let width = 0
      let height = 0
      function resize() {
        const rect = box.getBoundingClientRect()
        let density = Math.min(window.devicePixelRatio || 1, 1.5)
        if (coarse) density = 1
        width = rect.width
        height = rect.height
        element.width = Math.max(1, Math.round(width * density))
        element.height = Math.max(1, Math.round(height * density))
        trail.width = Math.max(1, Math.round(width * TRAIL_SCALE))
        trail.height = Math.max(1, Math.round(height * TRAIL_SCALE))
      }
      resize()
      const resizer = new ResizeObserver(resize)
      resizer.observe(box)

      const puffs = []
      function spawn(x, y, count, size) {
        for (let i = 0; i < count; i++) {
          puffs.push({
            x: x + random(-14, 14),
            y: y + random(-14, 14),
            radius: random(22, 48) * size * intensity,
            grow: random(0.35, 0.95),
            dx: random(-0.3, 0.3),
            dy: random(-0.7, -0.15),
            alpha: random(0.16, 0.36),
            life: 1,
            fade: random(0.007, 0.014),
          })
        }
        if (puffs.length > 420) {
          puffs.splice(0, puffs.length - 420)
        }
      }

      let last = null
      let hovering = false
      function pointIn(event) {
        const rect = box.getBoundingClientRect()
        return { x: event.clientX - rect.left, y: event.clientY - rect.top }
      }

      function onMove(event) {
        if (event.pointerType === "touch") return
        hovering = true
        const point = pointIn(event)
        if (last === null) {
          spawn(point.x, point.y, 5, 1)
        } else {
          const distance = Math.hypot(point.x - last.x, point.y - last.y)
          const steps = Math.min(10, Math.ceil(distance / 12))
          for (let step = 1; step <= steps; step++) {
            const x = last.x + ((point.x - last.x) * step) / steps
            const y = last.y + ((point.y - last.y) * step) / steps
            spawn(x, y, 2, 1)
          }
        }
        last = point
        wake()
      }

      function onLeave() {
        last = null
        hovering = false
        wake()
      }

      function onTap(event) {
        if (event.pointerType !== "touch") return
        const point = pointIn(event)
        spawn(point.x, point.y, 14, 1.4)
        wake()
      }

      let inView = true
      let wanderTime = random(0, 10)
      function wanders() {
        return inView && !reduce && !hovering
      }

      function drawSmoke(time) {
        trailContext.clearRect(0, 0, trail.width, trail.height)
        for (let i = puffs.length - 1; i >= 0; i--) {
          const puff = puffs[i]
          puff.x = puff.x + puff.dx + Math.sin(puff.y * 0.02 + time) * 0.25
          puff.y = puff.y + puff.dy
          puff.radius = puff.radius + puff.grow
          puff.life = puff.life - puff.fade
          if (puff.life <= 0) {
            puffs.splice(i, 1)
            continue
          }
          const x = puff.x * TRAIL_SCALE
          const y = puff.y * TRAIL_SCALE
          const radius = puff.radius * TRAIL_SCALE
          const gradient = trailContext.createRadialGradient(x, y, 0, x, y, radius)
          gradient.addColorStop(0, "rgba(0, 0, 0, " + puff.alpha * puff.life + ")")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          trailContext.fillStyle = gradient
          trailContext.fillRect(x - radius, y - radius, radius * 2, radius * 2)
        }
      }

      function drawPrint() {
        context.clearRect(0, 0, element.width, element.height)
        if (print === null || puffs.length === 0) return
        const scale = Math.min(element.width / print.width, element.height / print.height)
        const drawWidth = print.width * scale
        const drawHeight = print.height * scale
        const left = (element.width - drawWidth) * focusX
        const top = (element.height - drawHeight) * focusY
        context.drawImage(print, left, top, drawWidth, drawHeight)
        context.globalCompositeOperation = "destination-in"
        context.drawImage(trail, 0, 0, element.width, element.height)
        context.globalCompositeOperation = "source-over"
      }

      function tick(time, deltaMs) {
        if (wanders()) {
          wanderTime = wanderTime + deltaMs / 1000
          const x = width * (0.5 + 0.4 * Math.sin(wanderTime * 0.85) + 0.08 * Math.sin(wanderTime * 2.4))
          const y = height * (0.48 + 0.36 * Math.sin(wanderTime * 0.63 + 1.3) + 0.07 * Math.cos(wanderTime * 1.9))
          spawn(x, y, 3, 1)
        }
        drawSmoke(time)
        drawPrint()
        if (puffs.length === 0 && !wanders()) {
          sleep()
        }
      }

      let running = false
      function wake() {
        if (running || !inView) return
        running = true
        gsap.ticker.add(tick)
      }
      function sleep() {
        running = false
        gsap.ticker.remove(tick)
      }

      const visibility = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting
        if (inView) {
          wake()
        } else {
          sleep()
        }
      })
      visibility.observe(box)

      box.addEventListener("pointermove", onMove)
      box.addEventListener("pointerleave", onLeave)
      box.addEventListener("pointerdown", onTap)
      wake()

      return function () {
        sleep()
        visibility.disconnect()
        resizer.disconnect()
        box.removeEventListener("pointermove", onMove)
        box.removeEventListener("pointerleave", onLeave)
        box.removeEventListener("pointerdown", onTap)
      }
    },
    [src, focusX, focusY, intensity],
  )

  return (
    <div ref={wrap} className={s.reveal} data-cursor={cursorLabel}>
      {children}
      <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
    </div>
  )
}
