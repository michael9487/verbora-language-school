import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 明確指定專案根目錄，避免上層資料夾的 package-lock.json 被誤認成工作區
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
