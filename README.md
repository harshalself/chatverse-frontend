# AgentFlow UI

A modern React application for building and managing AI agents with an intuitive interface.

## Features

- **Homepage**: Landing page with authentication-aware navigation
- **Authentication**: Complete sign in/sign up flow with protected routes
- **Workspace**: Main dashboard for managing agents
- **Agent Management**: Create, configure, and deploy AI agents
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd agentflow-ui
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and state management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components (header, navigation)
│   └── agents/         # Agent-specific components
├── contexts/           # React contexts (auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Authentication

The application includes a complete authentication system:

- Protected routes for workspace and agent management
- Persistent login state using localStorage
- Automatic redirect to intended destination after login
- User profile management with sign out functionality

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
