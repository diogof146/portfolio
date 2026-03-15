import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-6 mt-16 w-full">
      <div className="px-16 flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Diogo Ferreira. All rights reserved.
        </p>

        <div className="flex gap-5 text-muted-foreground">
          <Link href="https://github.com/diogof146" target="_blank" className="hover:text-foreground transition-colors">
            <span className="sr-only">GitHub</span>
            <Github className="w-5 h-5" />
          </Link>
          <Link href="https://linkedin.com/in/diogof146" target="_blank" className="hover:text-foreground transition-colors">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </footer>
  )
}
