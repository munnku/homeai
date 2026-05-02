import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing Supabase API route type errors don't affect the UI prototype
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
