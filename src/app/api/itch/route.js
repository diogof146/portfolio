import { NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/itch';
import { allowed } from '@/lib/limit';

export async function GET(request) {
  if (!(await allowed('itch'))) {
    return NextResponse.json({ error: 'Too many downloads, try again in a minute' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  const platform = searchParams.get('platform');

  try {
    const downloadUrl = await getDownloadUrl(gameId, platform);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error('[ITCH_API_ERROR]', error.message);
    return NextResponse.json(
      { error: 'Failed to retrieve download link from itch.io' },
      { status: 502 }
    );
  }
}
