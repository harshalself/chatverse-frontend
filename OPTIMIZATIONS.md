# Production Optimizations

This project includes several optimizations for production builds to improve performance and user experience.

## Code Splitting

The application uses React.lazy and Suspense for code splitting, which significantly reduces the initial bundle size by loading components only when they are needed.

```tsx
// Example of lazy loading in App.tsx
const Homepage = lazy(() => import("./pages/Homepage"));
const Workspace = lazy(() => import("./pages/Workspace"));
```

## Performance Optimizations

### Component Memoization

Performance-critical components are wrapped with React.memo to prevent unnecessary re-renders:

```tsx
export const AgentCard = memo(AgentCardComponent);
export const Header = memo(HeaderComponent);
```

### Callback Memoization

Event handlers are optimized with useCallback to maintain referential equality between renders:

```tsx
const handleBreadcrumbClick = useCallback(
  (index: number) => {
    // Implementation
  },
  [navigate]
);
```

### Custom Performance Hooks

A custom hook for monitoring render performance in development:

```tsx
// Usage example
import { useRenderPerformance } from "@/hooks/use-performance";

function MyComponent() {
  useRenderPerformance("MyComponent", [dependency1, dependency2]);
  // Component implementation
}
```

## API Optimizations

### Request Caching

The API client includes an in-memory cache for GET requests to reduce redundant network calls:

- Configurable TTL (Time To Live)
- Automatic cache invalidation for mutation requests
- Cache bypassing when needed

### Optimized React Query Configuration

React Query is configured with performance in mind:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});
```

## Build Optimizations

### Chunk Splitting

The Vite build configuration includes manual chunk splitting to optimize browser caching:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        // Additional chunk definitions
      },
    }
  }
}
```

### Resource Hints

The application adds resource hints for critical assets:

```typescript
// Preload critical CSS
const linkPreload = document.createElement("link");
linkPreload.rel = "preload";
linkPreload.as = "style";
```

## Monitoring and Metrics

Development builds include performance metrics to help identify potential issues:

```typescript
// Log startup performance
if (process.env.NODE_ENV === "development") {
  const end = performance.now();
  console.log(`Application startup time: ${(end - start).toFixed(2)}ms`);
}
```
