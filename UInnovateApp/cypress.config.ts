import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
  
  e2e: {
    baseUrl: 'http://localhost:5173/',
    supportFile: false,
    setupNodeEvents(on) {
      on("file:preprocessor", vitePreprocessor());
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
