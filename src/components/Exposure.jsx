"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import gsap from "gsap"
import { pathFor, stripLanguage } from "@/content/lang/languages"
import { THEMES } from "@/motion/themes"
import s from "./Exposure.module.css"

const HoldContext = createContext(null)

const INTERACTIVE = "a, button, input, textarea, select, label, summary, [contenteditable], [data-no-hold]"
const HOLD_SECONDS = 1.2

export function useHold() {
  return useContext(HoldContext)
}

function isHome(pathname) {
  return stripLanguage(pathname) === "/"
}

function destinationOf(lang, pathname) {
  if (isHome(pathname)) return { href: pathFor(lang, "/about"), color: THEMES.blue["--bg"] }
  return { href: pathFor(lang, "/"), color: THEMES.paper["--bg"] }
}

function setHoldVariable(progress) {
  document.documentElement.style.setProperty("--hold", String(progress))
}

export default function Exposure({ lang, children }) {
  const canvas = useRef(null)
  const state = useRef({ progress: 0, x: 0, y: 0, ratio: 1, tween: null, active: false, done: false, href: "", color: "", fill: "" })
  const controls = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(
    function () {
      const hold = state.current
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)")

      function draw() {
        const element = canvas.current
        const context = element.getContext("2d")
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, element.width, element.height)
        if (hold.progress <= 0.001) return
        context.setTransform(hold.ratio, 0, 0, hold.ratio, 0, 0)
        context.fillStyle = hold.fill

        if (reduce.matches) {
          context.globalAlpha = Math.min(1, hold.progress * 1.1)
          context.fillRect(0, 0, window.innerWidth, window.innerHeight)
          context.globalAlpha = 1
          return
        }

        const far = Math.hypot(Math.max(hold.x, window.innerWidth - hold.x), Math.max(hold.y, window.innerHeight - hold.y))
        const radius = far * 1.32 * Math.pow(hold.progress, 1.6)
        const time = performance.now() / 1000
        const points = 120
        context.beginPath()
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2
          const wobble = 1 + 0.07 * Math.sin(5 * angle + time * 1.7) + 0.045 * Math.sin(9 * angle - time * 2.3) + 0.03 * Math.sin(14 * angle + time * 3.1)
          const x = hold.x + Math.cos(angle) * radius * wobble
          const y = hold.y + Math.sin(angle) * radius * wobble
          if (i === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.closePath()
        context.shadowColor = "rgba(0, 174, 239, 0.9)"
        context.shadowBlur = 46
        context.fill()
        context.shadowBlur = 0
      }

      function update() {
        setHoldVariable(hold.progress)
        draw()
      }

      function resize() {
        hold.ratio = Math.min(window.devicePixelRatio || 1, 1.5)
        canvas.current.width = Math.round(window.innerWidth * hold.ratio)
        canvas.current.height = Math.round(window.innerHeight * hold.ratio)
        draw()
      }

      function finish() {
        hold.done = true
        document.documentElement.classList.remove("holding")
        router.push(hold.href)
      }

      function start(x, y) {
        if (hold.done) return
        hold.x = x
        hold.y = y
        hold.fill = hold.color
        hold.active = true
        document.documentElement.classList.add("holding")
        window.getSelection().removeAllRanges()
        if (hold.tween) hold.tween.kill()
        hold.tween = gsap.to(hold, {
          progress: 1,
          duration: HOLD_SECONDS * (1 - hold.progress),
          ease: "none",
          onUpdate: update,
          onComplete: finish,
        })
      }

      function cancel() {
        if (!hold.active || hold.done) return
        hold.active = false
        if (hold.tween) hold.tween.kill()
        hold.tween = gsap.to(hold, {
          progress: 0,
          duration: 0.5,
          ease: "power3.out",
          onUpdate: update,
          onComplete: function () {
            document.documentElement.classList.remove("holding")
          },
        })
      }

      function arrive() {
        if (!hold.done) return
        hold.done = false
        hold.active = false
        if (hold.tween) hold.tween.kill()
        hold.tween = gsap.to(hold, { progress: 0, duration: 0.7, delay: 0.15, ease: "power2.inOut", onUpdate: update })
      }

      controls.current = { start: start, cancel: cancel, arrive: arrive }

      let timer = null
      let startX = 0
      let startY = 0
      let begun = false

      function down(event) {
        if (!fine.matches || event.button !== 0 || event.pointerType === "touch") return
        if (!(event.target instanceof Element) || event.target.closest(INTERACTIVE)) return
        startX = event.clientX
        startY = event.clientY
        begun = false
        clearTimeout(timer)
        timer = setTimeout(function () {
          begun = true
          start(startX, startY)
        }, 180)
      }

      function stop() {
        clearTimeout(timer)
        timer = null
        if (begun) cancel()
        begun = false
      }

      function move(event) {
        if (!timer && !begun) return
        let limit = 8
        if (begun) limit = 18
        if (Math.hypot(event.clientX - startX, event.clientY - startY) > limit) stop()
      }

      resize()
      window.addEventListener("resize", resize)
      window.addEventListener("pointerdown", down)
      window.addEventListener("pointermove", move, { passive: true })
      window.addEventListener("pointerup", stop)
      window.addEventListener("pointercancel", stop)
      window.addEventListener("blur", stop)
      return function () {
        clearTimeout(timer)
        if (hold.tween) hold.tween.kill()
        window.removeEventListener("resize", resize)
        window.removeEventListener("pointerdown", down)
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", stop)
        window.removeEventListener("pointercancel", stop)
        window.removeEventListener("blur", stop)
        document.documentElement.classList.remove("holding")
        document.documentElement.style.removeProperty("--hold")
      }
    },
    [router],
  )

  useEffect(
    function () {
      const destination = destinationOf(lang, pathname)
      state.current.href = destination.href
      state.current.color = destination.color
      router.prefetch(destination.href)
      controls.current.arrive()
    },
    [lang, pathname, router],
  )

  return (
    <HoldContext.Provider value={{ controls: controls, home: isHome(pathname) }}>
      {children}
      <canvas ref={canvas} className={s.flood} aria-hidden="true" />
    </HoldContext.Provider>
  )
}
