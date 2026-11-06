"use client"

import { useEffect, useSyncExternalStore } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ReactLenis, useLenis } from "lenis/react"

gsap.registerPlugin(ScrollTrigger)

function GsapSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    function update(time) {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    const stopListening = lenis.on("scroll", ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(update)
      stopListening()
    }
  }, [lenis])

  return null
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function watchReducedMotion(onChange) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return function () {
    query.removeEventListener("change", onChange)
  }
}

function readReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches
}

function readReducedMotionOnServer() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(watchReducedMotion, readReducedMotion, readReducedMotionOnServer)
}

export default function SmoothScroll({ children }) {
  const reduce = usePrefersReducedMotion()

  return (
    <ReactLenis root options={{ autoRaf: false, smoothWheel: !reduce }}>
      <GsapSync />
      {children}
    </ReactLenis>
  )
}
