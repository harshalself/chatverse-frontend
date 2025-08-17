import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true, // supports both IPv4 and IPv6
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-components": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
          ],
          "data-management": ["@tanstack/react-query"],
          utils: ["axios", "date-fns", "zod"],
        },
        chunkFileNames:
          mode === "production"
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
        entryFileNames:
          mode === "production"
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
        assetFileNames:
          mode === "production"
            ? "assets/[name].[hash].[ext]"
            : "assets/[name].[ext]",
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: mode !== "production",
    cssCodeSplit: true,
    reportCompressedSize: mode === "production",
  },
  define: {
    __DEV__: mode === "development",
  },
}));
