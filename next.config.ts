import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Cho phép HMR/dev assets khi mở site qua IP LAN (giống Vite --host)
  allowedDevOrigins: ["*.*.*.*"],
  images: {
    // Cần khi test qua IP LAN — Next 16 chặn tối ưu ảnh từ private IP mặc định
    dangerouslyAllowLocalIP: true,
    // Ảnh upload production lưu trên Vercel Blob
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
