"use client"

import { useEffect, useRef } from "react"
import s from "./LoopVideo.module.css"

export default function LoopVideo({ src }) {
  const video = useRef(null)

  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const element = video.current

    function show() {
      element.dataset.on = "true"
    }

    const onScreen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        element.play().catch(function () {})
      } else {
        element.pause()
      }
    })
    onScreen.observe(element)

    element.addEventListener("playing", show)

    return function () {
      element.removeEventListener("playing", show)
      onScreen.disconnect()
    }
  }, [])

  return <video ref={video} className={s.video} src={src} muted loop playsInline preload="none" aria-hidden="true" />
}
