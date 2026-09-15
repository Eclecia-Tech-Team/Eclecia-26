import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Scene assets are content-addressed by hand (new file = new name), so cache hard.
    return [
      {
        source: "/assets/opt/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;