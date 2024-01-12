/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //   domains: ["lh3.googleusercontent.com","avatars.githubusercontent"],
    // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3\\.googleusercontent\\.com"
      },
    ],
  },
};

module.exports = nextConfig
