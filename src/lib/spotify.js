const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

export const getAccessToken = async () => {
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

  return response.json();
};

export const getNowPlaying = async (access_token) => {
  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getMonthlyTrack = async (access_token) => {
  return fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}

export const getTopTrack = async (access_token) => {
  return fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=1", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}

export const getTopArtists = async (access_token) => {
  return fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}

export const getPlaylist = async (access_token) => {
  return fetch("https://api.spotify.com/v1/playlists/1wdt4v44et6AAmSYddDiLO?si=2af6b8faf3354f96", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }

  })
}
