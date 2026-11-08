const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader))
  }
  return shader
}

export function fullscreenShader(canvas, fragment, options) {
  let derivatives = false
  if (options && options.derivatives) derivatives = true

  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false })
  if (!gl) return null
  if (derivatives && !gl.getExtension("OES_standard_derivatives")) return null

  try {
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program))
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "p")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const locations = {}
    function uniform(name) {
      if (!(name in locations)) {
        locations[name] = gl.getUniformLocation(program, name)
      }
      return locations[name]
    }

    function draw() {
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    return { gl: gl, uniform: uniform, draw: draw }
  } catch (error) {
    console.warn("Shader failed to build:", error)
    return null
  }
}

export function covered() {
  return document.documentElement.dataset.covered === "true"
}

export function autoSize(canvas, gl, scale) {
  function fit() {
    const density = Math.min(window.devicePixelRatio || 1, 1.5) * scale
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * density))
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * density))
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  fit()
  const observer = new ResizeObserver(fit)
  observer.observe(canvas)
  return function () {
    observer.disconnect()
  }
}

export const NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
`

export function makeTexture(gl) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([11, 55, 86, 255]))
  return texture
}

export function loadCover(src, aspect, width) {
  return new Promise(function (resolve, reject) {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.decoding = "async"
    image.onload = function () {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = Math.round(width / aspect)
      const context = canvas.getContext("2d")
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight)
      resolve(canvas)
    }
    image.onerror = reject
    if (src.startsWith("/")) {
      let size = 1080
      if (width <= 640) size = 640
      image.src = "/_next/image?url=" + encodeURIComponent(src) + "&w=" + size + "&q=75"
    } else {
      image.src = src
    }
  })
}
