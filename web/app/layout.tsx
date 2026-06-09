import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://vitacare-web-205100594497.europe-west1.run.app"),
  title: "VitaCare — The Agent-to-Agent Care Network",
  description:
    "One AI per person. A network for the people you love. Six agents per family member. Coordinated over Google's A2A protocol. Built by Graviti Labs for the Google for Startups AI Agents Challenge.",
  applicationName: "VitaCare",
  authors: [{ name: "Graviti Labs", url: "https://gravitilabs.com" }],
  keywords: ["VitaCare", "Graviti Labs", "Gemini", "ADK", "A2A", "MCP", "Vertex AI", "health AI", "agent-to-agent"],
  openGraph: {
    type: "website",
    title: "VitaCare — The Agent-to-Agent Care Network",
    description: "One AI per person. A network for the people you love. 100% Google stack.",
    siteName: "VitaCare",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaCare — The Agent-to-Agent Care Network",
    description: "One AI per person. A network for the people you love. 100% Google stack.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
