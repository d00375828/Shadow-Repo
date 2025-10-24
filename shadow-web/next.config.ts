import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack-only settings
  turbopack: {
    // Fix the “workspace root” warning (set your app’s real root)
    root: __dirname, // absolute path to THIS project

    // Make RN imports resolve to RN Web in Turbo (Webpack alias is ignored by Turbo)
    resolveAlias: {
      "react-native": "react-native-web",
    },
  },

  // Keep your Webpack alias too (harmless; useful if you ever run Webpack)
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "react-native$": "react-native-web",
    };
    return config;
  },

  // Optional: silence the LAN IP warning during dev
  allowedDevOrigins: [
    "http://localhost:3000",
    // add your LAN URL if you open it from another device:
    // "http://192.168.110.84:3000",
  ],
};

export default nextConfig;
