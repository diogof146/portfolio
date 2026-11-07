const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`

const SHADERS = {
  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`,
  advect: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 velTexel;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * velTexel;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,
  fade: `${HEAD}
uniform sampler2D uTexture;
uniform float value;
void main() {
  fragColor = value * texture(uTexture, vUv);
}`,
  display: `${HEAD}
uniform sampler2D uTexture;
uniform vec3 paper;
void main() {
  vec3 ink = max(texture(uTexture, vUv).rgb, 0.0);
  fragColor = vec4(paper * exp(-ink * 2.1), 1.0);
}`,
}

export const INKS = [
  [0.95, 0.24, 0.0],
  [0.9, 0.62, 0.18],
]

export function absorb(hex, paper) {
  const number = parseInt(hex.slice(1), 16)
  const channels = [number >> 16, (number >> 8) & 255, number & 255]
  const ink = []
  for (let i = 0; i < 3; i++) {
    const colour = Math.max(channels[i] / 255, 0.02)
    ink.push(-Math.log(colour / paper[i]) / 2.1)
  }
  return ink
}

export function createFluid(canvas, options) {
  const gl = canvas.getContext("webgl2", { alpha: false, depth: false, stencil: false, antialias: false })
  if (!gl) return null
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null

  const made = { shaders: [], programs: [], textures: [], framebuffers: [], buffers: [] }

  function compile(type, source) {
    const shader = gl.createShader(type)
    made.shaders.push(shader)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
  }

  function link(vertex, fragment) {
    const program = gl.createProgram()
    made.programs.push(program)
    gl.attachShader(program, vertex)
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.bindAttribLocation(program, 0, "aPosition")
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program))
    }
    const uniforms = {}
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i).name
      uniforms[name] = gl.getUniformLocation(program, name)
    }
    return { program: program, uniforms: uniforms }
  }

  const programs = {}
  try {
    const vertex = compile(gl.VERTEX_SHADER, VERTEX)
    for (const name in SHADERS) {
      programs[name] = link(vertex, SHADERS[name])
    }
  } catch (error) {
    console.warn("Fluid shaders failed:", error)
    return null
  }

  const buffer = gl.createBuffer()
  made.buffers.push(buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  function target(width, height, internalFormat, format, filter) {
    const texture = gl.createTexture()
    made.textures.push(texture)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.HALF_FLOAT, null)

    const framebuffer = gl.createFramebuffer()
    made.framebuffers.push(framebuffer)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    return {
      ok: ok,
      width: width,
      height: height,
      texel: [1 / width, 1 / height],
      framebuffer: framebuffer,
      bind: function (unit) {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        return unit
      },
    }
  }

  function pair(width, height, internalFormat, format, filter) {
    let first = target(width, height, internalFormat, format, filter)
    let second = target(width, height, internalFormat, format, filter)
    return {
      ok: first.ok && second.ok,
      read: function () {
        return first
      },
      write: function () {
        return second
      },
      swap: function () {
        const kept = first
        first = second
        second = kept
      },
    }
  }

  function sizeFor(resolution) {
    const aspect = canvas.width / canvas.height
    if (aspect >= 1) return [Math.round(resolution * aspect), resolution]
    return [resolution, Math.round(resolution / aspect)]
  }

  const simulationSize = sizeFor(options.simRes)
  const inkSize = sizeFor(options.dyeRes)
  const ink = pair(inkSize[0], inkSize[1], gl.RGBA16F, gl.RGBA, gl.LINEAR)
  const velocity = pair(simulationSize[0], simulationSize[1], gl.RG16F, gl.RG, gl.LINEAR)
  const divergence = target(simulationSize[0], simulationSize[1], gl.R16F, gl.RED, gl.NEAREST)
  const curl = target(simulationSize[0], simulationSize[1], gl.R16F, gl.RED, gl.NEAREST)
  const pressure = pair(simulationSize[0], simulationSize[1], gl.R16F, gl.RED, gl.NEAREST)
  if (!ink.ok || !velocity.ok || !pressure.ok || !divergence.ok || !curl.ok) return null

  function shader(name) {
    gl.useProgram(programs[name].program)
    return programs[name].uniforms
  }

  function blit(destination) {
    if (destination) {
      gl.viewport(0, 0, destination.width, destination.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination.framebuffer)
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function splat(x, y, dx, dy, colour, radius) {
    let u = shader("splat")
    gl.uniform1i(u.uTarget, velocity.read().bind(0))
    gl.uniform1f(u.aspectRatio, canvas.width / canvas.height)
    gl.uniform2f(u.point, x, y)
    gl.uniform3f(u.color, dx, dy, 0)
    gl.uniform1f(u.radius, radius)
    blit(velocity.write())
    velocity.swap()
    if (!colour) return

    u = shader("splat")
    gl.uniform1i(u.uTarget, ink.read().bind(0))
    gl.uniform3f(u.color, colour[0], colour[1], colour[2])
    blit(ink.write())
    ink.swap()
  }

  function step(dt) {
    const texel = velocity.read().texel

    let u = shader("curl")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform1i(u.uVelocity, velocity.read().bind(0))
    blit(curl)

    u = shader("vorticity")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform1i(u.uVelocity, velocity.read().bind(0))
    gl.uniform1i(u.uCurl, curl.bind(1))
    gl.uniform1f(u.curl, 22)
    gl.uniform1f(u.dt, dt)
    blit(velocity.write())
    velocity.swap()

    u = shader("divergence")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform1i(u.uVelocity, velocity.read().bind(0))
    blit(divergence)

    u = shader("fade")
    gl.uniform1i(u.uTexture, pressure.read().bind(0))
    gl.uniform1f(u.value, 0.8)
    blit(pressure.write())
    pressure.swap()

    u = shader("pressure")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform1i(u.uDivergence, divergence.bind(0))
    for (let i = 0; i < 20; i++) {
      gl.uniform1i(u.uPressure, pressure.read().bind(1))
      blit(pressure.write())
      pressure.swap()
    }

    u = shader("gradient")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform1i(u.uPressure, pressure.read().bind(0))
    gl.uniform1i(u.uVelocity, velocity.read().bind(1))
    blit(velocity.write())
    velocity.swap()

    u = shader("advect")
    gl.uniform2f(u.texelSize, texel[0], texel[1])
    gl.uniform2f(u.velTexel, texel[0], texel[1])
    gl.uniform1i(u.uVelocity, velocity.read().bind(0))
    gl.uniform1i(u.uSource, velocity.read().bind(0))
    gl.uniform1f(u.dt, dt)
    gl.uniform1f(u.dissipation, options.fade.velocity)
    blit(velocity.write())
    velocity.swap()

    const inkTexel = ink.read().texel
    gl.uniform2f(u.texelSize, inkTexel[0], inkTexel[1])
    gl.uniform1i(u.uVelocity, velocity.read().bind(0))
    gl.uniform1i(u.uSource, ink.read().bind(1))
    gl.uniform1f(u.dissipation, options.fade.ink)
    blit(ink.write())
    ink.swap()
  }

  function render() {
    const u = shader("display")
    const inkTexel = ink.read().texel
    gl.uniform2f(u.texelSize, inkTexel[0], inkTexel[1])
    gl.uniform1i(u.uTexture, ink.read().bind(0))
    gl.uniform3f(u.paper, options.paper[0], options.paper[1], options.paper[2])
    blit(null)
  }

  function destroy() {
    for (const framebuffer of made.framebuffers) gl.deleteFramebuffer(framebuffer)
    for (const texture of made.textures) gl.deleteTexture(texture)
    for (const program of made.programs) gl.deleteProgram(program)
    for (const shader of made.shaders) gl.deleteShader(shader)
    for (const buffer of made.buffers) gl.deleteBuffer(buffer)
  }

  return { splat: splat, step: step, render: render, destroy: destroy }
}
