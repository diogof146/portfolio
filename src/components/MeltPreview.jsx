"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { NOISE, covered, fullscreenShader, loadCover, makeTexture } from "@/gl/gl"
import s from "./MeltPreview.module.css"

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uMix;
uniform vec2 uVel;
uniform sampler2D uA;
uniform sampler2D uB;
${NOISE}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float n = fbm(uv * 3.2 + uTime * 0.15);
  float push = sin(uMix * 3.14159) * 0.16;
  vec2 shift = (vec2(n, fbm(uv * 3.2 + 7.0)) - 0.5) * push;

  float m = uMix * 1.4 - 0.2;
  float edge = 1.0 - smoothstep(m - 0.18, m + 0.18, n * 0.7 + (1.0 - uv.y) * 0.3);

  vec2 rgb = uVel * 0.012;
  vec4 a = vec4(texture2D(uA, uv + shift - rgb).r, texture2D(uA, uv + shift).g, texture2D(uA, uv + shift + rgb).b, 1.0);
  vec4 b = vec4(texture2D(uB, uv - shift - rgb).r, texture2D(uB, uv - shift).g, texture2D(uB, uv - shift + rgb).b, 1.0);
  gl_FragColor = mix(b, a, edge);
}
`

const WIDTH = 380
const HEIGHT = 260

export default function MeltPreview({ controlRef }) {
  const box = useRef(null)
  const canvas = useRef(null)

  useEffect(
    function () {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
      const element = canvas.current
      element.width = WIDTH * 1.5
      element.height = HEIGHT * 1.5
      const shader = fullscreenShader(element, FRAGMENT)
      if (!shader) return
      const gl = shader.gl
      gl.viewport(0, 0, element.width, element.height)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

      const textures = [makeTexture(gl), makeTexture(gl)]
      const state = { mix: 1, front: 0, current: null, visible: false }
      const pictures = new Map()

      const moveX = gsap.quickTo(box.current, "x", { duration: 0.55, ease: "power3" })
      const moveY = gsap.quickTo(box.current, "y", { duration: 0.55, ease: "power3" })
      const speed = { x: 0, y: 0 }
      let last = null

      function place(x, y, instant) {
        const left = Math.min(x + 28, window.innerWidth - WIDTH - 16)
        const top = Math.min(Math.max(y - HEIGHT / 2, 16), window.innerHeight - HEIGHT - 16)
        if (instant) {
          gsap.set(box.current, { x: left, y: top })
        } else {
          moveX(left)
          moveY(top)
        }
        if (last) {
          speed.x = gsap.utils.clamp(-1, 1, (x - last.x) / 40)
          speed.y = gsap.utils.clamp(-1, 1, (y - last.y) / 40)
        }
        last = { x: x, y: y }
      }

      function upload(slot, picture) {
        gl.bindTexture(gl.TEXTURE_2D, textures[slot])
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture)
      }

      async function show(src) {
        if (!state.visible) {
          state.visible = true
          gsap.to(box.current, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" })
        }
        if (state.current === src) return
        state.current = src
        if (!pictures.has(src)) pictures.set(src, loadCover(src, WIDTH / HEIGHT, 640))
        let picture = null
        try {
          picture = await pictures.get(src)
        } catch (error) {
          return
        }
        if (state.current !== src) return
        const slot = 1 - state.front
        upload(slot, picture)
        state.front = slot
        gsap.fromTo(state, { mix: 0 }, { mix: 1, duration: 0.9, ease: "power2.inOut", overwrite: true })
      }

      function hide() {
        state.visible = false
        gsap.to(box.current, { autoAlpha: 0, scale: 0.92, duration: 0.3, ease: "power2.out", overwrite: "auto" })
      }

      let time = 0
      function render(now, deltaMs) {
        if (covered()) return
        if (!state.visible && gsap.getProperty(box.current, "autoAlpha") === 0) return
        time = time + deltaMs / 1000
        speed.x = speed.x * 0.9
        speed.y = speed.y * 0.9
        gl.uniform2f(shader.uniform("uRes"), element.width, element.height)
        gl.uniform1f(shader.uniform("uTime"), time)
        gl.uniform1f(shader.uniform("uMix"), state.mix)
        gl.uniform2f(shader.uniform("uVel"), speed.x, -speed.y)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, textures[state.front])
        gl.uniform1i(shader.uniform("uA"), 0)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, textures[1 - state.front])
        gl.uniform1i(shader.uniform("uB"), 1)
        shader.draw()
        gsap.set(box.current, { rotation: speed.x * 6, skewX: speed.x * -4 })
      }
      gsap.ticker.add(render)

      controlRef.current = { show: show, hide: hide, place: place }
      return function () {
        gsap.ticker.remove(render)
        gsap.killTweensOf(state)
        gl.deleteTexture(textures[0])
        gl.deleteTexture(textures[1])
        controlRef.current = null
      }
    },
    [controlRef],
  )

  return (
    <div ref={box} className={s.melt} aria-hidden="true" style={{ width: WIDTH, height: HEIGHT }}>
      <canvas ref={canvas} />
    </div>
  )
}
