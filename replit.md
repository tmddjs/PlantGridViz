# Plant Grid Application

## Overview

This is a full-stack web application for visualizing and managing plant data through an interactive grid interface. The application displays 100 plant species with their botanical characteristics using geometric shapes. Users can hover for proximity-based scaling and detailed information, click to select plants for circular diagram composition displayed in a side panel.

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Minimalist, artistic, non-commercial with small fonts, thin lines, and sophisticated visual elements. Prefers subtle design over high visibility/usability.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom botanical-themed color palette
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Font**: Crimson Text for a botanical/scientific aesthetic

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: In-memory storage for rapid prototyping
- **Database Ready**: Drizzle ORM configured for PostgreSQL (schema defined but using memory storage)
- **API Design**: RESTful endpoints for plant CRUD operations
- **Error Handling**: Centralized error middleware with structured responses

### Key Components

#### Plant Grid System
- **Interactive Grid**: 10x10 cell layout displaying plants as geometric shapes without borders
- **Visual Encoding**: Circles (trees), squares (shrubs), triangles (herbs) with plant names below
- **Proximity Scaling**: Mouse distance-based shape scaling for interactive exploration
- **Hover Details**: Bottom slide-up panel showing plant information on hover
- **Selection System**: Click-to-select plants while hovering, with side panel diagram
- **Circular Diagram**: Real-time side panel with circular composition visualization

#### Data Models
- **Plant Schema**: Scientific name, Korean name, life form, height, root depth, light requirements, lifespan
- **Type Safety**: Zod validation schemas ensure data integrity
- **Drizzle Integration**: ORM setup for future database migration

#### Storage Layer
- **Interface Pattern**: IStorage interface allows switching between memory and database storage
- **Memory Implementation**: In-memory Map for development and testing
- **Database Ready**: PostgreSQL schema prepared for production deployment

## Data Flow

1. **Static Data Loading**: Plant data hardcoded in TypeScript for immediate availability
2. **Grid Rendering**: Plants mapped to grid cells with visual shape encoding
3. **User Interactions**: Click handlers for selection and detail viewing
4. **Modal Management**: React state controls modal visibility and content
5. **API Integration**: Express routes handle plant data operations (ready for database)

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for data fetching
- **UI Framework**: Radix UI primitives, Shadcn/ui components
- **Development**: Vite, TypeScript, Tailwind CSS
- **Utilities**: Class variance authority, clsx, date-fns

### Backend Dependencies
- **Server**: Express.js, CORS handling
- **Database**: Drizzle ORM, Neon serverless PostgreSQL driver
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Type Checking**: TypeScript with strict configuration
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **Replit Integration**: Development banner and error overlay plugins

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Backend**: tsx for live TypeScript execution
- **Asset Serving**: Vite middleware integration with Express

### Production Build
- **Frontend**: Vite builds optimized React bundle to dist/public
- **Backend**: esbuild creates single ESM bundle in dist/
- **Static Assets**: Express serves built frontend from public directory
- **Database**: Ready for PostgreSQL connection via DATABASE_URL environment variable

### Architecture Decisions

1. **Memory Storage First**: Chose in-memory storage for rapid prototyping while keeping database integration ready
2. **Monorepo Structure**: Single repository with shared types between frontend and backend
3. **Type-First Development**: Shared schema definitions ensure type safety across the stack
4. **Component-Based UI**: Modular React components with clear separation of concerns
5. **Botanical Theming**: Custom design system reflecting the plant science domain