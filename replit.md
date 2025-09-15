# NutriPlan - Meal Planning and Grocery Shopping Platform

## Overview

NutriPlan is a comprehensive meal planning and grocery shopping optimization platform designed for families and individuals. The application uses AI to generate personalized meal plans based on dietary preferences, budget constraints, and family needs, while also providing smart grocery shopping features including price comparison and shopping route optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript in Single Page Application (SPA) architecture
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling middleware
- **Development Server**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Definition**: Shared TypeScript schema definitions using Drizzle and Zod
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for database schema migrations

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Management**: Custom user registration and profile management system
- **Security**: Session-based authentication with secure cookie handling

### External Service Integrations
- **AI Services**: OpenAI API for recipe generation and meal plan creation
- **Grocery Data**: Mock grocery price comparison service (prepared for real store API integration)
- **Email Services**: Prepared for notification and communication features

### Core Application Features

#### User Management
- Multi-step onboarding process collecting dietary preferences, family size, budget, and health considerations
- Comprehensive user profiles including cooking skill level, kitchen equipment, and meal prep preferences
- Support for family-specific needs including children's ages and medical conditions

#### Meal Planning System
- AI-powered weekly meal plan generation based on user preferences and constraints
- Recipe database with detailed nutritional information, cost estimates, and preparation details
- Filtering and search capabilities for recipes by dietary restrictions, cooking time, and difficulty
- Batch cooking and freezer-friendly recipe identification

#### Shopping Optimization
- Automatic shopping list generation from meal plans
- Price comparison across multiple grocery stores
- Shopping route optimization for efficiency
- Budget tracking and cost estimation features

#### Nutrition Tracking
- Comprehensive nutritional analysis with macro and micronutrient tracking
- Visual progress indicators for daily nutritional goals
- Family-wide nutrition management with individual dietary considerations

### Development and Deployment Architecture
- **Build System**: Vite for frontend bundling with esbuild for backend compilation
- **Development Environment**: Hot reload for both frontend and backend code
- **Type Safety**: End-to-end TypeScript with shared type definitions
- **Code Quality**: Structured with path aliases for clean imports and modular architecture

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework for Node.js
- **react**: Frontend user interface library
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### AI and External Services
- **openai**: OpenAI API client for recipe and meal plan generation
- **Planned integrations**: Real grocery store APIs for price data

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **drizzle-kit**: Database migration and introspection tools

### Form and Validation
- **react-hook-form**: Performance-optimized form library
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition

### Utilities
- **date-fns**: Date manipulation library
- **wouter**: Lightweight routing library
- **nanoid**: Unique ID generation