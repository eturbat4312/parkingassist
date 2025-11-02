// filename: frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack-д энэ фолдероо root болгоно (workspace warning арилна)
  turbopack: {
    root: __dirname,
  },

  // allowedDevOrigins топ-левел дээр байх нь зөв (Next 16)
  allowedDevOrigins: [
    "http://192.168.1.131:3001",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
