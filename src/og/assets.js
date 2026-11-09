import { readFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"
import { DUOTONE, toneAt } from "@/gl/duotone"

const FONTS = join(process.cwd(), "src/og/fonts")
const IMAGES = join(process.cwd(), "src/content/images")

export async function loadFonts() {
  const display = await readFile(join(FONTS, "archivo-expanded-800.ttf"))
  const mono = await readFile(join(FONTS, "martian-mono-400.ttf"))
  return [
    { name: "Archivo", data: display, weight: 800, style: "normal" },
    { name: "Martian Mono", data: mono, weight: 400, style: "normal" },
  ]
}

export function fileOf(image) {
  const hashed = image.src.split("/").pop()
  const parts = hashed.split(".")
  return join(IMAGES, parts[0] + "." + parts[parts.length - 1])
}

export const PORTRAIT = join(IMAGES, "portrait.webp")
export const OFF_THE_CLOCK = join(process.cwd(), "public/videos/off-the-clock.jpg")

export async function printFrom(file, width, height, fit) {
  const { data, info } = await sharp(file)
    .resize(width, height, { fit: fit, position: "top" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const grey = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
    data[i] = Math.round(toneAt(DUOTONE.r, grey) * 255)
    data[i + 1] = Math.round(toneAt(DUOTONE.g, grey) * 255)
    data[i + 2] = Math.round(toneAt(DUOTONE.b, grey) * 255)
  }

  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  return { src: "data:image/png;base64," + png.toString("base64"), width: info.width, height: info.height }
}
