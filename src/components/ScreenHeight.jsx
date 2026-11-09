"use client"

import { useEffect } from "react"

export default function ScreenHeight() {
  useEffect(function () {
    const root = document.documentElement
    let width = 0

    function measure() {
      if (window.innerWidth === width) return
      width = window.innerWidth
      root.style.setProperty("--screen", window.innerHeight + "px")
    }

    measure()
    window.addEventListener("resize", measure)
    return function () {
      window.removeEventListener("resize", measure)
    }
  }, [])

  return null
}
