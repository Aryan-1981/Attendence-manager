import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from accidentally inferring the monorepo root due to multiple lockfiles.
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
    root: __dirname,
  },
};

export default nextConfig;
