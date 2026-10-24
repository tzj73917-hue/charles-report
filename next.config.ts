import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 允許用區網 IP 開啟開發伺服器（例如手機或 http://192.168.0.6:3001）
  allowedDevOrigins: ["192.168.0.6"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
