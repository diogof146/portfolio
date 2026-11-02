import { cacheLife } from "next/cache";
import { connection } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
let token = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  if (token && Date.now() < tokenExpiresAt) { return token; }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  token = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;
  return token;
};

async function spotify(path) {
  const accessToken = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}`, },
  });
  if (res.status === 204) { return null; }
  if (!res.ok) { throw new Error("Spotify " + path + ": " + res.status); }
  return await res.json();
}

export async function getNowPlaying() {
  await connection();
  try {
    const data = await spotify("/me/player/currently-playing");
    if (data === null) return null;
    if (!data.is_playing || data.currently_playing_type !== "track") return null;
    return toTrack(data.item);
  } catch (error) {
    console.error("error fetching now playing:", error);
    return null;
  }
}

async function fetchMonthlyTrack() {
  "use cache";
  cacheLife("hours");
  const data = await spotify("/me/top/tracks?time_range=short_term&limit=1");
  if (data.items.length === 0) return null;
  return toTrack(data.items[0]);
}

export async function getMonthlyTrack() {
  try {
    return await fetchMonthlyTrack();
  } catch (error) {
    console.error("error fetching monthly track:", error);
    return null;
  }
}

async function fetchTopTrack() {
  "use cache";
  cacheLife("days");
  const data = await spotify("/me/top/tracks?time_range=long_term&limit=1");
  if (data.items.length === 0) return null;
  return toTrack(data.items[0]);
}

export async function getTopTrack() {
  try {
    return await fetchTopTrack();
  } catch (error) {
    console.error("error fetching top track:", error);
    return null;
  }
}

async function fetchTopArtists() {
  "use cache";
  cacheLife("days");

  const data = await spotify("/me/top/artists?time_range=long_term&limit=5");
  const artists = [];
  for (const artist of data.items) {
    artists.push({
      name: artist.name,
      image: getImage(artist.images),
      url: artist.external_urls.spotify,
    });
  }
  return artists;
}

export async function getTopArtists() {
  try {
    return await fetchTopArtists();
  } catch (error) {
    console.error("error fetching top artists:", error);
    return null;
  }
}

async function fetchPlaylist() {
  "use cache";
  cacheLife("days");
  const data = await spotify("/playlists/1wdt4v44et6AAmSYddDiLO");
  return {
    title: data.name,
    image: getImage(data.images),
    url: data.external_urls.spotify,
  };
}

export async function getPlaylist() {
  try {
    return await fetchPlaylist();
  } catch (error) {
    console.error("error fetching playlist:", error);
    return null;
  }
}

function getImage(images) {
  if (images.length === 0) return null;
  return images[0].url;
}

function toTrack(item) {
  const names = [];
  for (const artist of item.artists) {
    names.push(artist.name);
  }
  return {
    title: item.name,
    artist: names.join(", "),
    image: getImage(item.album.images),
    url: item.external_urls.spotify,
  };
}
