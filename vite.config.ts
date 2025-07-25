import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vega: ["vega-embed"],
          maplibregl: ["maplibre-gl"],
        },
      },
    },
  },
} satisfies UserConfig;
