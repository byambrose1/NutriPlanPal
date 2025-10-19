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
- **Payment Processing**: Stripe integration for subscription management with hosted Checkout and Customer Portal
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
- Smart pantry inventory integration automatically excludes items you already have
- Price comparison across multiple grocery stores
- Shopping route optimization for efficiency
- Budget tracking and cost estimation features

#### Pantry Inventory Management (NEW)
- Real-time pantry tracking with household-level inventory
- Add, edit, and delete pantry items with quantity, unit, and expiration tracking
- Category-based organization (Produce, Dairy, Meat, Grains, Pantry Staples, Frozen, etc.)
- Search and filter functionality for quick ingredient lookup
- Expiration date warnings to reduce food waste
- Smart shopping list integration - automatically excludes items already in your pantry
- Notes field for additional details (location, brand, storage notes)

#### Nutrition Tracking
- Comprehensive nutritional analysis with macro and micronutrient tracking
- Visual progress indicators for daily nutritional goals
- Family-wide nutrition management with individual dietary considerations
- Weekly and monthly nutrition reports with interactive charts and trend analysis

#### Subscription Management
- Two-tier subscription model: Basic ($9.99/month) and Premium ($19.99/month)
- Stripe-powered payment processing with hosted Checkout and Customer Portal
- Automatic subscription lifecycle management via webhooks
- Graceful degradation - app functions without Stripe configuration
- Subscription features:
  - **Basic Tier**: Up to 10 household members, basic meal plans, standard recipes
  - **Premium Tier**: Unlimited household members, AI-powered meal plans, advanced nutrition tracking
- User-friendly subscription management in profile settings with one-click upgrades and portal access

#### Admin Panel (NEW)
- Comprehensive admin dashboard with platform-wide metrics and analytics
- User management with search, filtering, and account controls
- View and manage user subscriptions and admin roles
- Household monitoring with detailed member information
- Real-time analytics with interactive charts for user growth, revenue, and engagement
- Admin-only navigation and route protection
- Features:
  - **Dashboard**: Key metrics including total users, households, revenue, and meal plans
  - **User Management**: Search users, view details, modify subscriptions, grant/revoke admin access
  - **Household Management**: View all households with owner and member information
  - **Analytics**: Detailed charts showing user growth, revenue trends, and platform engagement over time
- Access control via `isAdmin` flag in user profiles

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
- **stripe**: Stripe API for subscription billing and payment processing
- **@stripe/stripe-js**: Stripe client library for secure checkout flows
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

## Subscription Integration Setup

### Required Environment Variables
The following secrets must be configured in Replit Secrets for full subscription functionality:

1. **STRIPE_SECRET_KEY**: Your Stripe secret API key (starts with `sk_`)
   - Get from: Stripe Dashboard → Developers → API Keys
   - Required for all Stripe operations (checkout, webhooks, portal)

2. **VITE_STRIPE_PUBLIC_KEY**: Your Stripe publishable key (starts with `pk_`)
   - Get from: Stripe Dashboard → Developers → API Keys
   - Required for frontend Stripe.js initialization

3. **STRIPE_WEBHOOK_SECRET**: Webhook signing secret (starts with `whsec_`)
   - Get from: Stripe Dashboard → Developers → Webhooks
   - Configure webhook endpoint: `https://your-app.repl.co/api/stripe/webhook`
   - Listen for events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Stripe Products and Pricing
Configure these products in your Stripe Dashboard:

1. **Basic Plan**: $9.99/month
   - Create product: "NutriPlan Basic"
   - Get price ID and use as `BASIC_PRICE_ID` in frontend

2. **Premium Plan**: $19.99/month
   - Create product: "NutriPlan Premium"
   - Get price ID and use as `PREMIUM_PRICE_ID` in frontend

### Graceful Degradation
The app is designed to work without Stripe configuration:
- All subscription endpoints return 503 if Stripe keys are missing
- Users can still use the app with limited features
- No crashes or errors if Stripe is not configured

### Testing Subscription Flow
1. Use Stripe test mode keys during development
2. Test card: `4242 4242 4242 4242` (any future expiry, any CVC)
3. Webhook testing: Use Stripe CLI for local testing
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/webhook
   ```

### Production Deployment
1. Switch to live Stripe API keys in production
2. Configure webhook endpoint with live webhook secret
3. Test complete subscription flow end-to-end
4. Monitor webhook delivery in Stripe Dashboard