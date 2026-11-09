"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { DUOTONE, toneAt } from "@/gl/duotone"
import { covered, whenLoaded } from "@/gl/gl"
import s from "./LightReveal.module.css"

function random(low, high) {
  return low + Math.random() * (high - low)
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

function rgbOf(hex) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) }
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

function noiseLayer(cells) {
  const grid = new Float32Array(cells * cells)
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random()
  }
  return { cells: cells, grid: grid }
}

function valueNoise(layer, x, y, size) {
  const cells = layer.cells
  const gridX = (x / size) * cells
  const gridY = (y / size) * cells
  const x0 = Math.floor(gridX)
  const y0 = Math.floor(gridY)
  const fadeX = smooth(gridX - x0)
  const fadeY = smooth(gridY - y0)

  function at(i, j) {
    return layer.grid[((j + cells) % cells) * cells + ((i + cells) % cells)]
  }

  const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fadeX
  const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fadeX
  return top + (bottom - top) * fadeY
}

function cloudTile(hex) {
  const size = 256
  const tile = document.createElement("canvas")
  tile.width = size
  tile.height = size
  const context = tile.getContext("2d")
  const image = context.createImageData(size, size)
  const layers = [noiseLayer(4), noiseLayer(8), noiseLayer(16), noiseLayer(32), noiseLayer(64)]
  const colour = rgbOf(hex)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let value = 0
      let amount = 0.5
      for (const layer of layers) {
        value = value + amount * valueNoise(layer, x, y, size)
        amount = amount * 0.5
      }
      const index = (y * size + x) * 4
      image.data[index] = colour.r
      image.data[index + 1] = colour.g
      image.data[index + 2] = colour.b
      image.data[index + 3] = Math.max(0, Math.min(1, (value / 0.97 - 0.32) / 0.42)) * 255
    }
  }
  context.putImageData(image, 0, 0)
  return tile
}

const TRAIL_SCALE = 0.5

export default function LightReveal({ print: printed = false, fog = null, focusX = 0.5, focusY = 1, intensity = 1, cursorLabel, children }) {
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
      if (printed) {
        whenLoaded(box.querySelector("img"))
          .then(function (image) {
            print = cyanotypePrint(image)
          })
          .catch(function () {})
      }

      let clouds = []
      if (fog) {
        clouds = [
          { tile: cloudTile(fog.light), scale: 3.2, dx: 14, dy: 5, alpha: 0.55 },
          { tile: cloudTile(fog.dark), scale: 5, dx: -9, dy: 8, alpha: 0.5 },
        ]
      }

      const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const drifts = fog !== null && !reduce
      let width = 0
      let height = 0
      let density = 1
      function resize() {
        const rect = box.getBoundingClientRect()
        density = Math.min(window.devicePixelRatio || 1, 1.5)
        if (coarse || fog) density = 1
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
        return fog !== null && inView && !reduce && !hovering
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

      let fogTime = random(0, 100)
      function drawFog() {
        context.clearRect(0, 0, element.width, element.height)
        context.globalAlpha = fog.density
        context.fillStyle = fog.color
        context.fillRect(0, 0, element.width, element.height)
        context.globalAlpha = 1

        if (fog.top) {
          const colour = rgbOf(fog.color)
          const rgb = colour.r + ", " + colour.g + ", " + colour.b
          const end = element.height * fog.topEnd
          const gradient = context.createLinearGradient(0, 0, 0, end)
          gradient.addColorStop(0, "rgba(" + rgb + ", " + fog.top + ")")
          gradient.addColorStop(0.55, "rgba(" + rgb + ", " + fog.top * 0.7 + ")")
          gradient.addColorStop(1, "rgba(" + rgb + ", 0)")
          context.fillStyle = gradient
          context.fillRect(0, 0, element.width, end)
        }

        for (const cloud of clouds) {
          const pattern = context.createPattern(cloud.tile, "repeat")
          pattern.setTransform(new DOMMatrix().translate(fogTime * cloud.dx, fogTime * cloud.dy).scale(cloud.scale * density))
          context.globalAlpha = cloud.alpha
          context.fillStyle = pattern
          context.fillRect(0, 0, element.width, element.height)
        }
        context.globalAlpha = 1

        if (puffs.length > 0) {
          context.globalCompositeOperation = "destination-out"
          context.globalAlpha = fog.clear
          context.drawImage(trail, 0, 0, element.width, element.height)
          context.globalAlpha = 1
          context.globalCompositeOperation = "source-over"
        }
      }

      let drawn = false
      function appear() {
        let fade = 0.7
        let reveal = 1.8
        let delay = 0.3
        if (reduce) {
          fade = 0
          reveal = 0
          delay = 0
        }
        gsap.to(element, { opacity: 1, duration: fade, ease: "power2.out" })
        gsap.to(box.querySelectorAll("[data-under-fog]"), { opacity: 1, duration: reveal, delay: delay, ease: "power2.out" })
      }

      function tick(time, deltaMs) {
        if (covered()) return
        if (wanders()) {
          wanderTime = wanderTime + deltaMs / 1000
          const x = width * (0.5 + 0.4 * Math.sin(wanderTime * 0.85) + 0.08 * Math.sin(wanderTime * 2.4))
          const y = height * (0.48 + 0.36 * Math.sin(wanderTime * 0.63 + 1.3) + 0.07 * Math.cos(wanderTime * 1.9))
          spawn(x, y, 3, 1)
        }
        if (drifts) fogTime = fogTime + deltaMs / 1000
        drawSmoke(time)
        if (fog) drawFog()
        else drawPrint()
        if (!drawn) {
          drawn = true
          if (fog) appear()
        }
        if (puffs.length === 0 && !wanders() && !drifts) {
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
    [printed, fog, focusX, focusY, intensity],
  )

  return (
    <div ref={wrap} className={s.reveal} data-cursor={cursorLabel}>
      {children}
      <canvas ref={canvas} className={s.canvas} data-fog={fog !== null} aria-hidden="true" />
    </div>
  )
}
