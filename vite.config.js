import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const REACT_PACKAGES = [
  "react",
  "react-dom",
  "react-router",
  "react-redux",
  "scheduler",
  "use-sync-external-store",
  "react-helmet-async",
];

function isReactPackage(id) {
  return REACT_PACKAGES.some(
    (pkg) =>
      id.includes(`/node_modules/${pkg}/`) ||
      id.includes(`\\node_modules\\${pkg}\\`)
  );
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Keep the full React runtime in one chunk
          if (isReactPackage(id)) return "react-vendor";

          // Only split large, lazy-loaded libraries that are self-contained.
          // Avoid splitting MUI/emotion/antd/etc. — causes circular init errors.
          if (id.includes("country-state-city")) return "geo-data";
          if (id.includes("leaflet") || id.includes("react-leaflet")) return "leaflet";
          if (id.includes("lottie-web")) return "lottie";
          if (id.includes("recharts")) return "recharts";
        },
      },
    },
  },
});
