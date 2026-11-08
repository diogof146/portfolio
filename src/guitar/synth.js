function pluckBuffer(context, hz) {
  const rate = context.sampleRate
  const period = Math.max(2, Math.round(rate / hz))
  const length = Math.floor(rate * 2.2)
  const buffer = context.createBuffer(1, length, rate)
  const out = buffer.getChannelData(0)
  const line = new Float32Array(period)

  let previous = 0
  for (let i = 0; i < period; i++) {
    previous = previous * 0.7 + (Math.random() * 2 - 1) * 0.3
    line[i] = previous
  }

  let index = 0
  for (let i = 0; i < length; i++) {
    const a = line[index]
    const b = line[(index + 1) % period]
    out[i] = a
    line[index] = 0.4985 * (a + b)
    index = (index + 1) % period
  }
  return buffer
}

function clipCurve(hardness, bias) {
  const size = 4096
  const curve = new Float32Array(size)
  const norm = Math.tanh(hardness)
  for (let i = 0; i < size; i++) {
    const x = (i / (size - 1)) * 2 - 1
    let k = hardness
    if (x > 0) k = hardness * (1 + bias)
    curve[i] = Math.tanh(x * k) / norm
  }
  return curve
}

function roomImpulse(context, seconds) {
  const length = Math.floor(context.sampleRate * seconds)
  const impulse = context.createBuffer(2, length, context.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    let previous = 0
    for (let i = 0; i < length; i++) {
      previous = previous * 0.7 + (Math.random() * 2 - 1) * 0.3
      data[i] = previous * Math.pow(1 - i / length, 3)
    }
  }
  return impulse
}

function makeFilter(context, type, frequency, q = 0.7, gain = 0) {
  const filter = context.createBiquadFilter()
  filter.type = type
  filter.frequency.value = frequency
  filter.Q.value = q
  filter.gain.value = gain
  return filter
}

function makeGain(context, value) {
  const gain = context.createGain()
  gain.gain.value = value
  return gain
}

function makeShaper(context, curve) {
  const shaper = context.createWaveShaper()
  shaper.curve = curve
  shaper.oversample = "4x"
  return shaper
}

function chain(nodes) {
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].connect(nodes[i + 1])
  }
}

function buildAmps(context) {
  const room = context.createConvolver()
  room.buffer = roomImpulse(context, 0.6)
  chain([room, makeGain(context, 0.08), context.destination])

  const clean = makeGain(context, 0.3)
  const cleanOut = makeFilter(context, "lowpass", 6000)
  clean.connect(cleanOut)
  cleanOut.connect(context.destination)
  cleanOut.connect(room)

  const level = makeGain(context, 0.075)
  level.connect(context.destination)
  level.connect(room)

  function drive(pan) {
    const input = makeGain(context, 1)
    const side = context.createStereoPanner()
    side.pan.value = pan
    chain([
      input,
      makeFilter(context, "lowpass", 2600, 0.5),
      makeFilter(context, "highpass", 120),
      makeFilter(context, "peaking", 750, 0.6, 4),
      makeGain(context, 9),
      makeShaper(context, clipCurve(1.8, 0.3)),
      makeFilter(context, "lowpass", 6000),
      makeGain(context, 2.2),
      makeShaper(context, clipCurve(1.4, 0)),
      makeFilter(context, "highpass", 80),
      makeFilter(context, "peaking", 110, 0.9, 3),
      makeFilter(context, "peaking", 500, 1, -5),
      makeFilter(context, "lowpass", 4000, 0.6),
      makeFilter(context, "lowpass", 3600, 0.7),
      side,
      level,
    ])
    return input
  }

  return { clean: [clean], drive: [drive(-0.8), drive(0.8)] }
}

function noteLength(mute, curve) {
  if (mute) return 0.16
  let bent = 0
  if (curve.length > 0) bent = curve[curve.length - 1].at
  return Math.max(0.85, bent + 0.45)
}

function bend(source, curve, start, offset) {
  let from = start
  let value = offset
  for (const point of curve) {
    const at = start + point.at
    source.detune.setValueAtTime(value, Math.max(from, at - 0.07))
    value = offset + point.semis * 100
    source.detune.linearRampToValueAtTime(value, at)
    from = at
  }
}

export function createGuitar() {
  let context = null
  let amps = null
  const buffers = new Map()
  const voices = new Set()

  function setup() {
    if (context === null) {
      context = new window.AudioContext()
      amps = buildAmps(context)
    } else if (context.state === "suspended") {
      context.resume()
    }
    return context
  }

  function pluck(hz, { when = 0, tone = "clean", mute = false, curve = [] } = {}) {
    setup()
    const key = Math.round(hz * 100)
    if (!buffers.has(key)) buffers.set(key, pluckBuffer(context, hz))

    let outs = amps[tone]
    if (!outs) outs = amps.clean

    for (let take = 0; take < outs.length; take++) {
      const source = context.createBufferSource()
      source.buffer = buffers.get(key)
      const envelope = context.createGain()

      let start = context.currentTime + when
      let offset = 0
      if (take > 0) {
        start = start + 0.012 + Math.random() * 0.01
        offset = 4 + Math.random() * 5
      }
      source.detune.setValueAtTime(offset, start)
      bend(source, curve, start, offset)

      let node = source
      if (mute) {
        const dark = makeFilter(context, "lowpass", 1100)
        source.connect(dark)
        node = dark
      }
      chain([node, envelope, outs[take]])
      source.start(start)

      if (tone === "drive") {
        const length = noteLength(mute, curve)
        envelope.gain.setValueAtTime(1, start)
        envelope.gain.setValueAtTime(1, start + length * 0.4)
        envelope.gain.exponentialRampToValueAtTime(0.001, start + length)
        source.stop(start + length + 0.05)
      }

      voices.add(source)
      source.onended = function () {
        voices.delete(source)
      }
    }
  }

  function now() {
    return setup().currentTime
  }

  function stop() {
    for (const voice of voices) voice.stop()
    voices.clear()
  }

  return { pluck: pluck, now: now, stop: stop }
}
