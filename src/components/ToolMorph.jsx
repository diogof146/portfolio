"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { autoSize, covered, fullscreenShader } from "@/gl/gl"
import { TOOL_SHAPES } from "@/gl/shapes"
import s from "./Toolbox.module.css"

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uFrom;
uniform float uTo;
uniform float uMix;
uniform vec2 uTilt;
uniform float uTime;

${TOOL_SHAPES}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

vec2 map(vec3 p) {

  float yaw = uMix * 6.2832 - 0.35 + sin(uTime * 0.5) * 0.3 + uTilt.x;
  float pitch = 0.2 + sin(uTime * 0.37) * 0.07 + uTilt.y;
  p = rotX(pitch) * rotY(yaw) * p;
  p *= 1.0 + sin(uMix * 3.14159) * 0.12;
  vec2 a = shape(uFrom, p);
  if (uMix < 0.001) return vec2(a.x * 0.92, a.y);
  vec2 b = shape(uTo, p);
  return vec2(mix(a.x, b.x, uMix) * 0.92, uMix < 0.5 ? a.y : b.y);
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

float occlusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float k = 1.0;
  for (int i = 0; i < 4; i++) {
    float h = 0.02 + 0.09 * float(i);
    occ += (h - map(p + n * h).x) * k;
    k *= 0.75;
  }
  return clamp(1.0 - 2.4 * occ, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 4.4);
  vec3 rd = normalize(vec3(uv, -3.0));
  float t = 0.0;
  vec2 h = vec2(1.0, 0.0);
  float hit = 0.0;
  for (int i = 0; i < 90; i++) {
    h = map(ro + rd * t);
    if (h.x < 0.0012) { hit = 1.0; break; }
    t += h.x;
    if (t > 8.0) break;
  }
  if (hit < 0.5) { gl_FragColor = vec4(0.0); return; }

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
  float dif = clamp(dot(n, key), 0.0, 1.0);
  float sky = 0.5 + 0.5 * n.y;
  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
  float spec = pow(clamp(dot(n, normalize(key - rd)), 0.0, 1.0), 40.0);
  float ao = occlusion(p, n);

  vec3 paper = vec3(0.957, 0.973, 0.98);
  vec3 ink = vec3(0.024, 0.133, 0.22);
  vec3 col;
  if (h.y > 0.5) {
    col = mix(ink, vec3(0.0, 0.3, 0.46), dif * 0.6);
  } else {
    float light = clamp((0.3 * sky + 0.85 * dif) * ao, 0.0, 1.0);
    col = mix(ink, paper, smoothstep(0.02, 0.85, light));
    col = mix(col, paper, fres * 0.45 * ao);
  }
  col += spec * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`

export default function ToolMorph({ index }) {
  const canvas = useRef(null)
  const control = useRef(null)
  const first = useRef(index)

  useEffect(function () {
    const element = canvas.current
    const shader = fullscreenShader(element, FRAGMENT)
    if (!shader) return
    const gl = shader.gl

    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let scale = 4 / 3
    if (coarse) scale = 0.75
    const stopSizing = autoSize(element, gl, scale)
    gl.clearColor(0, 0, 0, 0)

    const morph = { from: first.current, to: first.current, mix: 0, busy: false, wanted: first.current }
    function next() {
      if (morph.busy || morph.wanted === morph.from) return
      morph.to = morph.wanted
      if (reduce) {
        morph.from = morph.to
        return
      }
      morph.busy = true
      gsap.fromTo(
        morph,
        { mix: 0 },
        {
          mix: 1,
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: function () {
            morph.from = morph.to
            morph.mix = 0
            morph.busy = false
            next()
          },
        },
      )
    }
    control.current = {
      show: function (wanted) {
        morph.wanted = wanted
        next()
      },
    }

    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 }
    function move(event) {
      tilt.targetX = (event.clientX / window.innerWidth - 0.5) * 0.6
      tilt.targetY = (event.clientY / window.innerHeight - 0.5) * 0.4
    }
    function leave() {
      tilt.targetX = 0
      tilt.targetY = 0
    }
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)

    let visible = false
    const visibility = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting
    })
    visibility.observe(element)

    let time = 0
    function render(now, deltaMs) {
      if (!visible || covered()) return
      if (!reduce) time = time + Math.min(deltaMs, 50) / 1000
      tilt.x = tilt.x + (tilt.targetX - tilt.x) * 0.06
      tilt.y = tilt.y + (tilt.targetY - tilt.y) * 0.06
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(shader.uniform("uRes"), element.width, element.height)
      gl.uniform1f(shader.uniform("uFrom"), morph.from)
      gl.uniform1f(shader.uniform("uTo"), morph.to)
      gl.uniform1f(shader.uniform("uMix"), morph.mix)
      gl.uniform2f(shader.uniform("uTilt"), tilt.x, tilt.y)
      gl.uniform1f(shader.uniform("uTime"), time)
      shader.draw()
    }
    gsap.ticker.add(render)

    return function () {
      gsap.ticker.remove(render)
      gsap.killTweensOf(morph)
      stopSizing()
      visibility.disconnect()
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
      control.current = null
    }
  }, [])

  useEffect(
    function () {
      if (control.current) control.current.show(index)
    },
    [index],
  )

  return <canvas ref={canvas} className={s.morph} aria-hidden="true" />
}
