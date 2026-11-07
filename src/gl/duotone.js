export const DUOTONE = {
  r: [0.03, 0.0, 0.78],
  g: [0.14, 0.62, 0.95],
  b: [0.24, 0.88, 1.0],
}

export function toneAt(stops, grey) {
  const black = stops[0]
  const mid = stops[1]
  const white = stops[2]
  if (grey < 0.5) {
    return black + (mid - black) * grey * 2
  }
  return mid + (white - mid) * (grey - 0.5) * 2
}
