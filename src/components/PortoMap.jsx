"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useLenis } from "lenis/react"
import { NOISE, autoSize, covered, fullscreenShader } from "@/gl/gl"
import { weatherIcon } from "@/components/weatherIcon"
import s from "./PortoMap.module.css"

const VIEW = { x: -0.3, y: 2.0, width: 14 }
const HALF_RIVER = 0.15

function km(lat, lon) {
  return [(lon + 8.611) * 83.8, (lat - 41.141) * 111.1]
}

function catmull(p0, p1, p2, p3, t, axis) {
  const a = 2 * p1[axis]
  const b = (p2[axis] - p0[axis]) * t
  const c = (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t * t
  const d = (3 * p1[axis] - p0[axis] - 3 * p2[axis] + p3[axis]) * t * t * t
  return 0.5 * (a + b + c + d)
}

function smooth(points, steps) {
  const out = []
  const last = points.length - 1
  for (let i = 0; i < last; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(last, i + 2)]
    for (let k = 0; k < steps; k++) {
      const t = k / steps
      out.push([catmull(p0, p1, p2, p3, t, 0), catmull(p0, p1, p2, p3, t, 1)])
    }
  }
  out.push(points[last])
  return out
}

function line(coordinates) {
  const points = []
  for (const [lat, lon] of coordinates) points.push(km(lat, lon))
  return smooth(points, 3)
}

const RIVER = line([
  [41.1437, -8.702],
  [41.1444, -8.6743],
  [41.146, -8.66],
  [41.1474, -8.6406],
  [41.1445, -8.627],
  [41.1399, -8.6094],
  [41.1393, -8.5953],
  [41.145, -8.5795],
  [41.141, -8.556],
  [41.1374, -8.532],
])

const COAST = line([
  [41.05, -8.652],
  [41.09, -8.656],
  [41.106, -8.66],
  [41.125, -8.666],
  [41.143, -8.672],
  [41.15, -8.68],
  [41.166, -8.688],
  [41.18, -8.693],
  [41.185, -8.703],
  [41.2, -8.71],
  [41.23, -8.72],
])

const CENTRE = km(41.1485, -8.611)

function bridge(lat, lon) {
  const [x, y] = km(lat, lon)
  let best = null
  for (let i = 0; i < RIVER.length - 1; i++) {
    const [ax, ay] = RIVER[i]
    const [bx, by] = RIVER[i + 1]
    const dx = bx - ax
    const dy = by - ay
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    const px = ax + dx * t
    const py = ay + dy * t
    const distance = Math.hypot(x - px, y - py)
    if (best === null || distance < best.distance) best = { distance, px, py, dx, dy }
  }
  const length = Math.hypot(best.dx, best.dy)
  const nx = -best.dy / length
  const ny = best.dx / length
  const reach = HALF_RIVER + 0.09
  return [best.px - nx * reach, best.py - ny * reach, best.px + nx * reach, best.py + ny * reach]
}

const BRIDGES = [bridge(41.1474, -8.6406), bridge(41.1399, -8.6094), bridge(41.1393, -8.5953), bridge(41.145, -8.5795)]

const LABELS = [
  { text: "Porto", at: km(41.1585, -8.596), kind: "big", angle: 0 },
  { text: "Gaia", at: km(41.125, -8.615), kind: "big", angle: 0 },
  { text: "Douro", at: km(41.1493, -8.6505), kind: "river", angle: -5 },
  { text: "Atlântico", at: km(41.1285, -8.6895), kind: "sea", angle: 0 },
]

const MOODS = {
  clear: { cloud: 0.04, rain: 0, fog: 0, storm: false },
  partlyCloudy: { cloud: 0.35, rain: 0, fog: 0, storm: false },
  overcast: { cloud: 0.85, rain: 0, fog: 0, storm: false },
  fog: { cloud: 0.4, rain: 0, fog: 0.8, storm: false },
  drizzle: { cloud: 0.75, rain: 0.35, fog: 0.1, storm: false },
  rain: { cloud: 0.85, rain: 0.75, fog: 0, storm: false },
  snow: { cloud: 0.85, rain: 0.5, fog: 0, storm: false },
  thunder: { cloud: 0.95, rain: 1, fog: 0, storm: true },
}

const UNKNOWN = { cloud: 0.2, rain: 0, fog: 0, storm: false }

const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform vec3 uView;
uniform float uDpr;
uniform float uTime;
uniform float uFlow;
uniform vec3 uMouse;
uniform vec4 uDrops[3];
uniform float uReveal;
uniform vec2 uOrigin;
uniform vec2 uCentre;
uniform float uNight;
uniform float uCloud;
uniform float uRain;
uniform float uFog;
uniform float uFlash;
uniform vec2 uWind;
uniform vec2 uRiver[${RIVER.length}];
uniform vec2 uCoast[${COAST.length}];
uniform vec4 uBridges[${BRIDGES.length}];
${NOISE}

float lineAt(float v) {
  float d = abs(fract(v - 0.5) - 0.5);
  return 1.0 - smoothstep(0.0, fwidth(v), d);
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  vec2 ap = p - a;
  float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
  return length(ap - ab * t);
}

float coast(vec2 p) {
  float best = 1e5;
  float side = 1.0;
  for (int i = 0; i < ${COAST.length - 1}; i++) {
    vec2 a = uCoast[i];
    vec2 ab = uCoast[i + 1] - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
    float d = length(ap - ab * t);
    if (d < best) {
      best = d;
      side = ab.x * ap.y - ab.y * ap.x > 0.0 ? 1.0 : -1.0;
    }
  }
  return best * side;
}

vec3 river(vec2 p) {
  float best = 1e5;
  float side = 1.0;
  float along = 0.0;
  float total = 0.0;
  for (int i = 0; i < ${RIVER.length - 1}; i++) {
    vec2 a = uRiver[i];
    vec2 ab = uRiver[i + 1] - a;
    vec2 ap = p - a;
    float len = length(ab);
    float t = clamp(dot(ap, ab) / (len * len), 0.0, 1.0);
    float d = length(ap - ab * t);
    if (d < best) {
      best = d;
      side = ab.x * ap.y - ab.y * ap.x < 0.0 ? -1.0 : 1.0;
      along = total + t * len;
    }
    total += len;
  }
  return vec3(best, side, along);
}

void main() {
  vec2 p = (gl_FragCoord.xy - uRes * 0.5) * uView.z + uView.xy;
  float px = uView.z;
  float css = uView.z * uDpr;

  float wave = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 d = uDrops[i];
    if (d.z >= 0.0) {
      float r = length(p - d.xy) - d.z * 1.6;
      wave += sin(r * 9.0) * exp(-abs(r) * 3.0) * exp(-d.z * 1.2);
    }
  }
  vec2 dm = p - uMouse.xy;
  float hill = uMouse.z * exp(-dot(dm, dm) * 1.8);

  float sea = coast(p) + (fbm(p * 1.1 + 4.0) - 0.5) * 0.35 + (noise(p * 6.0) - 0.5) * 0.06;
  vec3 rv = river(p);
  float halfW = mix(${HALF_RIVER.toFixed(2)}, 0.3, smoothstep(-2.6, -5.4, p.x)) + (noise(vec2(rv.z * 2.0, 1.0)) - 0.5) * 0.05;
  float wd = max(sea, halfW - rv.x);
  float water = smoothstep(-px, px, wd);
  float inRiver = smoothstep(-px, px, halfW - rv.x) * (1.0 - smoothstep(-px, px, sea));
  float inSea = water - inRiver;

  float inland = max(-sea, 0.0);
  float bank = max(rv.x - halfW, 0.0);
  float h = 0.5 * (1.0 - exp(-inland * 0.5)) + 0.6 * (1.0 - exp(-bank * 1.5)) + 0.45 * fbm(p * 0.4 + 7.3) + hill * 0.3 + wave * 0.04;
  float v = h * 10.0;
  float contour = lineAt(v) * (mod(floor(v + 0.5), 5.0) < 0.5 ? 1.0 : 0.45);

  float off = max(sea, 0.0);
  float wl = log(1.0 + off * 5.0) * 4.0 + uFlow * 0.35 + wave * 0.5 + hill * 0.6;
  float waterline = lineAt(wl) * exp(-off * 0.45);

  float across = clamp(rv.x / halfW, 0.0, 1.0) * rv.y;
  float streak = sin(rv.z * 7.0 + uFlow * 1.4 + across * 1.7 + noise(vec2(rv.z * 1.5, across * 2.0 + 3.0)) * 5.0 + wave * 2.0);
  float flow = smoothstep(0.8, 1.0, streak) * (1.0 - across * across);

  vec3 landC = mix(vec3(0.035, 0.185, 0.295), vec3(0.016, 0.07, 0.12), uNight);
  vec3 seaC = mix(vec3(0.055, 0.26, 0.39), vec3(0.02, 0.09, 0.15), uNight);
  vec3 ink = mix(vec3(0.75, 0.93, 0.99), vec3(0.5, 0.74, 0.88), uNight);

  vec3 col = landC * (1.0 - water) + seaC * water;
  col += ink * contour * 0.26 * (1.0 - water);
  col += ink * waterline * 0.34 * inSea;
  col += ink * flow * 0.5 * inRiver;

  float shore = 1.0 - smoothstep(0.4 * px, 1.4 * px, abs(wd));
  col = mix(col, ink, shore * 0.7);
  float br = 1e5;
  for (int i = 0; i < ${BRIDGES.length}; i++) br = min(br, segment(p, uBridges[i].xy, uBridges[i].zw));
  col = mix(col, ink, (1.0 - smoothstep(0.4 * px, 1.4 * px, br)) * 0.8);

  vec2 g = p * 5.5;
  vec2 cell = floor(g);
  float rnd = hash(cell);
  vec2 jitter = vec2(hash(cell + 17.0), hash(cell + 43.0)) - 0.5;
  float dl = length(fract(g) - 0.5 - jitter * 0.6) / 5.5;
  float urban = smoothstep(5.5, 1.5, length(p - uCentre + vec2(0.0, 0.6))) * smoothstep(-0.08, -0.3, wd);
  float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + rnd * 2.0) + rnd * 40.0);
  float lights = step(0.56, rnd) * (1.0 - smoothstep(0.5 * css, 1.4 * css, dl)) * urban * twinkle;
  col += vec3(1.0, 0.85, 0.58) * (lights * 0.75 + urban * 0.05) * uNight;

  vec2 cp = p * 0.32 - uWind * uTime * 0.06 + 11.0;
  float cover = smoothstep(0.75 - uCloud * 0.45, 1.0 - uCloud * 0.3, fbm(cp)) * uCloud;
  float shade = smoothstep(0.75 - uCloud * 0.45, 1.0 - uCloud * 0.3, fbm(cp + vec2(0.12, 0.09))) * uCloud;
  col *= 1.0 - shade * 0.45;
  col = mix(col, mix(vec3(0.8, 0.9, 0.97), vec3(0.2, 0.26, 0.33), uNight), cover * 0.22);

  float mist = uFog * (0.45 + 0.4 * fbm(p * 0.5 + uWind * uTime * 0.03)) * (0.7 + 0.3 * smoothstep(-2.0, 2.0, sea));
  col = mix(col, mix(vec3(0.55, 0.66, 0.74), vec3(0.14, 0.19, 0.25), uNight), mist * 0.75);

  float reach = uReveal * 10.5;
  float front = length(p - uOrigin);
  col = mix(landC, col, 1.0 - smoothstep(reach - 1.0, reach, front));
  col += vec3(0.0, 0.68, 0.94) * exp(-abs(front - reach) / (2.0 * css)) * (1.0 - uReveal) * step(0.001, uReveal);

  col += vec3(0.0, 0.3, 0.45) * hill * 0.22;

  vec2 sp = gl_FragCoord.xy / uRes.y;
  sp.x += sp.y * 0.3 * uWind.x;
  float lane = floor(sp.x * 70.0);
  float lr = hash(vec2(lane, 5.0));
  float fall = fract(sp.y * 0.9 + uTime * (1.6 + lr) + lr * 7.0);
  float drop = smoothstep(0.0, 0.015, fall) * (1.0 - smoothstep(0.015, 0.09, fall));
  float thin = 1.0 - smoothstep(0.06, 0.25, abs(fract(sp.x * 70.0) - 0.5));
  col += vec3(0.75, 0.9, 1.0) * drop * thin * step(0.5, lr) * uRain * 0.5;

  col += vec3(0.75, 0.88, 1.0) * uFlash * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`

function flatten(list) {
  const out = []
  for (const item of list) {
    for (const value of item) out.push(value)
  }
  return out
}

function isNight(weather) {
  if (weather !== null) return !weather.isDay
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", hour: "numeric", hourCycle: "h23" }).format(new Date()))
  return hour < 7 || hour >= 20
}

function skyOf(weather) {
  let mood = UNKNOWN
  let windFrom = 270
  if (weather !== null) {
    if (MOODS[weather.kind]) mood = MOODS[weather.kind]
    windFrom = weather.windFrom
  }
  const towards = ((windFrom + 180) * Math.PI) / 180
  let night = 0
  if (isNight(weather)) night = 1
  return { night, cloud: mood.cloud, rain: mood.rain, fog: mood.fog, storm: mood.storm, windX: Math.sin(towards), windY: Math.cos(towards) }
}

function Label({ text, at, kind, angle }) {
  return (
    <span
      className={s.label}
      data-kind={kind}
      style={{ "--dx": (at[0] - VIEW.x).toFixed(3), "--dy": (at[1] - VIEW.y).toFixed(3), "--r": angle + "deg" }}
    >
      {text}
    </span>
  )
}

export default function PortoMap({ weather, kind, places, label, className = "" }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const speed = useRef(0)

  useLenis(function (lenis) {
    speed.current = Math.abs(lenis.velocity)
  })

  useEffect(
    function () {
      const element = wrap.current
      const surface = canvas.current
      const shader = fullscreenShader(surface, FRAGMENT, { derivatives: true })
      if (!shader) return
      const gl = shader.gl
      const uniform = shader.uniform

      const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let scale = 1
      if (coarse) scale = 0.75
      const stopSizing = autoSize(surface, gl, scale)

      function measure() {
        element.style.setProperty("--kx", (element.clientWidth / VIEW.width).toFixed(3))
      }
      measure()
      const resizing = new ResizeObserver(measure)
      resizing.observe(element)

      gl.uniform2fv(uniform("uRiver"), flatten(RIVER))
      gl.uniform2fv(uniform("uCoast"), flatten(COAST))
      gl.uniform4fv(uniform("uBridges"), flatten(BRIDGES))
      gl.uniform2f(uniform("uCentre"), CENTRE[0], CENTRE[1])
      gl.uniform2f(uniform("uOrigin"), VIEW.x, VIEW.y)

      const sky = skyOf(weather)
      const flash = { value: 0 }
      let storm = null
      function strike() {
        gsap
          .timeline()
          .to(flash, { value: 1, duration: 0.05 })
          .to(flash, { value: 0, duration: 0.4 })
          .to(flash, { value: 0.6, duration: 0.04 }, "+=0.1")
          .to(flash, { value: 0, duration: 0.6 })
        storm = gsap.delayedCall(gsap.utils.random(4, 10), strike)
      }
      if (sky.storm && !reduce) storm = gsap.delayedCall(2, strike)

      function toKm(event) {
        const box = element.getBoundingClientRect()
        const perPixel = VIEW.width / box.width
        return [
          VIEW.x + (event.clientX - box.left - box.width / 2) * perPixel,
          VIEW.y - (event.clientY - box.top - box.height / 2) * perPixel,
        ]
      }
      const mouse = { x: 0, y: 0, strength: 0, target: 0 }
      function move(event) {
        const point = toKm(event)
        mouse.x = point[0]
        mouse.y = point[1]
        mouse.target = 1
      }
      function leave() {
        mouse.target = 0
      }
      const drops = [
        [0, 0, -1],
        [0, 0, -1],
        [0, 0, -1],
      ]
      let next = 0
      let clock = 0
      function down(event) {
        const point = toKm(event)
        drops[next] = [point[0], point[1], clock]
        next = (next + 1) % drops.length
      }
      if (!reduce) {
        element.addEventListener("pointermove", move)
        element.addEventListener("pointerleave", leave)
        element.addEventListener("pointerdown", down)
      }

      let onScreen = false
      let inView = 0
      const visibility = new IntersectionObserver(
        function (entries) {
          onScreen = entries[0].isIntersecting
          inView = entries[0].intersectionRatio
        },
        { threshold: [0, 0.4] },
      )
      visibility.observe(surface)

      const reveal = { progress: 0 }
      let revealed = false
      if (reduce) {
        reveal.progress = 1
        revealed = true
      }
      let energy = 0
      let time = 40
      let flow = 0
      let width = 0
      let height = 0

      function render(now, deltaMs) {
        const step = Math.min(deltaMs, 50) / 1000
        clock = clock + step
        if (!onScreen || covered()) return
        if (reduce) {
          if (surface.width === width && surface.height === height) return
        } else {
          if (!revealed && inView >= 0.4) {
            revealed = true
            gsap.to(reveal, { progress: 1, duration: 2.8, ease: "power2.inOut" })
          }
          energy = energy + (Math.min(1, speed.current / 40) - energy) * 0.06
          time = time + step
          flow = flow + step * (1 + energy * 3)
          mouse.strength = mouse.strength + (mouse.target - mouse.strength) * 0.08
        }
        width = surface.width
        height = surface.height

        const ages = []
        for (const [x, y, at] of drops) {
          let age = -1
          if (at >= 0) age = clock - at
          ages.push(x, y, age, 0)
        }

        gl.uniform2f(uniform("uRes"), width, height)
        gl.uniform3f(uniform("uView"), VIEW.x, VIEW.y, VIEW.width / width)
        gl.uniform1f(uniform("uDpr"), width / surface.clientWidth)
        gl.uniform1f(uniform("uTime"), time)
        gl.uniform1f(uniform("uFlow"), flow)
        gl.uniform3f(uniform("uMouse"), mouse.x, mouse.y, mouse.strength)
        gl.uniform4fv(uniform("uDrops"), ages)
        gl.uniform1f(uniform("uReveal"), reveal.progress)
        gl.uniform1f(uniform("uNight"), sky.night)
        gl.uniform1f(uniform("uCloud"), sky.cloud)
        gl.uniform1f(uniform("uRain"), sky.rain)
        gl.uniform1f(uniform("uFog"), sky.fog)
        gl.uniform1f(uniform("uFlash"), flash.value)
        gl.uniform2f(uniform("uWind"), sky.windX, sky.windY)
        shader.draw()
      }
      gsap.ticker.add(render)

      return function () {
        gsap.ticker.remove(render)
        gsap.killTweensOf([reveal, flash])
        if (storm) storm.kill()
        stopSizing()
        resizing.disconnect()
        visibility.disconnect()
        element.removeEventListener("pointermove", move)
        element.removeEventListener("pointerleave", leave)
        element.removeEventListener("pointerdown", down)
      }
    },
    [weather],
  )

  let reading = "Porto"
  let Icon = null
  if (weather !== null) {
    reading = weather.temperature + "° · " + kind
    Icon = weatherIcon(weather.kind, weather.isDay)
  }

  return (
    <div ref={wrap} className={s.map + " " + className} role="img" aria-label={label} data-cursor="Porto">
      <canvas ref={canvas} aria-hidden="true" />
      <div className={s.labels} aria-hidden="true">
        {LABELS.map(function (item) {
          return <Label key={item.text} text={item.text} at={item.at} kind={item.kind} angle={item.angle} />
        })}
        {places.map(function (place) {
          return <Label key={place.name} text={place.name} at={km(place.lat, place.lon)} kind="place" angle={0} />
        })}
      </div>
      <div className={s.info} aria-hidden="true">
        <span className={s.coords}>41.15° N · 8.61° W</span>
        <span className={s.reading}>
          {Icon && <Icon size={12} strokeWidth={1.6} />}
          {reading}
        </span>
        <span className={s.scale}>
          <i />1 km
        </span>
      </div>
    </div>
  )
}
