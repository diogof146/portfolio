import { NextResponse } from "next/server";
import { getPlayerSummaries, getOwnedGames } from "@/lib/steam";

export async function GET() {
  try {
    const summaryResponse = await getPlayerSummaries();
    const summaryData = await summaryResponse.json();
    const player = summaryData.response.players[0];

    if (player && player.gameextrainfo) {
      return NextResponse.json({
        isPlaying: true,
        title: player.gameextrainfo,
        url: `https://store.steampowered.com/app/${player.gameid}`,
        imageUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${player.gameid}/header.jpg`,
      });
    }

    const gamesResponse = await getOwnedGames();
    const gamesData = await gamesResponse.json();
    const games = gamesData.response.games;

    if (!games || games.length === 0) {
      return NextResponse.json({ error: "No games found" }, { status: 404 });
    }

    const lastPlayed = games
      .filter((game) => game.rtime_last_played > 0)
      .sort((a, b) => b.rtime_last_played - a.rtime_last_played)[0];

    return NextResponse.json({
      isPlaying: false,
      title: lastPlayed.name,
      playtimeHours: Math.round(lastPlayed.playtime_forever / 60),
      url: `https://store.steampowered.com/app/${lastPlayed.appid}`,
      imageUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${lastPlayed.appid}/header.jpg`,
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Steam data" }, { status: 500 });
  }
}
