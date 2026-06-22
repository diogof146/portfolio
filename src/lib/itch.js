export async function getDownloadUrl(gameId, platform) {
  const apiKey = process.env.ITCH_API_KEY;

  const headers = {
    'User-Agent': 'PortfolioApp/1.0 (Next.js)',
    'Accept': 'application/json'
  };

  const uploadsRes = await fetch(`https://itch.io/api/1/${apiKey}/game/${gameId}/uploads`, { headers });

  if (!uploadsRes.ok) {
    const errorText = await uploadsRes.text();
    throw new Error(`Itch.io uploads API rejected the request: ${uploadsRes.status} | Reason: ${errorText}`);
  }

  const { uploads } = await uploadsRes.json();

  const targetUpload = uploads.find(u =>
    (u.display_name && u.display_name.toLowerCase().includes(platform.toLowerCase())) ||
    (u.filename && u.filename.toLowerCase().includes(platform.toLowerCase()))
  );

  const downloadRes = await fetch(`https://itch.io/api/1/${apiKey}/upload/${targetUpload.id}/download`, { headers });

  if (!downloadRes.ok) {
    const errorText = await downloadRes.text();
    throw new Error(`Itch.io download API failed: ${downloadRes.status} | Reason: ${errorText}`);
  }

  const responseData = await downloadRes.json();

  return responseData.url;
}
