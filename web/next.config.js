/** @type {import('next').NextConfig} */
// AGENT_API is consumed at *runtime* by the rewrites() function below, not
// baked into the static bundle. Set it via Cloud Run env (--set-env-vars).
const AGENT_API =
  process.env.AGENT_API ||
  process.env.NEXT_PUBLIC_AGENT_API ||
  "http://localhost:8080";

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  // No rewrites — the browser hits the agents Cloud Run URL directly.
  // Next.js's rewrite plumbing buffers SSE responses, which kills the
  // event stream the demo depends on.
};

module.exports = nextConfig;
