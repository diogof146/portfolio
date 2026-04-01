import { Card } from "@/components/ui/card";

const SpotifyIcon = ({ className }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.302a.75.75 0 0 1-1.03.249c-2.814-1.72-6.357-2.108-10.53-1.153a.75.75 0 0 1-.336-1.462c4.567-1.044 8.484-.595 11.646 1.336a.75.75 0 0 1 .25 1.03zm1.47-3.264a.937.937 0 0 1-1.287.308c-3.22-1.98-8.125-2.553-11.93-1.397a.937.937 0 0 1-.543-1.79c4.35-1.32 9.75-.667 13.453 1.604a.937.937 0 0 1 .307 1.275zm.135-3.411c-3.86-2.292-10.233-2.503-13.918-1.385a1.125 1.125 0 1 1-.652-2.155c4.24-1.287 11.28-1.034 15.71 1.595a1.125 1.125 0 0 1-1.14 1.945z" />
  </svg>
);


export async function SpotifyTopSong() {
  const response = await fetch(process.env.APP_URL + "/api/spotify/top");
  if (!response.ok) return null;
  const data = await response.json();

  if (!data) {
    return (
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4 animate-pulse" />
        <h3 className="font-medium text-foreground text-sm uppercase tracking-wider">Loading...</h3>
      </Card>
    );
  }

  return (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors h-full">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4" />
        <h3 className="text-sm text-foreground">Top Track</h3>

        <div style={{ width: 140, height: 140 }} className="overflow-hidden rounded-lg flex-none mx-auto mt-3">
          <img src={data.albumImageUrl} alt={data.title} className="w-full h-full object-cover shadow-md" />
        </div>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground font-mono line-clamp-1">{data.title}</p>
          <p className="text-xs text-muted-foreground/70 font-mono line-clamp-1">{data.artist}</p>
        </div>
      </Card>
    </a>
  );
}

export async function SpotifyPlaylist() {
  const response = await fetch(process.env.APP_URL + "/api/spotify/playlist");
  if (!response.ok) return null;
  const data = await response.json();

  if (!data) {
    return (
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4 animate-pulse" />
        <h3 className="font-medium text-foreground text-sm uppercase tracking-wider">Loading...</h3>
      </Card>
    );
  }

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors h-full">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4" />
        <h3 className="text-sm text-foreground">Top Playlist</h3>

        <div style={{ width: 140, height: 140 }} className="overflow-hidden rounded-lg flex-none mx-auto mt-3">
          <img src={data.imageURL} alt={data.title} className="w-full h-full object-cover shadow-md" />
        </div>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground font-mono line-clamp-1">{data.title}</p>
          <p className="text-xs text-muted-foreground/70 font-mono line-clamp-1">Playlist</p>
        </div>
      </Card>
    </a>
  );
}

export async function SpotifyTopArtists() {
  const response = await fetch(process.env.APP_URL + "/api/spotify/artists");
  if (!response.ok) return null;
  const data = await response.json();

  if (!data) {
    return (
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center bg-card hover:border-primary/50 transition-colors">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4 animate-pulse" />
        <h3 className="font-medium text-foreground text-sm uppercase tracking-wider">Loading...</h3>
      </Card>
    );
  }

  const topArtist = data[0];
  const artists = data.slice(1);

  return (
    <Card className="md:col-span-3 p-0 bg-card hover:border-primary/50 transition-colors shadow-sm overflow-hidden h-full flex flex-col">

      <div className="flex flex-col items-center justify-center w-full mt-6">
        <SpotifyIcon className="w-8 h-8 text-muted-foreground mb-4" />
        <h3 className="text-sm text-foreground">Top Artists</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full flex-1">

        <div className="p-8 pt-4 flex flex-col items-center justify-center text-center">
          <a href={topArtist.url} target="_blank" rel="noopener noreferrer" className="group">
            <div style={{ width: 140, height: 140 }} className="overflow-hidden rounded-lg shadow-md border border-border group-hover:border-primary/50 transition-colors">
              <img src={topArtist.image} alt={topArtist.name} className="w-full h-full object-cover" />
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground font-mono line-clamp-1">{topArtist.name}</p>
              <p className="text-xs text-muted-foreground/70 font-mono line-clamp-1">#1 Most Played</p>
            </div>
          </a>
        </div>

        <div className="md:col-span-2 p-8 pt-4 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full max-w-md">
            {artists.map((artist, index) => (
              <a
                key={index}
                href={artist.url}
                className="flex items-center gap-3 group min-w-0"
              >
                <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 py-6">
                  {index + 2}
                </span>
                <div style={{ width: 40, height: 40 }} className="overflow-hidden rounded-full shrink-0 border border-border">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-mono truncate">
                    {artist.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
