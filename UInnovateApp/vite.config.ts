import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ["./src/**/*.js", "./src/**/*.jsx"],
      exclude: [],
    }),
  ],
  test: {
    coverage: {
      include: ["./src/**/*.ts", "./src/**/*.tsx", "**/cypress/**"],
      provider: "istanbul", // or 'v8'
      reporter: ["text", "json", "html"],
    },
  },
});
