"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useLenis } from "lenis/react"
import { autoSize, covered, fullscreenShader, loadCover, makeTexture } from "@/gl/gl"
import s from "./Vinyl.module.css"

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uAngle;
uniform vec2 uLight;
uniform sampler2D uLabel;
uniform float uShow;

const float R = 0.97;
const float LABEL = 0.33;
const float INNER = 0.37;
const float TRACKS = 5.0;
const vec3 SHINE = vec3(0.7, 1.0, 1.0);
const vec3 VINYL = vec3(0.0, 0.3, 0.46);
const vec3 BLANK = vec3(0.043, 0.216, 0.337);

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float size = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * size);
  float r = length(p);
  float px = 2.0 / size;
  if (r > 1.0) { gl_FragColor = vec4(0.0); return; }

  float a = atan(p.y, p.x);
  float turned = a - uAngle;
  vec2 toLight = uLight - p;
  float align = abs(cos(atan(toLight.y, toLight.x) - a));
  float falloff = 1.0 / (1.0 + 1.1 * dot(toLight, toLight));

  if (r < LABEL) {
    vec2 uv = vec2(cos(turned), sin(turned)) * (r / LABEL) * 0.5 + 0.5;
    vec3 label = mix(BLANK, texture2D(uLabel, uv).rgb, uShow);
    label *= 0.9 + 0.12 * pow(align, 8.0);
    label *= 1.0 - 0.25 * smoothstep(LABEL - 4.0 * px, LABEL, r);
    gl_FragColor = vec4(label, smoothstep(0.024, 0.024 + px, r));
    return;
  }

  float ringNoise = hash(floor(r * 170.0));
  float groove = 0.62 + 0.38 * sin(r * 340.0 + ringNoise * 6.2831);
  vec3 col = VINYL * (0.86 + 0.14 * groove);

  float t = clamp((r - INNER) / (R - 0.025 - INNER), 0.0, 1.0);
  float track = (1.0 - t) * TRACKS;
  float edge = min(fract(track), 1.0 - fract(track));
  float gap = 0.0;
  if (track > 0.05 && track < TRACKS - 0.05) gap = 1.0 - smoothstep(0.0, 0.05, edge);
  float grooved = step(INNER, r) * (1.0 - step(R - 0.025, r));

  col += SHINE * pow(align, 70.0) * falloff * (0.25 + 0.6 * groove) * grooved * (1.0 - 0.7 * gap);
  col += SHINE * 0.07 * pow(align, 5.0) * falloff;
  col += SHINE * 0.35 * gap * pow(align, 120.0) * falloff;
  col += SHINE * 0.18 * smoothstep(R - 0.016, R - 0.004, r);

  gl_FragColor = vec4(col, 1.0 - smoothstep(R - px, R + px, r));
}
`

const TURN_SECONDS = 1.8

export default function Vinyl({ label, className = "" }) {
  const canvas = useRef(null)
  const velocity = useRef(0)

  useLenis(function (lenis) {
    velocity.current = lenis.velocity
  })

  useEffect(
    function () {
      const element = canvas.current
      const shader = fullscreenShader(element, FRAGMENT)
      if (!shader) {
        element.dataset.fallback = "true"
        return
      }
      const gl = shader.gl

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let scale = 1
      if (!fine) scale = 0.85
      const stopSizing = autoSize(element, gl, scale)
      gl.clearColor(0, 0, 0, 0)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

      const texture = makeTexture(gl)
      const fade = { show: 0 }
      let alive = true
      let changed = true
      loadCover(label, 1, 512)
        .then(function (image) {
          if (!alive) return
          gl.bindTexture(gl.TEXTURE_2D, texture)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
          if (reduce) {
            fade.show = 1
            changed = true
            return
          }
          gsap.to(fade, { show: 1, duration: 0.45, ease: "power2.out" })
        })
        .catch(function (error) {
          console.warn("The record's label didn't load:", error)
        })

      const light = { x: -0.7, y: 0.8, targetX: -0.7, targetY: 0.8, mouse: false }
      function move(event) {
        const box = element.getBoundingClientRect()
        const half = Math.min(box.width, box.height) / 2
        light.targetX = (event.clientX - (box.left + box.width / 2)) / half
        light.targetY = -(event.clientY - (box.top + box.height / 2)) / half
        light.mouse = true
      }
      if (fine && !reduce) window.addEventListener("pointermove", move, { passive: true })

      let visible = false
      const visibility = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting
      })
      visibility.observe(element)

      let angle = 0
      let boost = 0
      let time = 0
      let width = 0
      let height = 0
      function render(now, deltaMs) {
        if (!visible || covered()) return
        if (reduce) {
          if (!changed && element.width === width && element.height === height) return
          changed = false
        } else {
          const step = Math.min(deltaMs, 50) / 1000
          time = time + step
          if (!light.mouse) {
            light.targetX = Math.cos(time * 0.35) * 1.1
            light.targetY = 0.6 + Math.sin(time * 0.5) * 0.5
          }
          light.x = light.x + (light.targetX - light.x) * 0.08
          light.y = light.y + (light.targetY - light.y) * 0.08
          boost = boost + (gsap.utils.clamp(-8, 8, velocity.current * 0.12) - boost) * 0.1
          angle = angle + step * ((Math.PI * 2) / TURN_SECONDS) * (1 + boost)
        }
        width = element.width
        height = element.height

        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform2f(shader.uniform("uRes"), width, height)
        gl.uniform1f(shader.uniform("uAngle"), angle)
        gl.uniform2f(shader.uniform("uLight"), light.x, light.y)
        gl.uniform1f(shader.uniform("uShow"), fade.show)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(shader.uniform("uLabel"), 0)
        shader.draw()
      }
      gsap.ticker.add(render)

      return function () {
        alive = false
        gsap.ticker.remove(render)
        gsap.killTweensOf(fade)
        stopSizing()
        visibility.disconnect()
        window.removeEventListener("pointermove", move)
      }
    },
    [label],
  )

  return <canvas ref={canvas} className={s.vinyl + " " + className} aria-hidden="true" />
}
