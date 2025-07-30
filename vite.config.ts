import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification for production builds
    minify: mode === "production" ? "esbuild" : false,
    // Optimize chunk size with better defaults
    rollupOptions: {
      output: {
        // Optimize chunk size by grouping dependencies
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
        // Ensure chunks are a reasonable size
        chunkFileNames:
          mode === "production"
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
        // This pattern helps with cache busting in production
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
    // Configure chunk size warnings
    chunkSizeWarningLimit: 600, // Set warning limit to 600KB
    // Enable source maps only in development mode
    sourcemap: mode !== "production",
    // Ensure CSS is properly extracted and optimized
    cssCodeSplit: true,
  },
}));
