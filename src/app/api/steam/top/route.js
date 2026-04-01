import { NextResponse } from "next/server";
import { getOwnedGames } from "@/lib/steam";

export async function GET() {
  try {
    const response = await getOwnedGames();
    const data = await response.json();
    const games = data.response.games;

    if (!games || games.length === 0) {
      return NextResponse.json({ error: "No games found" }, { status: 404 });
    }

    const topGame = games
      .filter((game) => game.playtime_forever > 0)
      .sort((a, b) => b.playtime_forever - a.playtime_forever)[0];

    return NextResponse.json({
      title: topGame.name,
      playtimeHours: Math.round(topGame.playtime_forever / 60),
      url: `https://store.steampowered.com/app/${topGame.appid}`,
      imageUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${topGame.appid}/header.jpg`,
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Steam data" }, { status: 500 });
  }
}
