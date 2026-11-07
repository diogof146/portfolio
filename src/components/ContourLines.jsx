"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { NOISE, autoSize, fullscreenShader } from "@/gl/gl"
import { CONTOURS } from "@/motion/themes"
import s from "./ContourLines.module.css"

const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uMouse;
uniform vec3 uColor;
uniform float uAlpha;
${NOISE}

void main() {
  float unit = min(uRes.x, uRes.y);
  vec2 p = gl_FragCoord.xy / unit * 2.4;
  float h = fbm(p + vec2(uTime * 0.018, uTime * 0.011)) + 0.35 * fbm(p * 0.5 - uTime * 0.01);

  vec2 dm = (gl_FragCoord.xy - uMouse.xy) / unit;
  h += uMouse.z * 0.22 * exp(-dot(dm, dm) * 14.0);

  float v = h * 16.0;
  float dist = abs(fract(v - 0.5) - 0.5);
  float w = fwidth(v);
  float line = 1.0 - smoothstep(0.0, w * 1.1, dist);
  float level = floor(v + 0.5);
  float index = mod(level, 5.0) < 0.5 ? 1.8 : 1.0;
  gl_FragColor = vec4(uColor, clamp(line * uAlpha * index, 0.0, 1.0));
}
`

export default function ContourLines() {
  const canvas = useRef(null)

  useEffect(function () {
    const element = canvas.current
    const shader = fullscreenShader(element, FRAGMENT, { derivatives: true })
    if (!shader) return
    const gl = shader.gl

    let scale = 0.75
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) scale = 0.5
    const stopSizing = autoSize(element, gl, scale)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const look = { r: CONTOURS.paper.r, g: CONTOURS.paper.g, b: CONTOURS.paper.b, alpha: CONTOURS.paper.alpha }
    function onTheme(event) {
      const next = CONTOURS[event.detail]
      if (!next) return
      gsap.to(look, { r: next.r, g: next.g, b: next.b, alpha: next.alpha, duration: 0.9, ease: "power2.out", overwrite: true })
    }

    const mouse = { x: 0, y: 0, strength: 0, target: 0 }
    function move(event) {
      const pixels = element.width / element.clientWidth
      mouse.x = event.clientX * pixels
      mouse.y = (element.clientHeight - event.clientY) * pixels
      mouse.target = 1
    }
    function leave() {
      mouse.target = 0
    }

    let time = 12
    function render(now, deltaMs) {
      if (!reduce) time = time + Math.min(deltaMs, 50) / 1000
      mouse.strength = mouse.strength + (mouse.target - mouse.strength) * 0.05
      gl.uniform2f(shader.uniform("uRes"), element.width, element.height)
      gl.uniform1f(shader.uniform("uTime"), time)
      gl.uniform3f(shader.uniform("uMouse"), mouse.x, mouse.y, mouse.strength)
      gl.uniform3f(shader.uniform("uColor"), look.r, look.g, look.b)
      gl.uniform1f(shader.uniform("uAlpha"), look.alpha)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      shader.draw()
    }

    gsap.ticker.add(render)
    window.addEventListener("themechange", onTheme)
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)

    return function () {
      gsap.ticker.remove(render)
      stopSizing()
      gsap.killTweensOf(look)
      window.removeEventListener("themechange", onTheme)
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [])

  return <canvas ref={canvas} className={s.lines} aria-hidden="true" />
}
