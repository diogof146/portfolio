export function tile(count, width, height, gap, master = 0.6) {
  if (count <= 0) return []
  if (count === 1) return [{ x: 0, y: 0, w: width, h: height }]

  const mainWidth = Math.round((width - gap) * master)
  const stackWidth = width - gap - mainWidth
  const stackHeight = (height - gap * (count - 2)) / (count - 1)
  const rects = [{ x: 0, y: 0, w: mainWidth, h: height }]
  for (let i = 0; i < count - 1; i++) {
    rects.push({ x: mainWidth + gap, y: Math.round(i * (stackHeight + gap)), w: stackWidth, h: Math.round(stackHeight) })
  }
  return rects
}

export function mainLayout(count, width, height, gap) {
  if (count !== 5) return tile(count, width, height, gap, 0.5)

  const left = Math.round((width - gap) / 2)
  const x = left + gap
  const right = width - x
  const free = height - gap * 2
  const top = Math.round(free * 0.36)
  const middle = Math.round(free * 0.3)
  const half = Math.round((right - gap) / 2)
  return [
    { x: 0, y: 0, w: left, h: height },
    { x: x, y: 0, w: right, h: top },
    { x: x, y: top + gap, w: half, h: middle },
    { x: x + half + gap, y: top + gap, w: right - half - gap, h: middle },
    { x: x, y: top + middle + gap * 2, w: right, h: height - top - middle - gap * 2 },
  ]
}
