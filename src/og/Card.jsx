export const SIZE = { width: 1200, height: 630 }

const BLUE = "#0b3756"
const PAPER = "#f4f8fa"
const CYAN = "#00aeef"
const LIGHT = "#bfeefc"
const PAD = 64
const CHAR = 0.9

const mono = { fontFamily: "Martian Mono", fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: LIGHT }

function unbreakable(lines) {
  if (lines.length > 1) return lines
  return lines[0].split(" ")
}

function titleSize(lines, room, largest) {
  let longest = 1
  for (const piece of unbreakable(lines)) {
    if (piece.length > longest) longest = piece.length
  }
  return Math.min(largest, Math.floor(room / (longest * CHAR)))
}

export default function Card({ label, lines, lead, status, side, sideWidth }) {
  const room = SIZE.width - sideWidth - PAD * 2
  const size = titleSize(lines, room, 124)

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: BLUE, color: PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: SIZE.width - sideWidth, padding: PAD }}>
        <div style={{ display: "flex", ...mono }}>{label}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo", fontSize: size, lineHeight: 0.92, letterSpacing: -0.02 * size, textTransform: "uppercase" }}>
            {lines.map(function (line) {
              return (
                <div key={line} style={{ display: "flex" }}>
                  {line}
                </div>
              )
            })}
          </div>
          {lead && <div style={{ display: "flex", ...mono, fontSize: 24, letterSpacing: 0, textTransform: "none", color: PAPER, lineHeight: 1.4 }}>{lead}</div>}
          {status && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, ...mono }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: CYAN }} />
              <div style={{ display: "flex" }}>{status}</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", ...mono, fontSize: 18 }}>
          <div style={{ display: "flex" }}>Diogo Ferreira</div>
          <div style={{ display: "flex" }}>diogof146.com</div>
        </div>
      </div>
      <div style={{ display: "flex", width: sideWidth, height: SIZE.height, alignItems: "flex-end", justifyContent: "center", borderLeft: "2px solid " + CYAN }}>
        {side}
      </div>
    </div>
  )
}
