import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import { defineConfig } from "vitest/config";
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ["./src/**/*.js", "./src/**/*.jsx"],
      exclude: [],
      emitWarning: true, // Add this line to emit warnings instead of errors
      failOnError: false,
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
    coverage: {
      include: ["src/**/*.ts", "src/**/*.tsx", "**/cypress/**"],
      provider: "istanbul", // or 'v8'
      reporter: ["json-summary", "json", "html"],
    },
    setupFiles: "./src/tests/setup.ts",
    globals: true,
    css: true,
  },

  build: {
    target: "ES2022",
    outDir: "build",
  },
});
