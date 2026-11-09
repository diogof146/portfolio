/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: false,
  images: {
    remotePatterns: [
      new URL("https://s4.anilist.co/**"),
      new URL("https://i.scdn.co/**"),
      new URL("https://shared.akamai.steamstatic.com/**"),
    ],
  },
};

export default nextConfig;
