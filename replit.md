# UrbanGrid Property Inspection Website

## Overview

UrbanGrid is a modern, fully responsive property inspection and snagging company website built for the UAE market. The application provides professional property inspection services across Dubai, Abu Dhabi, Sharjah, and other Emirates. It features a comprehensive content management system for blog posts, service information, and client inquiries, designed to establish trust and authority in the property inspection industry.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (December 2024)

### International Standards SEO Implementation
- Added comprehensive International Standards section to homepage featuring NFPA, ASHRAE, and ASTM standards
- Integrated international standards keywords naturally throughout existing content:
  - NFPA standards: NFPA 70, NFPA 72, NFPA 101, NFPA 25, NFPA 110, NFPA 730, NFPA 731
  - ASHRAE standards: ASHRAE Standard 180, ASHRAE 62.1
  - ASTM standards: ASTM E2018 Property Condition Assessment
- Enhanced meta descriptions and SEO tags to include international standards keywords
- Added structured data (Schema Markup) with international standards as additional properties
- Implemented authority links to official NFPA.org, ASHRAE.org, and ASTM.org websites
- Created FAQ section addressing international standards in property inspection context
- Updated LocalBusiness schema to include NFPA, ASHRAE, and ASTM certified services

### Google Analytics Conversion Tracking
- Implemented Google Analytics conversion tracking with event snippet (AW-11443889137/L_xgCJG38ogbEPHH79Aq)
- Added conversion tracking to all form submissions (consultation, contact, scroll-triggered forms)
- Created analytics utility for seamless conversion event tracking

### Internal Linking SEO Optimization
- Enhanced blog pages with keyword-rich internal links targeting main SEO terms
- Added contextual linking from blog content to service pages using exact target keywords:
  - "snagging company dubai" → /locations/dubai/snagging-company
  - "snagging company abu dhabi" → /locations/abu-dhabi/snagging-company  
  - "snagging company sharjah" → /locations/sharjah/snagging-company
  - "property inspection dubai" → /locations/dubai/property-inspection
  - "property inspection abu dhabi" → /locations/abu-dhabi/property-inspection
  - "property inspection sharjah" → /locations/sharjah/property-inspection
- Updated breadcrumb navigation with keyword-rich anchor text: "Property Inspection UAE" → "Property Snagging Blog"
- Enhanced footer navigation with location-specific SEO keywords
- Added strategic CTA sections in blog posts with targeted keyword anchor text
- Implemented comprehensive location-specific cross-linking across all blog pages
- Updated blog featured services cards to use exact keyword phrases as headlines

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors (dark green #064E3B and black)
- **Typography**: Inter font family for modern, professional appearance
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit-based OAuth integration with session management
- **File Storage**: Integration with Google Cloud Storage and Uppy for file uploads
- **API Design**: RESTful endpoints with proper error handling and request logging

### Database Schema Design
- **Users Table**: Stores user profiles with role-based access (admin/user)
- **Blog Posts Table**: Content management with status, categories, and SEO metadata
- **Contact Submissions Table**: Customer inquiry management with read status tracking
- **Sessions Table**: Secure session storage for authentication persistence

### Authentication & Authorization
- **Authentication Provider**: Replit OAuth with OpenID Connect
- **Session Management**: PostgreSQL-backed session storage with configurable TTL
- **Role-Based Access**: Admin and user roles with protected routes
- **Security**: HTTP-only cookies, CSRF protection, and secure session handling

### Content Management System
- **Blog Management**: Full CRUD operations with draft/published status
- **Rich Content**: Support for categories, tags, featured images, and SEO metadata
- **Slug Generation**: Automatic URL-friendly slug creation from titles
- **Search & Filtering**: Category-based filtering and text search capabilities

### Service Architecture
- **Service Pages**: Static service information with detailed descriptions
- **Contact Forms**: Multiple contact forms with email integration
- **Consultation Booking**: Dedicated consultation request system
- **Phone Integration**: WhatsApp and direct call integration for immediate contact

### Performance Optimizations
- **Image Optimization**: Responsive images with proper aspect ratios
- **Code Splitting**: Route-based code splitting for improved load times
- **Caching Strategy**: Query caching with TanStack Query for reduced API calls
- **SEO Optimization**: Meta tags, structured data, and semantic HTML

### UI/UX Design Patterns
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Component Library**: Consistent design system with reusable components
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Toast Notifications**: User feedback for form submissions and actions

## External Dependencies

### Database & Storage
- **Neon Database**: PostgreSQL database hosting with serverless architecture
- **Google Cloud Storage**: File and image storage for blog content and assets

### Authentication Services
- **Replit Auth**: OAuth provider for admin authentication and user management

### Communication & Notifications
- **Email Service**: Email sending capability for form submissions (configured for info@snagging.me)
- **WhatsApp Integration**: Direct messaging for customer inquiries (+971 58 568 6852)
- **Phone Integration**: Click-to-call functionality for immediate contact (+971 58 568 6852)
- **Google Analytics**: Google tag (gtag.js) with conversion tracking ID AW-11443889137

### Development & Deployment
- **Vite**: Fast build tool with HMR for development
- **Vercel**: Deployment platform (deployment-ready configuration)
- **Replit**: Development environment with integrated tooling

### Third-Party Libraries
- **Uppy**: File upload handling with dashboard interface
- **Memoizee**: Caching utility for performance optimization
- **React Day Picker**: Calendar component for date selection
- **Lucide React**: Icon library for consistent iconography

### Fonts & Assets
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon fonts for social media and communication icons
- **Unsplash**: High-quality stock images for service illustrations