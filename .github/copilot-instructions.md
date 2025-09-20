# ChatVerse Frontend - AI Coding Assistant Instructions

## 🏗️ Architecture Overview

**Tech Stack**: React 18 + TypeScript + Vite + TanStack Query + React Router + Radix UI + Tailwind CSS

**Key Architectural Patterns**:

- **Feature-based organization**: Services, hooks, components, and types grouped by domain
- **Layered architecture**: API → Services → Hooks → Components → Pages
- **Centralized state**: React Context for global state, TanStack Query for server state
- **Consistent API responses**: All endpoints return `{ data, message, success }` structure

## 📁 Project Structure & Conventions

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base Radix UI + Tailwind components
│   ├── layout/         # Layout components (Header, Navigation)
│   ├── agents/         # Agent-specific components
│   └── dashboard/      # Dashboard sections
├── contexts/           # React Contexts (auth, theme, agent, etc.)
├── hooks/              # Custom React hooks with TanStack Query
├── lib/                # Utilities, API client, constants
├── pages/              # Route-level pages
├── providers/          # Context composition providers
├── services/           # API service modules
└── types/              # TypeScript definitions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `AgentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAgents.ts`)
- **Services**: PascalCase with `Service` suffix (e.g., `AgentsService.ts`)
- **Types**: PascalCase with descriptive names (e.g., `Agent.ts`)
- **Constants**: UPPER_SNAKE_CASE in `constants.ts`

## 🔄 Data Flow & State Management

### API Layer

```typescript
// Always use the centralized API client
import { apiClient } from "@/lib/client";

// Example service pattern
export class AgentsService {
  static async getAgents(): Promise<AgentsResponse> {
    return apiClient.get(API_ENDPOINTS.AGENTS.LIST);
  }
}
```

### Query Layer

```typescript
// Always use TanStack Query hooks
export const useAgents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AGENTS,
    queryFn: () => AgentsService.getAgents(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

### Mutation Layer

```typescript
// Always use mutations with optimistic updates
export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentRequest) => AgentsService.createAgent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });
      toast({ title: "Success", description: response.message });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to create agent");
    },
  });
};
```

## 🎯 Key Patterns & Best Practices

### 1. Error Handling

```typescript
// Always use centralized error handler
import { ErrorHandler } from "@/lib/error-handler";

try {
  // API call
} catch (error) {
  ErrorHandler.handleApiError(error, "Custom error message");
}
```

### 2. Toast Notifications

```typescript
// Always use consistent toast pattern
import { toast } from "@/hooks/use-toast";

toast({
  title: "Success",
  description: "Operation completed successfully",
});
```

### 3. Query Keys

```typescript
// Always use predefined query keys from constants
import { QUERY_KEYS } from "@/lib/constants";

queryKey: QUERY_KEYS.AGENTS;
queryKey: QUERY_KEYS.AGENT(id);
```

### 4. API Endpoints

```typescript
// Always use predefined endpoints from constants
import { API_ENDPOINTS } from "@/lib/constants";

API_ENDPOINTS.AGENTS.LIST;
API_ENDPOINTS.AGENTS.GET(id);
```

### 5. Type Definitions

```typescript
// Always define types in dedicated files
// Use consistent naming and extend base types
export interface Agent extends BaseEntity {
  name: string;
  provider: AgentProvider;
  model: string;
  // ...
}
```

## 🚀 Development Workflow

### Build Commands

```bash
npm run dev              # Development server (port 8080)
npm run build            # Production build
npm run build:staging    # Staging build
npm run build:production # Production build
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run type-check       # TypeScript check
```

### Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=ChatVerse
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

### Deployment

- **Platform**: Vercel
- **Build Command**: `npm run build:production`
- **Output Directory**: `dist`
- **SPA Routing**: Configured in `vercel.json`

## 🔧 Configuration Files

### Vite Config (`vite.config.ts`)

- Path aliases: `@/*` → `./src/*`
- Manual code splitting for vendors
- Environment-specific builds
- Development server on port 8080

### TypeScript Config

- Relaxed strict mode for faster development
- Path mapping for clean imports
- Separate configs for app and node environments

### ESLint Config

- React hooks rules enabled
- TypeScript integration
- React refresh plugin for hot reload

## 📊 Data Management Patterns

### Sources Architecture

- **Modular Services**: Each source type (file, text, website, database, QA) has dedicated service
- **Unified Interface**: All sources implement common `DataSource` interface
- **Type Safety**: Strict typing for all source operations

### Agent Management

- **Training Lifecycle**: Status polling with automatic completion notifications
- **Optimistic Updates**: Immediate UI feedback with rollback on failure
- **Analytics Integration**: Training metrics and performance tracking

### Authentication

- **Token Management**: Automatic token refresh and storage
- **Protected Routes**: Route-level authentication guards
- **Auto Redirect**: Seamless login/logout flow

## 🎨 UI/UX Patterns

### Component Library

- **Base Components**: Radix UI primitives in `src/components/ui/`
- **Consistent Styling**: Tailwind CSS with custom design system
- **Accessibility**: ARIA attributes and keyboard navigation

### Layout System

- **Responsive Design**: Mobile-first approach
- **Navigation**: Consistent header and sidebar patterns
- **Loading States**: Skeleton loaders and spinners

### Form Handling

- **Validation**: Zod schemas for type-safe validation
- **State Management**: React Hook Form integration
- **Error Display**: Inline validation messages

## 🔍 Debugging & Monitoring

### Development Tools

- **React DevTools**: Component inspection and profiling
- **Network Tab**: API request monitoring
- **Console Logging**: Structured logging with context

### Error Boundaries

- **Global Error Handling**: Context-based error boundaries
- **Graceful Degradation**: Fallback UI for error states
- **Error Reporting**: Centralized error collection

## 📝 Code Quality Standards

### TypeScript Usage

- **Strict Typing**: Define interfaces for all data structures
- **Generic Types**: Use generics for reusable components
- **Type Guards**: Runtime type checking where needed

### Performance Optimization

- **Code Splitting**: Lazy loading for routes and heavy components
- **Memoization**: React.memo, useMemo, useCallback appropriately
- **Bundle Analysis**: Monitor bundle sizes and optimize imports

### Testing Strategy

- **Unit Tests**: Component and hook testing with React Testing Library
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: Critical user journeys with Playwright

## 🚨 Common Pitfalls to Avoid

1. **Don't bypass the service layer** - Always use services for API calls
2. **Don't create query keys manually** - Use predefined constants
3. **Don't handle errors inline** - Use ErrorHandler for consistency
4. **Don't import from deep paths** - Use path aliases (`@/`)
5. **Don't skip TypeScript types** - Define interfaces for all data
6. **Don't forget optimistic updates** - Update UI immediately on mutations
7. **Don't hardcode API URLs** - Use environment variables and constants
8. **Don't ignore loading states** - Always handle async operations
9. **Don't skip error boundaries** - Wrap components that might fail
10. **Don't forget cache invalidation** - Update queries after mutations

## 🔗 Integration Points

### Backend API

- **Base URL**: Configurable via `VITE_API_BASE_URL`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: Consistent `{ data, message, success }` structure
- **Error Handling**: HTTP status codes with detailed error messages

### External Services

- **File Uploads**: Direct to API with multipart/form-data
- **Real-time Updates**: WebSocket connections for live data
- **Third-party APIs**: Centralized in service layer

### Deployment Pipeline

- **Build Optimization**: Environment-specific builds
- **Asset Optimization**: Image compression and caching
- **CDN Integration**: Static asset delivery via Vercel

## 📚 Key Files to Reference

### Core Architecture

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component
- `src/lib/client.ts` - API client configuration
- `src/lib/constants.ts` - Application constants and configuration

### Data Layer

- `src/services/agents.service.ts` - Agent API operations
- `src/hooks/use-agents.ts` - Agent data fetching hooks
- `src/types/agent.types.ts` - Agent type definitions

### UI Layer

- `src/components/ui/` - Base component library
- `src/contexts/ThemeContext.tsx` - Theme management
- `src/pages/Dashboard.tsx` - Main dashboard page

### Configuration

- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Deployment configuration
- `package.json` - Dependencies and scripts

This codebase follows modern React patterns with strong emphasis on type safety, consistent architecture, and developer experience. When making changes, always consider the established patterns and maintain consistency across the application.</content>
<parameter name="filePath">l:\Projects\chatverse-frontend\.github\copilot-instructions.md
