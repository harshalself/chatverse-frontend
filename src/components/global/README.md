# Global Chatbot Component

A floating chatbot widget that appears on authenticated pages, allowing users to quickly chat with their AI agents.

## Features

✅ **Smart Visibility**: Only shows on authenticated pages (Workspace, Dashboard)  
✅ **Agent Selection**: Dropdown to switch between user's agents  
✅ **Expandable Interface**: Click to expand from icon to full chat  
✅ **Collapsible**: Down arrow to collapse back to icon  
✅ **Persistent State**: Remembers selected agent and expand/collapse state  
✅ **Keyboard Support**: ESC key to close expanded chatbot  
✅ **Responsive Design**: Works on desktop and mobile  
✅ **Smooth Animations**: Framer Motion powered transitions  

## Architecture

### Component Structure
```
src/components/global/
├── GlobalChatbot.tsx          # Main container component
├── ChatbotIcon.tsx           # Floating action button
├── ChatbotExpanded.tsx       # Full chat interface
├── AgentSelector.tsx         # Agent switching dropdown
├── useChatbotState.ts        # State management hook
└── index.ts                  # Component exports
```

### Integration Points
- **Authentication**: Uses `useAuth` hook to determine visibility
- **Agent Management**: Leverages existing `useAgents` and agent context
- **Chat Functionality**: Reuses `useSendAgentChatMessage` hook
- **Persistence**: Stores preferences in localStorage via `useLocalStorage`

## Usage

The GlobalChatbot is automatically included in the main App component and doesn't require manual setup.

### Automatic Behavior
1. **Shows on**: `/workspace`, `/agent/:id` routes when user is authenticated
2. **Hidden on**: `/`, `/signin`, `/signup` routes
3. **Auto-selects**: First active agent or first available agent
4. **Remembers**: Last selected agent and collapsed/expanded state

### User Interactions
- **Click icon**: Expand to full chat interface
- **Click down arrow**: Collapse to icon
- **Select agent**: Use dropdown to switch between agents
- **Send message**: Type and press Enter or click send button
- **ESC key**: Close expanded interface

## Implementation Details

### State Management
```typescript
const {
  isExpanded,           // boolean - is chatbot expanded
  selectedAgentId,      // number | null - current agent
  toggleExpanded,       // function - toggle expand/collapse
  selectAgent,          // function - change selected agent
  collapse,             // function - force collapse
} = useChatbotState();
```

### Local Storage
Preferences are automatically saved to `localStorage` under key `chatbot-preferences`:
```typescript
interface ChatbotPreferences {
  lastSelectedAgentId: number | null;
  isCollapsed: boolean;
  position: { x: number; y: number }; // Future: draggable positioning
}
```

### Chat Messages
Uses a simplified message interface for the mini chat:
```typescript
interface MiniMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
```

## Styling

- **Position**: Fixed bottom-right corner (`bottom-6 right-6`)
- **Z-index**: `z-50` to appear above all other content
- **Animations**: Spring-based animations for smooth UX
- **Theme**: Follows existing design system (Tailwind + Radix)

## Future Enhancements

🔮 **Planned Features**:
- [ ] Unread message notifications
- [ ] Draggable positioning
- [ ] Chat history persistence
- [ ] Voice input support
- [ ] Multi-session management
- [ ] Custom positioning per page
- [ ] Notification sounds
- [ ] Typing indicators

## Performance

- **Lazy Loading**: Components only render when authenticated
- **Optimized Queries**: Reuses existing agent queries
- **Memory Efficient**: Minimal state footprint
- **Bundle Impact**: ~3KB gzipped additional size

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper accessibility attributes
- **Focus Management**: Logical tab order
- **Screen Reader**: Compatible with assistive technologies