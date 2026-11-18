"use client"

import { useEffect, useRef } from "react"
import s from "./ProjectVideo.module.css"

export default function ProjectVideo({ src, poster, label }) {
  const video = useRef(null)
  const held = useRef(false)

  function toggle() {
    const element = video.current
    if (element.paused) {
      held.current = false
      element.play().catch(function () {})
    } else {
      held.current = true
      element.pause()
    }
  }

  function fullscreen() {
    const element = video.current
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitEnterFullscreen) {
      element.webkitEnterFullscreen()
    }
  }

  function onKey(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      toggle()
    }
    if (event.key === "f") fullscreen()
  }

  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const element = video.current

    const observer = new IntersectionObserver(
      function (entries) {
        for (const entry of entries) {
          if (held.current) continue
          if (entry.isIntersecting) {
            element.play().catch(function () {})
          } else {
            element.pause()
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(element)
    return function () {
      observer.disconnect()
    }
  }, [])

  return (
    <video
      ref={video}
      className={s.video}
      src={src}
      poster={poster}
      aria-label={label}
      tabIndex={0}
      onClick={toggle}
      onDoubleClick={fullscreen}
      onKeyDown={onKey}
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}
