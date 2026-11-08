import gsap from "gsap"
import { covered, fullscreenShader, loadCover, makeTexture } from "@/gl/gl"

const DURATION_IN = 1.5
const DURATION_OUT = 0.9

export function sharedRenderer(fragment) {
  const items = new Set()
  let shared = undefined
  let time = 0

  function boot() {
    if (shared !== undefined) return shared
    const canvas = document.createElement("canvas")
    const shader = fullscreenShader(canvas, fragment)
    if (!shader) {
      shared = null
      return shared
    }
    shader.gl.pixelStorei(shader.gl.UNPACK_FLIP_Y_WEBGL, true)
    shared = { gl: shader.gl, uniform: shader.uniform, draw: shader.draw, canvas: canvas }
    return shared
  }

  function paint(item) {
    const gl = shared.gl
    const width = item.canvas.width
    const height = item.canvas.height
    if (shared.canvas.width < width || shared.canvas.height < height) {
      shared.canvas.width = Math.max(shared.canvas.width, width)
      shared.canvas.height = Math.max(shared.canvas.height, height)
    }
    gl.viewport(0, 0, width, height)
    gl.uniform2f(shared.uniform("uRes"), width, height)
    gl.uniform1f(shared.uniform("uP"), item.progress)
    gl.uniform2f(shared.uniform("uOrigin"), item.originX, item.originY)
    gl.uniform1f(shared.uniform("uTime"), time)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, item.texture)
    gl.uniform1i(shared.uniform("uImg"), 0)
    shared.draw()
    item.context.drawImage(shared.canvas, 0, shared.canvas.height - height, width, height, 0, 0, width, height)
  }

  function tick(now, deltaMs) {
    if (covered()) return
    time = time + Math.min(deltaMs, 50) / 1000
    for (const item of items) {
      if (!item.texture || !item.inView) continue
      const busy = item.progress > 0.001 && item.progress < 0.999
      if (!item.dirty && !busy) continue
      item.dirty = false
      const on = item.progress > 0.001
      if (on !== item.on) {
        item.on = on
        item.canvas.dataset.on = String(on)
      }
      if (on) paint(item)
    }
  }

  return function register(canvas, src, watch, onReady) {
    if (!boot()) return null

    const item = {
      canvas: canvas,
      context: canvas.getContext("2d"),
      texture: null,
      progress: 0,
      originX: 0.5,
      originY: 0,
      dirty: true,
      on: false,
      inView: false,
      tween: null,
    }
    if (items.size === 0) gsap.ticker.add(tick)
    items.add(item)

    function fit() {
      const density = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * density))
      const height = Math.max(1, Math.round(canvas.clientHeight * density))
      if (width === canvas.width && height === canvas.height) return
      canvas.width = width
      canvas.height = height
      item.dirty = true
    }
    fit()
    const resizer = new ResizeObserver(fit)
    resizer.observe(canvas)

    let loading = false
    function load() {
      if (loading) return
      loading = true
      const aspect = canvas.clientWidth / canvas.clientHeight || 4 / 3
      loadCover(src, aspect, Math.min(1080, Math.max(320, canvas.width)))
        .then(function (picture) {
          if (!items.has(item)) return
          const gl = shared.gl
          item.texture = makeTexture(gl)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture)
          item.dirty = true
          onReady()
        })
        .catch(function () {})
    }

    const visibility = new IntersectionObserver(
      function (entries) {
        item.inView = entries[0].isIntersecting
        if (!item.inView) return
        load()
        item.dirty = true
      },
      { rootMargin: "400px" },
    )
    visibility.observe(watch)

    function markDirty() {
      item.dirty = true
    }

    return {
      develop: function (on, at) {
        if (at && item.progress < 0.02) {
          item.originX = at.x
          item.originY = 1 - at.y
        }
        if (item.tween) item.tween.kill()
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let target = 0
        let duration = DURATION_OUT
        let ease = "power2.inOut"
        if (on) {
          target = 1
          duration = DURATION_IN
          ease = "power1.out"
        }
        if (reduce) duration = 0
        item.tween = gsap.to(item, { progress: target, duration: duration, ease: ease, onUpdate: markDirty })
      },
      set: function (progress) {
        if (item.tween) item.tween.kill()
        item.progress = progress
        markDirty()
      },
      destroy: function () {
        if (item.tween) item.tween.kill()
        items.delete(item)
        if (items.size === 0) gsap.ticker.remove(tick)
        resizer.disconnect()
        visibility.disconnect()
        if (item.texture) shared.gl.deleteTexture(item.texture)
      },
    }
  }
}
