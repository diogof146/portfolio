import SpotifyCard from "@/components/SpotifyCard"
import { Card } from "@/components/ui/card"
import { Terminal, Gamepad2, Headphones, GuitarIcon, Dumbbell, ChessPawn, BookHeadphones } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10">
          <span className="text-primary font-semibold tracking-wider text-sm">A Bit About Me</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">My Interests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="md:col-span-2 p-8 shadow-sm">
            <div className="flex flex-col gap-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a Junior Software Engineer with a passion for exploring and learning about various tech areas. Currently game development peaks my interest.<br />
                Always open to learn, collaborate and connect with others who share similar passions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <Terminal className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Unix Customization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gamepad2 className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Gaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <GuitarIcon className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Playing Guitar</span>
                </div>
                <div className="flex items-center gap-3">
                  <ChessPawn className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Playing Chess</span>
                </div>
                <div className="flex items-center gap-3">
                  <Dumbbell className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Gym</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookHeadphones className="text-primary w-5 h-5" />
                  <span className="text-foreground text-base">Reading Manga</span>
                </div>
              </div>
            </div>
          </Card>

          <SpotifyCard></SpotifyCard>

        </div>
      </div>
    </section>
  )
}
