# Dog Age Calculator

## Overview

A web-based dog age calculator tool that converts a dog's age to human years based on breed and size. The application provides detailed life stage information, energy levels, and activity recommendations. Built as a full-stack TypeScript application with a React frontend and Express backend, designed for SEO optimization and fast, mobile-responsive user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with custom color palette (cream background #F9F3B9, brown text #2F1313, gold accents #E5CD6C)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schema validation
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: connect-pg-simple for PostgreSQL-based sessions

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       └── pages/          # Page components
├── server/           # Express backend
│   ├── routes.ts     # API route handlers with calculation logic
│   ├── storage.ts    # Database operations
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared code between frontend/backend
│   ├── schema.ts     # Drizzle schemas and breed definitions
│   └── routes.ts     # API contract with Zod schemas
└── migrations/       # Drizzle database migrations
```

### API Endpoints
- `GET /api/breeds` - Returns list of supported dog breeds
- `POST /api/calculate` - Calculates dog age in human years with life stage data

### Key Features
- Breed-specific age calculation with size categories (Small, Medium, Large, Giant)
- Life stage classification (Puppy, Adult, Senior, etc.) with emotional messaging
- Energy level and activity capacity indicators
- Age progress visualization
- Calculation logging to database for analytics

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **drizzle-kit**: Database migration tooling (`npm run db:push`)

### Frontend Libraries
- **@tanstack/react-query**: Async state management and caching
- **framer-motion**: Animation library for UI interactions
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation
- **wouter**: Client-side routing
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### UI Framework
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Unstyled accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class conflict resolution

### Backend Libraries
- **express**: Web server framework
- **zod**: Runtime schema validation
- **drizzle-zod**: Drizzle to Zod schema conversion
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Frontend build and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Server-side bundling for production
- **@replit/vite-plugin-***: Replit-specific development enhancements