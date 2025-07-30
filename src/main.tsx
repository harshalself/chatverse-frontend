import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Production optimization: Add resource hints for critical assets
 * This helps the browser prioritize fetching of critical resources
 */
if (process.env.NODE_ENV === "production") {
  // Add preload for main CSS
  const linkPreload = document.createElement("link");
  linkPreload.rel = "preload";
  linkPreload.as = "style";
  linkPreload.href = "/assets/index.css";
  document.head.appendChild(linkPreload);

  // Add DNS prefetch for API domain
  const apiHost = new URL(import.meta.env.VITE_API_URL || "").hostname;
  if (apiHost) {
    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = `//${apiHost}`;
    document.head.appendChild(dnsPrefetch);
  }
}

// Initialize the application
const start = performance.now();
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Log startup performance metrics in development
if (process.env.NODE_ENV === "development") {
  const end = performance.now();
  console.log(`Application startup time: ${(end - start).toFixed(2)}ms`);
}
