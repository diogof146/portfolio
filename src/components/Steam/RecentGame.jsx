'use client';

import useSWR from 'swr';
import { Card } from "@/components/ui/card"
import { SteamLogoIcon } from "@phosphor-icons/react"

const fetcher = (url) => fetch(url).then((res) => res.json());

export function SteamCardSkeleton() {
  return (
    <Card className="p-6 shadow-sm border-border/50 flex flex-col items-center justify-center h-full opacity-50 min-h-[300px]">
      <SteamLogoIcon className="w-8 h-8 text-muted-foreground animate-pulse mb-3" />
      <p className="text-sm font-mono text-muted-foreground">Loading...</p>
    </Card>
  )
}

export function RecentGame() {
  const { data, isLoading } = useSWR('/api/steam/recent', fetcher, {
    refreshInterval: 60000,
  });

  if (isLoading || !data || data.error) {
    return (
      <Card className="p-6 shadow-sm border-border/50 flex flex-col items-center justify-center h-full opacity-50 min-h-[300px]">
        <SteamLogoIcon className="w-8 h-8 text-muted-foreground animate-pulse mb-3" />
        <p className="text-sm font-mono text-muted-foreground">Connecting to Steam...</p>
      </Card>
    );
  }

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block h-full group outline-none">
      <Card className="p-6 shadow-sm border-border/50 hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <SteamLogoIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold">
            {data.isPlaying ? "Currently Playing" : "Recently Played"}
          </h3>
        </div>

        <div className="overflow-hidden rounded-lg mb-5 border border-border/50 shadow-sm mx-auto group-hover:scale-105 transition-transform duration-500">
          <img
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-full object-cover" />
        </div>

        <div className="mt-auto">
          <p className="font-semibold text-foreground text-lg line-clamp-1">{data.title}</p>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            {data.isPlaying ? "Active session" : `${data.playtimeHours.toLocaleString()} hrs on record`}
          </p>
        </div>

      </Card>
    </a>
  );
}
