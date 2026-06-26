import { Button } from "@/components/ui/button"
import { Github, Instagram, Linkedin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { TerminalButton } from "@/components/TerminalButton"
import { Gamepad2 } from "lucide-react"

export default function Hero() {
  return (
    <div className="bg-muted/30 py-24">


      < section className="grid grid-cols-1 md:grid-cols-3 items-center justify-between min-h-[60vh] max-w-7xl mx-auto px-6 py-12 gap-6 md:gap-12" >

        <div className="text-center md:text-left order-2 md:order-1">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight"> Hi, I'm Diogo</h1>

          <p className="text-xl text-muted-foreground mt-4">Junior Software Engineer</p>

          <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="https://github.com/diogof146" target="_blank" rel="noreferrer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/diogof146" target="_blank" rel="noreferrer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://www.instagram.com/diogof146" target="_blank" rel="noreferrer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://diogof146.itch.io" target="_blank" rel="noreferrer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Gamepad2 className="h-5 w-5" />
              </Button>
            </a>
            <TerminalButton variant={"button"}></TerminalButton>

          </div>
        </div>

        <div className="flex items-center justify-center col-span-2 order-1 md:order-2 w-full max-w-3xl mx-auto">
          <a href="/about">
            <img
              src="/images/me.png"
              alt="Diogo Ferreira"
              className="w-full rounded-3xl object-cover shadow-md"
            />
          </a>
        </div>

      </section >

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Link href="/about">
          <Card className="group flex flex-col sm:flex-row items-center justify-between p-8 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="text-xl font-bold text-foreground">More About Me</h3>
              <p className="text-muted-foreground">Discover my interests, music and more.</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
