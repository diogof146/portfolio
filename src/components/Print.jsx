import Image from "next/image"
import s from "./Print.module.css"

export default function Print({ src, sizes, alt = "", preload = false, children }) {
  return (
    <div className={s.print}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" preload={preload} className={s.base} />
      <Image src={src} alt="" aria-hidden="true" fill sizes={sizes} loading={preload ? "eager" : "lazy"} className={s.colour} />
      <span className={s.sweep} aria-hidden="true" />
      {children}
    </div>
  )
}
