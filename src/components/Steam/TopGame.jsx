import { Card } from "@/components/ui/card"
import { SteamLogoIcon } from "@phosphor-icons/react/dist/ssr"

export async function TopGame() {
  const response = await fetch(process.env.APP_URL + "/api/steam/top", { next: { revalidate: 86400 } }).catch(() => null)
  if (!response || !response.ok) return null;
  const data = await response.json();

  if (!data || data.error) return null;

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block h-full group outline-none">
      <Card className="p-6 shadow-sm border-border/50 hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full gap-6">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <SteamLogoIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Most Played Game</h3>
        </div>

        <div className="overflow-hidden rounded-lg mb-5 border border-border/50 shadow-sm mx-auto group-hover:scale-105 transition-transform duration-500">
          <img
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-full object-cover" />
        </div>

        <div className="mt-auto">
          <p className="font-semibold text-foreground text-lg line-clamp-1">{data.title}</p>
          <p className="text-muted-foreground text-sm font-mono mt-1">{data.playtimeHours.toLocaleString()} hrs on record</p>
        </div>

      </Card>
    </a>
  );
}
