# Hope & Failure Band Website

A production-ready full-stack e-commerce and content management website for the Portland-based band Hope & Failure, featuring merchandise sales, event management, multimedia content, an admin dashboard, and enterprise-grade PostgreSQL database integration.

## Project Structure

```
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/     # Admin dashboard components
│   │   │   ├── forms/     # Form components (checkout, modals)
│   │   │   ├── layout/    # Layout components (header, sidebars)
│   │   │   └── ui/        # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services and utilities
│   │   ├── styles/        # SASS stylesheets
│   │   └── utils/         # Helper utilities
│   └── public/            # Static assets
├── backend/            # Node.js Express server
│   ├── src/
│   │   ├── config/        # Environment and service configuration
│   │   ├── middleware/    # Express middleware (auth, CORS, validation)
│   │   ├── models/        # Data models with PostgreSQL integration
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic and database services
│   │   └── server.js      # Main server file with startup logic
│   ├── prisma/           # Database schema and migrations
│   │   └── schema.prisma  # Prisma schema definition
│   └── tests/            # Comprehensive test suite
│       ├── unit/         # Unit tests for models and database
│       ├── api/          # API endpoint tests
│       └── integration/  # End-to-end system tests
├── shared/             # Shared types and constants
├── docs/               # Documentation and setup guides
└── package.json        # Root workspace configuration
```

## Tech Stack

### Frontend

-   **React 19** - UI framework
-   **TypeScript** - Type safety
-   **Vite** - Build tool and dev server
-   **SASS** - CSS preprocessing
-   **React Router DOM** - Client-side routing
-   **React Context API** - State management

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework with modular architecture
-   **PostgreSQL** - Production database via Supabase
-   **Prisma ORM** - Type-safe database operations and migrations
-   **CORS** - Cross-origin resource sharing

### E-commerce & Services

-   **Stripe** - Payment processing and checkout
-   **EmailJS** - Contact forms and order notifications

### Development Tools

-   **ESLint** - Code linting
-   **Jest** - Testing framework with comprehensive test suite
-   **Supertest** - API endpoint testing
-   **npm workspaces** - Monorepo management
-   **Git** - Version control

## Data Flow

### 1. **Frontend → Backend API → Database**

```
React Components → Context Providers → API Services → Express Routes → Prisma ORM → PostgreSQL
```

### 2. **E-commerce Flow**

```
Shop Page → Cart Context → Stripe Checkout → Success Page → Email Notifications → Inventory Updates
```

### 3. **Content Management**

```
Admin Dashboard → Context Updates → API Routes → Database Models → PostgreSQL → Frontend Display
```

### 4. **Data Persistence**

```
Admin Changes → Prisma Operations → PostgreSQL Storage → Real-time Frontend Updates
```

## ⭐️ Key Features

### Public Features

-   **Merchandise Store** - T-shirts and totes with inventory management
-   **Event Calendar** - Upcoming and past show listings
-   **Media Gallery** - Videos, music, and photo content
-   **Lyrics Database** - Song lyrics with search functionality
-   **Contact Forms** - EmailJS-powered contact system

### Admin Features

-   **Inventory Management** - Real-time stock updates with PostgreSQL persistence
-   **Content Management** - Full CRUD operations for events, videos, bio, and lyrics
-   **Order Monitoring** - Track sales and automatic inventory decrements
-   **Authentication** - Password-protected admin access
-   **Data Persistence** - All changes automatically saved to cloud database

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm 9+
-   Stripe account (for payments)
-   EmailJS account (for contact forms)
-   Supabase account (for PostgreSQL database)

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Start both frontend and backend
npm run dev

# Or start individually:
npm -w frontend run dev    # Frontend on http://localhost:5173
npm -w backend run start   # Backend on http://localhost:3000
```

### Environment Setup

Create environment files with your API keys:

-   `backend/.env` - Stripe secret key, Supabase database URLs
-   `frontend/.env.local` - Stripe publishable key, EmailJS config

### Database Setup

```bash
# Generate Prisma client and create database tables
cd backend
npx prisma db push

# (Optional) View your database
npx prisma studio
```

## Security Features

-   Environment variable management
-   Input sanitization and validation
-   Price validation on server-side
-   Content Security Policy (CSP)
-   Rate limiting and CORS protection
-   Secure headers and error handling
-   Database connection pooling and prepared statements
-   Type-safe database operations with Prisma

## Performance Optimizations

-   Font preloading and display optimization
-   Lazy loading with Intersection Observer
-   Component memoization
-   Image optimization and preloading
-   Passive event listeners
-   Code splitting and tree shaking
-   Database connection pooling and query optimization
-   Efficient database models with proper indexing

## Component Architecture

### Context Providers

-   `CartContext` - Shopping cart state and operations
-   `EventsContext` - Event data management
-   `VideosContext` - Video content management
-   `BioContext` - Band biography content
-   `LyricsContext` - Song lyrics management

### Shared Components

-   Layout components for consistent page structure
-   Form components for user interactions
-   UI components for reusable elements
-   Admin components for content management

## Database Architecture

### PostgreSQL Schema

-   **Inventory** - Product data with JSON inventory tracking
-   **Events** - Band shows and performances with metadata
-   **Videos** - YouTube video content with ordering
-   **Bio** - Band biography with flexible JSON structure
-   **Lyrics** - Song lyrics with instrumental flags

### Data Models

-   **Prisma ORM** integration for type-safe database operations
-   **Automatic migrations** with schema versioning
-   **Connection pooling** via Supabase for optimal performance
-   **CRUD operations** with comprehensive error handling
-   **Data seeding** for initial content population

## Testing Suite

### Comprehensive Test Coverage

```bash
# Run all tests
npm test

# Run specific test types
npm run test:db        # Database tests
npm run test:api       # API endpoint tests
npm run test:coverage  # Coverage report
```

### Test Categories

-   **Unit Tests** - Database connections, model operations, business logic
-   **API Tests** - HTTP endpoints, authentication, validation, error handling
-   **Integration Tests** - End-to-end workflows, data consistency, system recovery
-   **Performance Tests** - Database query optimization, concurrent operation handling

## Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm -w frontend run preview

# Database deployment
npx prisma migrate deploy  # Production migrations
npx prisma generate        # Generate client
```

### Production Readiness

-   **Scalable Architecture** - Modular backend with separation of concerns
-   **Cloud Database** - PostgreSQL via Supabase with connection pooling
-   **Environment Management** - Separate configs for development/production
-   **Error Handling** - Comprehensive logging and graceful degradation
-   **Performance Monitoring** - Database query optimization and response time tracking

The project uses Vite for fast builds, includes path aliases for clean imports, and features a monorepo structure with shared types and constants between frontend and backend. The PostgreSQL database integration ensures data persistence and scalability for production deployment.
