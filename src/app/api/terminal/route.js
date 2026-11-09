import { NextResponse } from 'next/server';
import { getMonthlyTrack, getNowPlaying, getTopArtists, getTopTrack } from '@/lib/spotify';
import { getLastPlayedGame, getMostPlayedGame, getPlayingNow } from '@/lib/steam';
import { getWeather } from '@/lib/weather';
import { getLatestPush } from '@/lib/github';
import { getManga } from '@/lib/anilist';
import { allowed } from '@/lib/limit';
import { reading } from '@/content/personal';

async function getListening() {
  const playing = await getNowPlaying();
  if (playing !== null) return { playing: true, track: playing };
  const monthly = await getMonthlyTrack();
  if (monthly !== null) return { playing: false, track: monthly };
  return null;
}

async function getRecentGame() {
  const playing = await getPlayingNow();
  if (playing !== null) return { playing: true, game: playing };
  const last = await getLastPlayedGame();
  if (last !== null) return { playing: false, game: last };
  return null;
}

export async function GET() {
  if (!(await allowed('terminal'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const [listening, artists, song, mostPlayed, recent, weather, push, manga] = await Promise.all([
    getListening(),
    getTopArtists(),
    getTopTrack(),
    getMostPlayedGame(),
    getRecentGame(),
    getWeather(),
    getLatestPush(),
    getManga(reading.anilistId),
  ]);

  return NextResponse.json({ listening, artists, song, mostPlayed, recent, weather, push, manga });
}
