# ReadRover Frontend

The frontend for ReadRover - a modern React application built with TypeScript, Vite, and Tailwind CSS for managing your personal book library.

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **shadcn/ui** - Beautiful, accessible component library
- **React Router DOM v7** - Client-side routing
- **TanStack React Query** - Server state management
- **React Hook Form + Zod** - Form handling with validation
- **Lucide React** - Beautiful, customizable icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or use Docker as described below)

### Development Setup

#### Option 1: Using Docker (Recommended)

```bash
# From the project root
docker compose up frontend -d

# The app will be available at http://localhost:5173
```

#### Option 2: Local Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Environment Configuration

The frontend automatically connects to the backend at `http://localhost:8000`. If you need to change this, update the API base URL in the frontend configuration.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # App configuration and setup
│   │   ├── queryClient.ts    # React Query configuration
│   │   └── router.tsx        # Application routing
│   ├── components/       # Reusable UI components
│   │   └── ui/              # shadcn/ui components
│   ├── features/         # Feature-specific code
│   │   └── auth/            # Authentication feature
│   │       ├── api.ts       # Auth API calls
│   │       └── components/  # Auth-specific components
│   ├── layouts/          # Layout components
│   │   └── MainLayout.tsx   # Main application layout
│   ├── lib/              # Utility libraries
│   │   └── utils.ts         # Common utilities
│   ├── pages/            # Page components
│   │   └── HomePage.tsx     # Home page
│   ├── App.tsx           # Root App component
│   └── main.tsx          # Application entry point
├── components.json       # shadcn/ui configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives. Components are:

- **Accessible** - Built with ARIA attributes and keyboard navigation
- **Customizable** - Easy to modify with Tailwind CSS
- **Type-safe** - Full TypeScript support
- **Modern** - Uses the latest React patterns

### Adding New Components

```bash
# Add a new shadcn/ui component (if needed)
npx shadcn-ui@latest add button

# Components are automatically added to src/components/ui/
```

## 🔗 API Integration

The frontend uses TanStack React Query for server state management:

- **Automatic caching** - Reduces redundant API calls
- **Background updates** - Keeps data fresh
- **Error handling** - Graceful error states
- **Loading states** - Built-in loading indicators

API calls are organized in feature-specific files (e.g., `src/features/auth/api.ts`).

## 🔐 Authentication

The authentication system includes:

- **JWT-based authentication** - Secure token-based auth
- **Protected routes** - Route guards for authenticated pages
- **User context** - Global user state management
- **Login/logout flows** - Complete authentication lifecycle

## 📱 Responsive Design

The application is fully responsive and works across:

- **Desktop** - Full-featured experience
- **Tablet** - Optimized touch interface
- **Mobile** - Mobile-first responsive design

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## 🏗️ Build and Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

The build outputs to the `dist/` directory and can be served by any static file server.

### Docker Production

```bash
# Build production image
docker build -t readrover-frontend .

# Run production container
docker run -p 5173:5173 readrover-frontend
```

## 🎯 Code Style and Conventions

- **TypeScript** - Use strict TypeScript configuration
- **ESLint** - Follow the configured ESLint rules
- **Prettier** - Code formatting (configured through ESLint)
- **Functional Components** - Use function components with hooks
- **Custom Hooks** - Extract reusable logic into custom hooks
- **Feature Organization** - Group related components by feature

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts` or stop other services
2. **API connection failed**: Ensure the backend is running on `http://localhost:8000`
3. **Build errors**: Clear `node_modules` and reinstall dependencies

### Debugging

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for type errors
npm run type-check

# Detailed build output
npm run build -- --mode development
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new code
3. Test your changes across different screen sizes
4. Run `npm run lint` before committing
5. Update this README if you add new features or change the architecture

## 📚 Useful Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)
