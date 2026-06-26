import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("@mui/icons-material")) return "mui-icons";
          if (id.includes("@mui/material") || id.includes("@emotion")) return "mui-core";
          if (id.includes("@nextui-org")) return "nextui";
          if (id.includes("antd") || id.includes("@ant-design")) return "antd";
          if (id.includes("framer-motion")) return "framer-motion";
          if (id.includes("recharts")) return "recharts";
          if (id.includes("leaflet") || id.includes("react-leaflet")) return "leaflet";
          if (id.includes("lottie-web")) return "lottie";
          if (id.includes("country-state-city")) return "geo-data";
          if (id.includes("socket.io-client")) return "socket";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-dom") || id.includes("react-router")) return "react-vendor";
          if (id.includes("@reduxjs") || id.includes("redux-persist")) return "redux";
          if (id.includes("formik") || id.includes("yup")) return "forms";
          if (id.includes("axios") || id.includes("date-fns") || id.includes("moment")) return "utils";

          return "vendor";
        },
      },
    },
  },
});
