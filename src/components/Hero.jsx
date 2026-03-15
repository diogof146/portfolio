import { Button } from "@/components/ui/button"
import { Github, Instagram, Linkedin } from "lucide-react"

export default function Hero() {
  return (

    <section className="grid grid-cols-1 md:grid-cols-3 items-center justify-between min-h-[60vh] max-w-7xl mx-auto px-6 py-12 gap-6 md:gap-12">

      <div className="text-center md:text-left order-2 md:order-1">
        <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight"> Hi, I'm Diogo</h1>

        <p className="text-xl text-muted-foreground mt-4">Junior Software Engineer</p>

        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="https://github.com/diogof146" target="_blank" rel="noreferrer">
            <Button variant="outline" size="icon" className="rounded-full">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/diogof146" target="_blank" rel="noreferrer">
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://www.instagram.com/diogof146" target="_blank" rel="noreferrer">
            <Button variant="outline" size="icon" className="rounded-full">
              <Instagram className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center col-span-2 order-1 md:order-2 w-full max-w-3xl mx-auto">
        <img
          src="/images/me.png"
          alt="Diogo Ferreira"
          className="w-full rounded-3xl object-cover shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
        />
      </div>
    </section>
  )
}
