import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import LikeButton from "./LikeButton"
import { getLikeCount } from "@/lib/actions"

export default async function Footer() {
  const likeCount = await getLikeCount()
  return (
    <footer className="border-t border-border/50 py-6 w-full relative px-6">
      <div className="px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="md:hidden">
          <LikeButton initialCount={likeCount} />
        </div>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          © {new Date().getFullYear()} Diogo Ferreira
        </p>
        <div className="flex gap-5 text-muted-foreground relative z-20">
          <Link href="https://github.com/diogof146" target="_blank" className="hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </Link>
          <Link href="https://linkedin.com/in/diogof146" target="_blank" className="hover:text-foreground transition-colors">
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="hidden md:flex absolute inset-0 items-center justify-center z-10">
        <LikeButton initialCount={likeCount} />
      </div>
    </footer>
  )
}
