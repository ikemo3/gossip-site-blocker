import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
// https://ja.vitejs.dev/guide/backend-integration.html
export default defineConfig({
  build: {
    target: "es2022",
    minify: false,
    cssMinify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        document_idle: resolve(__dirname, "apps/entry/document_idle.ts"),
        document_start: resolve(__dirname, "apps/entry/document_start.ts"),
        option: resolve(__dirname, "page/option/options.html"),
        popup: resolve(__dirname, "page/popup/popup.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  plugins: [],
});
