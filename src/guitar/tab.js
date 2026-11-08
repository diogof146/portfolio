const SEMITONE = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 }
const STRING_LINE = /^[A-Ga-g][#b]?\s*\|/
const PM_LINE = /^PM\s*\|/i
const CHUG_SECONDS = 0.16

export function noteHz(name) {
  const match = name.match(/^([A-G][#b]?)(-?\d)$/)
  const midi = 12 * (Number(match[2]) + 1) + SEMITONE[match[1]]
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function noteName(name) {
  return name.replace(/-?\d$/, "")
}

function body(line) {
  return line
    .slice(line.indexOf("|") + 1)
    .replaceAll("|", "")
    .trimEnd()
}

function readBlocks(text, stringCount) {
  const rows = []
  for (let i = 0; i < stringCount; i++) rows.push("")
  let mute = ""
  let pending = null
  let block = []

  function flush() {
    if (block.length === 0) return
    let width = 0
    if (pending !== null) width = pending.length
    for (const line of block) width = Math.max(width, line.length)
    for (let i = 0; i < block.length; i++) rows[i] = rows[i] + block[i].padEnd(width, "-")
    let marks = ""
    if (pending !== null) marks = pending
    mute = mute + marks.padEnd(width, "-")
    block = []
    pending = null
  }

  for (const raw of text.split("\n")) {
    const line = raw.trim()
    if (PM_LINE.test(line)) {
      pending = body(line)
    } else if (STRING_LINE.test(line)) {
      block.push(body(line))
      if (block.length === stringCount) flush()
    }
  }
  flush()

  return { rows: rows, mute: mute, marked: /[^-\s]/.test(mute) }
}

function digitsAt(row, index) {
  const match = row.slice(index).match(/^\d{1,2}/)
  if (match === null) return null
  return match[0]
}

function isMarked(mute, step) {
  const mark = mute[step]
  return mark !== undefined && mark !== "-" && mark !== " "
}

function parseTab(text, stringCount) {
  const blocks = readBlocks(text, stringCount)
  const notes = []
  let steps = 0

  for (let string = 0; string < blocks.rows.length; string++) {
    const row = blocks.rows[string]
    steps = Math.max(steps, row.length)
    let ringing = null
    for (let step = 0; step < row.length; step++) {
      const char = row[step]
      if (char >= "0" && char <= "9") {
        const digits = digitsAt(row, step)
        ringing = { string: string, step: step, fret: Number(digits), curve: [], mute: blocks.marked && isMarked(blocks.mute, step) }
        notes.push(ringing)
        step = step + digits.length - 1
      } else if ((char === "b" || char === "r") && ringing !== null) {
        const digits = digitsAt(row, step + 1)
        let semis = 0
        if (digits !== null) {
          semis = Number(digits) - ringing.fret
        } else if (char === "b") {
          semis = 2
        }
        ringing.curve.push({ step: step, semis: semis })
        if (digits !== null) step = step + digits.length
      }
    }
  }

  notes.sort(function (a, b) {
    return a.step - b.step
  })
  return { rows: blocks.rows, notes: notes, steps: steps, marked: blocks.marked }
}

function isChug(notes, index, stringCount, perStep) {
  const note = notes[index]
  if (note.string < stringCount - 2) return false
  for (let k = index + 1; k < notes.length; k++) {
    if (notes[k].step > note.step) return (notes[k].step - note.step) * perStep <= CHUG_SECONDS
  }
  return false
}

export function parseRiff(riff) {
  const stringCount = riff.strings.length
  const notes = []
  const parts = []
  const rows = []
  for (let i = 0; i < stringCount; i++) rows.push("")
  let steps = 0
  let duration = 0

  for (const part of riff.parts) {
    parts.push({ step: steps, time: duration, perStep: part.step })
    const parsed = parseTab(part.tab, stringCount)
    for (let i = 0; i < stringCount; i++) rows[i] = rows[i] + parsed.rows[i].padEnd(parsed.steps, "-")
    for (let k = 0; k < parsed.notes.length; k++) {
      const note = parsed.notes[k]
      const curve = []
      for (const point of note.curve) {
        curve.push({ at: (point.step - note.step) * part.step, semis: point.semis })
      }
      let mute = note.mute
      if (!parsed.marked) mute = isChug(parsed.notes, k, stringCount, part.step)
      notes.push({
        string: note.string,
        fret: note.fret,
        mute: mute,
        curve: curve,
        step: steps + note.step,
        time: duration + note.step * part.step,
      })
    }
    steps = steps + parsed.steps
    duration = duration + parsed.steps * part.step
  }

  function stepAt(time) {
    let current = parts[0]
    for (const part of parts) {
      if (time >= part.time) current = part
    }
    return Math.min(steps, current.step + (time - current.time) / current.perStep)
  }

  return { rows: rows, notes: notes, steps: steps, duration: duration, stepAt: stepAt }
}
