"use client"

import { useEffect, useRef } from "react"

export default function HeroVideo({ src, smallSrc, poster, className }) {
  const video = useRef(null)

  useEffect(
    function () {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      let source = src
      if (window.matchMedia("(max-width: 900px)").matches) source = smallSrc
      video.current.src = source
    },
    [src, smallSrc],
  )

  return <video ref={video} className={className} poster={poster} muted loop playsInline autoPlay preload="auto" aria-hidden="true" />
}
