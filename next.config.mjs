/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from Notion CDN if you ever render Notion images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
