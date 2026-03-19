"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Github, Linkedin } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname();

  const handleScroll = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };
  return (
    <nav className="flex items-center justify-between px-16 py-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <Link href="/"><span className="font-bold text-xl">Diogo Ferreira</span> </Link>

      <div className="hidden md:flex gap-8">
        <ThemeToggle></ThemeToggle>
        <Link href="/#about" onClick={(e) => handleScroll(e, "about")}>About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/#contact" onClick={(e) => handleScroll(e, "contact")}>Contact</Link>
      </div>

      <div className="md:hidden flex items-center">

        <Sheet>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-foreground/80 hover:text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col gap-6 pt-16 px-6">
            <Link href="/#about" onClick={(e) => handleScroll(e, "about")} className="text-lg font-medium hover:text-primary transition-colors">About</Link>
            <Link href="/projects" className="text-lg font-medium hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/#contact" onClick={(e) => handleScroll(e, "contact")} className="text-lg font-medium hover:text-primary transition-colors">Contact</Link>
            <div className="mt-auto flex w-full items-center justify-between border-t pb-6 pt-6">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Link href="https://github.com" target="_blank" className="hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
              <ThemeToggle />

            </div>
          </SheetContent>

        </Sheet>
      </div>
    </nav>
  )
}
