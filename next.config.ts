import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for plain HTML/CSS/JS files
  output: "export",

  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,

  // Required for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
