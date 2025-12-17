import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  // disable timestamp query strings
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
      }
    }
  },
  // disable in dev mode
  server: {
    hmr: {
      overlay: false
    }
  }
});
