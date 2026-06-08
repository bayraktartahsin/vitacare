/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    NEXT_PUBLIC_AGENT_API: process.env.NEXT_PUBLIC_AGENT_API || "http://localhost:8080",
  },
};

module.exports = nextConfig;
