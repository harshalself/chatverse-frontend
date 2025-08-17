import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Production optimization: Add resource hints for critical assets
 * This helps the browser prioritize fetching of critical resources
 */
if (process.env.NODE_ENV === "production") {
  // Add DNS prefetch for API domain (safe check)
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  let apiHost = "";
  try {
    if (apiUrl) {
      apiHost = new URL(apiUrl).hostname;
    }
  } catch (e) {
    // Invalid URL, skip DNS prefetch
  }
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
