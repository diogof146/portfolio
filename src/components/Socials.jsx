import { Gamepad2, Github, Instagram, Linkedin } from "lucide-react"
import { links } from "@/content/site"
import s from "./Socials.module.css"

const ICONS = { GitHub: Github, LinkedIn: Linkedin, "itch.io": Gamepad2, Instagram: Instagram }

export default function Socials({ size = 17 }) {
  return (
    <div className={s.socials}>
      {links.map((link) => {
        const Icon = ICONS[link.name]
        return (
          <a key={link.name} href={link.url} target="_blank" rel="noreferrer" aria-label={link.name}>
            <Icon size={size} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}
