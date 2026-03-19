import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FeaturedProjects() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">


        <div className="mb-10 text-center md:text-left">
          <span className="text-primary font-semibold tracking-wider text-sm">Experience</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Projects</h2>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md aspect-4/3 transition-all cursor-pointer">
            <img
              src="/images/acc.png"
              alt="Animal Care Centre"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 w-full p-6 md:p-8 flex flex-col gap-1 z-10">
              <h3 className="text-white font-bold text-xl md:text-2xl">Animal Care Centre</h3>
              <p className="text-gray-300 font-medium text-sm">REST API • Spring Boot • MySQL</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md aspect-4/3 transition-all cursor-pointer">
            <img
              src="/images/neovim.png"
              alt="Neovim Configuration"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 w-full p-6 md:p-8 flex flex-col gap-1 z-10">
              <h3 className="text-white font-bold text-xl md:text-2xl">Neovim Configuration</h3>
              <p className="text-gray-300 font-medium text-sm">Lua • Neovim • Unix</p>
            </div>
          </div>

        </div>

        <div className="mt-12">
          <Link href="/projects">
            <Card className="group flex flex-col sm:flex-row items-center justify-between p-8 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h3 className="text-xl font-bold text-foreground">View Full Archive</h3>
                <p className="text-muted-foreground">Explore all my applications, configurations, and games.</p>
              </div>

              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

    </section>
  )
}
