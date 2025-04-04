import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5100",
        changeOrigin: true,
      },
    },
  },
});
