import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import { defineConfig } from "vitest/config";
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ["./src/**/*.js", "./src/**/*.jsx"],
      exclude: [],
    }),
    istanbul({
      cypress: true,
      requireEnv: false,
    }),
  ],

  server: {
    host: true,
    port: 5173,
  },

  test: {
    environment: "jsdom",
    reporters: ["json"],
    coverage: {
      include: ["./src/**/*.ts", "src/**/*.tsx", "**/cypress/**"],
      provider: "istanbul", // or 'v8'
      reporter: ["text", "json", "json-summary", "html"],
    },
  },
});
