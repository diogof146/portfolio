import { DUOTONE } from "@/gl/duotone"

export default function DuotoneFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues={DUOTONE.r.join(" ")} />
          <feFuncG type="table" tableValues={DUOTONE.g.join(" ")} />
          <feFuncB type="table" tableValues={DUOTONE.b.join(" ")} />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
