import { AboutCard } from "@/components/About";
import { Music } from "@/components/Music";
import { Games } from "@/components/Games";

export default function About() {
  return (
    <main>
      <section id="about" className="max-w-7xl mx-auto p-12">
        <div className="mb-6 text-center md:text-left">
          <AboutCard></AboutCard>
        </div>
        <div className="mb-6 text-center md:text-left">
          <Music></Music>
        </div>
        <div className="mb-6 text-center md:text-left">
          <Games></Games>
        </div>
      </section>
    </main>
  )
}
