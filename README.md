# Hope & Failure Band Website

A **production-ready**, **security-hardened** full-stack e-commerce and content management website for the Portland-based band Hope & Failure. Features merchandise sales, event management, multimedia content, secure admin dashboard, and enterprise-grade PostgreSQL database integration.

[![Security](https://img.shields.io/badge/Security-Enterprise_Grade-green?style=flat-square)](#security-features)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square)](#database-architecture)
[![Testing](https://img.shields.io/badge/Testing-Comprehensive-orange?style=flat-square)](#testing-suite)
[![Production](https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square)](#production-readiness)

---

## Project Structure

```
├── frontend/              # Next.js 15 TypeScript frontend
│   ├── src/app/           # App router pages (Next.js 15)
│   ├── src/components/    # Reusable React components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── forms/         # User interaction forms
│   │   ├── layout/        # Layout & navigation
│   │   └── ui/            # Reusable UI elements
│   ├── src/context/       # React Context providers
│   ├── src/config/        # Frontend configuration
│   └── src/services/      # API services & utilities
│
├── backend/               # Node.js Express server
│   ├── src/middleware/    # Security & validation middleware
│   │   ├── auth.js        # Admin authentication (bcrypt)
│   │   ├── security.js    # Rate limiting & security headers
│   │   ├── validation.js  # Input sanitization & validation
│   │   └── logging.js     # Winston-based logging
│   ├── src/routes/        # API endpoints with security
│   ├── src/services/      # Business logic & database ops
│   ├── src/config/        # Environment & service config
│   ├── prisma/           # Database schema & migrations
│   ├── scripts/          # Utility scripts (hash generation)
│   └── tests/            # Comprehensive test suite
│
├── docs/                  # Documentation & setup guides
├── shared/                # Shared types & constants
└── package.json           # Workspace configuration
```

---

## Tech Stack

| Category          | Technologies                                              |
| ----------------- | --------------------------------------------------------- |
| **Frontend**      | Next.js 15, React 19, TypeScript, Sass, React Context API |
| **Backend**       | Node.js, Express.js, Prisma ORM, PostgreSQL               |
| **Database**      | Supabase PostgreSQL with connection pooling               |
| **Security**      | Helmet, Rate Limiting, bcrypt, Input Validation, CORS     |
| **Payments**      | Stripe (with webhook verification)                        |
| **Communication** | EmailJS for contact forms & notifications                 |
| **Testing**       | Jest, Supertest (Unit, API, Integration tests)            |
| **Monitoring**    | Winston logging, Health checks                            |
| **Development**   | ESLint, TypeScript, Nodemon, Concurrently                 |

---

## ⭐ Key Features

### **E-commerce Features**

-   **Secure Shopping Cart** with persistent state
-   **Stripe Integration** with webhook verification
-   **Inventory Management** with real-time stock updates
-   **Order Processing** with automated email notifications
-   **Server-side Price Validation** to prevent tampering

### **Content Management**

-   **Event Calendar** with upcoming/past show listings
-   **Video Gallery** with YouTube integration
-   **Lyrics Database** with search functionality
-   **Band Biography** with rich content management
-   **Media Assets** optimized for web delivery

### **Admin Dashboard**

-   **Secure Authentication** with bcrypt password hashing
-   **Rate-Limited Access** to prevent brute force attacks
-   **Real-time CRUD Operations** for all content types
-   **Inventory Management** with PostgreSQL persistence
-   **Order Monitoring** with sales tracking

### **Security Features**

-   **Enterprise-grade Authentication** with secure password handling
-   **Rate Limiting** on all API endpoints and admin routes
-   **Input Sanitization** to prevent XSS attacks
-   **Stripe Webhook Verification** to prevent payment fraud
-   **Security Headers** (CSP, HSTS, XSS Protection)
-   **Environment Variable Protection** with proper .gitignore
-   **Comprehensive Logging** for security event monitoring

---

## Architecture

### **Data Flow**

```
Frontend → Context Providers → API Services → Express Routes →
Security Middleware → Business Logic → Prisma ORM → PostgreSQL
```

### **Security Layers**

```
Client Request → Rate Limiting → CORS → Security Headers →
Input Validation → Authentication → Business Logic → Database
```

### **Admin Authentication Flow**

```
Admin Login → Password Validation (bcrypt) → Rate Limit Check →
Context Update → Protected Route Access → Secure Operations
```

---

## Database Architecture

### **PostgreSQL Schema (via Prisma)**

-   **Inventory** - Product data with JSON inventory tracking
-   **Events** - Band performances with metadata & timestamps
-   **Videos** - YouTube content with ordering & descriptions
-   **Bio** - Band biography with flexible JSON structure
-   **Lyrics** - Song lyrics with instrumental flags

### **Database Features**

-   **Type-safe Operations** with Prisma ORM
-   **Connection Pooling** via Supabase for optimal performance
-   **Automatic Migrations** with schema versioning
-   **Data Seeding** for initial content population
-   **Query Optimization** with proper indexing

---

## Testing & Quality Assurance

The application includes a comprehensive testing suite covering:

-   **Unit Tests** - Database connections, models, utilities
-   **API Tests** - HTTP endpoints, authentication, validation
-   **Integration Tests** - End-to-end workflows, data consistency
-   **Performance Tests** - Database optimization, concurrent operations

---

## Production Features

### **Security & Performance**

-   **Security Headers** configured (Helmet)
-   **Rate Limiting** active on all endpoints
-   **Environment Variables** properly configured
-   **Database Connection Pooling** enabled
-   **Error Handling** with comprehensive logging
-   **Admin Authentication** with bcrypt hashing
-   **Stripe Webhook Verification** implemented
-   **Input Validation** on all user inputs
-   **CORS Configuration** for production domains

### **Performance Optimizations**

-   **Connection Pooling** for database efficiency
-   **Image Optimization** with Next.js built-ins
-   **Code Splitting** and tree shaking
-   **Lazy Loading** with Intersection Observer
-   **Font Optimization** with preloading
-   **Component Memoization** for React performance

---

## Security Implementation

This project implements **enterprise-grade security** with multiple layers of protection:

### **Authentication & Authorization**

-   **bcrypt Password Hashing** for admin authentication
-   **Rate Limiting** on admin routes (5 attempts per 15 minutes)
-   **Secure Password Requirements** enforced

### **API Security**

-   **Helmet Security Headers** (CSP, HSTS, XSS Protection)
-   **Global Rate Limiting** (100 requests per 15 minutes)
-   **Input Sanitization** to prevent XSS attacks
-   **Request Validation** with comprehensive error handling

### **Payment Security**

-   **Stripe Webhook Verification** to prevent fraud
-   **Server-side Price Validation** to prevent tampering
-   **Secure Environment Variable Management**

### **Infrastructure Security**

-   **Comprehensive Logging** with Winston
-   **Health Monitoring** with detailed system checks
-   **CORS Configuration** for production domains
-   **Secure Database Connection** with pooling

---

## Monitoring & Health Checks

### **Health Endpoint**

**GET** `/api/health` provides comprehensive system status:

-   Database connectivity
-   Stripe service status
-   Memory usage monitoring
-   Server uptime tracking
-   Environment configuration verification

### **Logging**

-   **Request/Response Logging** for API monitoring
-   **Security Event Logging** for suspicious activity
-   **Error Logging** with stack traces for debugging
-   **Performance Monitoring** for optimization insights

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## About Hope & Failure

Hope & Failure is a Portland-based ethereal doom-folk band whose sound navigates between delicate, atmospheric, and heavy/cathartic moments. Their lyrics explore themes of death, rebirth, nature, connection with the unseen, and a desire to exist together beyond the confines of the capitalist hellscape. This website serves as their digital home, merchandise platform, and connection point with fans worldwide.

**Visit the live website:** [hopeandfailure.com](https://hopeandfailure.com) _(when deployed)_

---

_Built with ❤️ for the music community._
