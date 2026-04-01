import { Card } from "@/components/ui/card"
import { SteamLogoIcon } from "@phosphor-icons/react/dist/ssr"
import { RecentGame } from "@/components/Steam/RecentGame"
import { TopGame } from "@/components/Steam/TopGame"

export function Games() {
  return (
    <section id="games" className="py-24 max-w-7xl mx-auto px-6">

      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-semibold tracking-wider text-sm">Steam</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">My Games</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

        <TopGame></TopGame>
        <RecentGame></RecentGame>

      </div>
    </section>

  )
}
