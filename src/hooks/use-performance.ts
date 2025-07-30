import { useEffect, useRef } from "react";

/**
 * A custom hook to measure and log component rendering performance
 * Only active in development mode
 *
 * @param componentName - The name of the component being measured
 * @param dependencies - Optional array of dependencies to track for changes
 */
export function useRenderPerformance(
  componentName: string,
  dependencies?: any[]
) {
  const renderStartTime = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);

  // Only track performance in development mode
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // Start timing on initial render
  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      if (renderTime > 10) {
        // Only log slow renders (> 10ms)
        console.warn(
          `[Performance] Component "${componentName}" took ${renderTime.toFixed(
            2
          )}ms to render`
        );
      }
    };
  }, [componentName]);

  // Track changes if dependencies are provided
  useEffect(() => {
    if (!dependencies) return;

    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;

    if (lastRenderTime.current > 0 && timeSinceLastRender < 100) {
      // Less than 100ms since last render
      console.warn(
        `[Performance] Component "${componentName}" re-rendered too quickly (${timeSinceLastRender.toFixed(
          2
        )}ms since last render). Check memoization.`
      );
    }

    lastRenderTime.current = currentTime;
  }, dependencies || []);
}
