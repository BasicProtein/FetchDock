import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [svelte()],
  clearScreen: false,
  server: {
    strictPort: true,
    port: 1420,
    watch: {
      ignored: ["**/src-tauri/**"]
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
