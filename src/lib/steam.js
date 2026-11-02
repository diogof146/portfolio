import { cacheLife } from "next/cache";
import { connection } from "next/server";

const API = "https://api.steampowered.com";
const KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

async function steam(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Steam: " + res.status);
  }
  return await res.json();
}

function toGame(appid, title, minutes) {
  let hours = null;
  if (minutes !== undefined) {
    hours = Math.round(minutes / 60);
  }
  return {
    title: title,
    hours: hours,
    url: "https://store.steampowered.com/app/" + appid,
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/" + appid + "/header.jpg",
  };
}

async function fetchOwnedGames() {
  "use cache";
  cacheLife("hours");
  const data = await steam(
    API + "/IPlayerService/GetOwnedGames/v0001/?key=" + KEY + "&steamid=" + STEAM_ID + "&include_appinfo=1&include_played_free_games=1"
  );
  if (!data.response.games) {
    throw new Error("Steam: answer has no games");
  }
  return data.response.games;
}

export async function getMostPlayedGame() {
  try {
    const games = await fetchOwnedGames();
    let top = null;
    for (const game of games) {
      if (top === null || game.playtime_forever > top.playtime_forever) {
        top = game;
      }
    }
    if (top === null || top.playtime_forever === 0) return null;
    return toGame(top.appid, top.name, top.playtime_forever);
  } catch (error) {
    console.error("error fetching most played game:", error);
    return null;
  }
}

export async function getLastPlayedGame() {
  try {
    const games = await fetchOwnedGames();
    let last = null;
    for (const game of games) {
      if (game.rtime_last_played > 0 && (last === null || game.rtime_last_played > last.rtime_last_played)) {
        last = game;
      }
    }
    if (last === null) return null;
    return toGame(last.appid, last.name, last.playtime_forever);
  } catch (error) {
    console.error("error fetching last played game:", error);
    return null;
  }
}

export async function getPlayingNow() {
  await connection();
  try {
    const data = await steam(API + "/ISteamUser/GetPlayerSummaries/v0002/?key=" + KEY + "&steamids=" + STEAM_ID);
    const player = data.response.players[0];
    if (!player || !player.gameextrainfo) return null;
    return toGame(player.gameid, player.gameextrainfo);
  } catch (error) {
    console.error("error fetching what's being played on Steam:", error);
    return null;
  }
}
