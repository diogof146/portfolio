import { AboutCard } from "@/components/About";
import { Music } from "@/components/Music";
import { Games } from "@/components/Games";

export default function About() {
  return (
    <main>
      <section id="about" className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto mb-6 text-center md:text-left">
          <AboutCard></AboutCard>
        </div>
      </section>

      <section id="about" className="w-full py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto mb-6 text-center md:text-left">
          <Music></Music>
        </div>
      </section>

      <section id="about" className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto mb-6 text-center md:text-left">
          <Games></Games>
        </div>
      </section>
    </main >
  )
}
