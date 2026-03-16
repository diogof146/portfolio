'use client';

import useSWR from 'swr';
import { Card } from "@/components/ui/card";

const SpotifyIcon = ({ className }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.302a.75.75 0 0 1-1.03.249c-2.814-1.72-6.357-2.108-10.53-1.153a.75.75 0 0 1-.336-1.462c4.567-1.044 8.484-.595 11.646 1.336a.75.75 0 0 1 .25 1.03zm1.47-3.264a.937.937 0 0 1-1.287.308c-3.22-1.98-8.125-2.553-11.93-1.397a.937.937 0 0 1-.543-1.79c4.35-1.32 9.75-.667 13.453 1.604a.937.937 0 0 1 .307 1.275zm.135-3.411c-3.86-2.292-10.233-2.503-13.918-1.385a1.125 1.125 0 1 1-.652-2.155c4.24-1.287 11.28-1.034 15.71 1.595a1.125 1.125 0 0 1-1.14 1.945z" />
  </svg>
);

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SpotifyCard() {
  const { data, isLoading } = useSWR('/api/spotify', fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading || !data) {
    return (
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4" />
        <h3 className="font-medium text-foreground text-sm uppercase tracking-wider">Loading...</h3>
      </Card>
    );
  }

  return (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4" />

        <h3 className="text-sm text-foreground">
          {data.isPlaying ? "Currently Listening" : "Top Track This Month"}
        </h3>

        <div style={{ width: 140, height: 140 }} className="overflow-hidden rounded-lg flex-none mx-auto mt-3">
          <img
            src={data.albumImageUrl}
            alt={data.title}
            className="w-full h-full object-cover shadow-md"
          />
        </div>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground font-mono line-clamp-1">
            {data.title}
          </p>
          <p className="text-xs text-muted-foreground/70 font-mono line-clamp-1">
            {data.artist}
          </p>
        </div>
      </Card>
    </a>
  );
}
