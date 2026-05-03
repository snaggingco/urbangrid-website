# UrbanGrid Property Inspection Website

## Overview

UrbanGrid is a modern, fully responsive property inspection and snagging company website built for the UAE market. The application provides professional property inspection services across Dubai, Abu Dhabi, Sharjah, and other Emirates. It features a comprehensive content management system for blog posts, service information, and client inquiries, designed to establish trust and authority in the property inspection industry.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (May 2026 — Drastic 32-URL Site Trim)

User decided to drastically trim the site from 186 → **31 URLs** to give Google a clean, focused, high-quality site after the ranking drop.

### Final URL structure (31 URLs in sitemap)
- **9 core pages**: `/`, `/about`, `/services`, `/blog`, `/broker-referrals`, `/careers`, `/contact`, `/privacy-policy`, `/terms-of-service`
- **16 sub-service pages**: 6 Property Snagging + 5 RERA Services + 5 Technical Inspections (under `/services/:category/:slug`)
- **6 blog posts** (the longest, highest-authority NFPA / ASHRAE / case study pieces). All other 150 posts archived → 410 Gone.

### Removed
- **All 7 location pages** deleted: `client/src/pages/locations/` directory removed entirely (Dubai, AbuDhabi, Sharjah, Ajman, RasAlKhaimah, Fujairah, UmmAlQuwain)
- **All `/locations/*` routes** removed from `App.tsx`
- **All `/locations/*` SEO entries** removed from `client/src/components/SEO.tsx` (~13 entries) and the location-specific schema injection block
- **Sub-route canonical fallback** (`locationSubRouteMatch` regex) removed from SEO.tsx — no longer needed
- **Footer**: removed "Service Locations" column (replaced with "Services" links to /services, /broker-referrals, /careers) and 4 dead `/locations/*/snagging-company` tag links
- **Home.tsx**: location coverage cards no longer link out — now display-only with single `/contact` CTA below
- **Blog.tsx & BlogDetail.tsx**: removed `/locations/dubai/...` / `/locations/abu-dhabi/...` cross-links; replaced "Book in Dubai/Abu Dhabi" CTAs with `/contact` + `/services`
- **server/sitemap.ts**: removed all 7 emirate URLs and ~24 commented-out location-service combo URLs
- **server/routes.ts**: removed `locationSEOData` map (~24 entries) and the `/locations/:emirate/:service` SSR handler
- **DB**: 150 published blog posts set to `status='archived'`; only 6 remain published

### Added
- **`/locations` and `/locations/*` return HTTP 410 Gone** (registered first in `registerRoutes`, before Vite's SPA catch-all) with `noindex, nofollow` so Google deindexes the entire location subtree permanently
- `/broker-referrals` and `/careers` added to `sitemap.xml`

### Database
- `blog_posts`: 6 published, 210 archived (was 156 published, 60 archived)
- Kept slugs: `nfpa-72-fire-alarm-systems-property-snagging-uae`, `nfpa-25-fire-protection-systems-property-snagging-uae`, `nfpa-70-national-electrical-code-property-snagging-uae`, `nfpa-101-life-safety-code-property-snagging-uae`, `ashrae-standard-180-building-commissioning-property-snagging-uae`, `case-study-palm-jumeirah-penthouse-inspection-mep-defects`

## Recent Changes (May 2026 — Sitemap Quality Cleanup)

Comprehensive review of all 247 sitemap URLs identified Google's "scaled content abuse" pattern as the likely cause of the ranking drop.

### Content removed (60 posts, served as 410 Gone)
- 25 `*-expert-quality-assessment` blog posts — confirmed via MD5 hash to be 100% identical content across emirates with only city name swapped (5 unique articles spun into 25 URLs)
- 35 `*-complete-guide-2025` blog posts — thin (~350 words), heavily templated with marginal per-emirate variation
- All 60 set to `status='archived'` in DB; `/blog/:slug` and `/api/blog/:slug` now return **HTTP 410 Gone** with a `noindex` page so Google deindexes them
- Sitemap shrunk from 247 → 189 URLs and no longer references the archived slugs

### Backend
- `/news-sitemap.xml`, `/video-sitemap.xml`, `/image-sitemap.xml` now 301-redirect to `/sitemap.xml` (previously fell through to SPA returning 200 HTML)
- `/api/blog/:slug` returns **410 Gone** for archived posts (vs generic 404 before)
- SSR `/blog/:slug` route now:
  - Returns **410 Gone** with `noindex` for archived posts
  - Truncates title to 56 chars + " | UrbanGrid" suffix (max 68 chars total)
  - Truncates description to 158 chars
  - Adds **`image`** field to BlogPosting JSON-LD (uses `featuredImage` or fallback)
  - Adds **`publisher.logo`** ImageObject with `favicon-192x192.png`
  - Adds `mainEntityOfPage`, Twitter Card meta, proper HTML escaping
- `/privacy-policy` and `/terms-of-service` added to sitemap.xml

## Recent Changes (April 2026 — Squirrelscan Audit Fix Pass)

### Security
- Added Content-Security-Policy header (allows GTM, Google Ads, Google Analytics, Unsplash, Replit dev banner)
- Added Referrer-Policy: `strict-origin-when-cross-origin`
- Added Permissions-Policy: `camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- Strengthened HSTS with `preload` directive
- Eliminated false-positive "leaked Cloudflare token" by removing FontAwesome CDN

### Performance
- Self-hosted Inter font via `@fontsource/inter` (replaces render-blocking Google Fonts CDN)
- Self-hosted FontAwesome via `@fortawesome/fontawesome-free` (replaces render-blocking cdnjs CDN)
- Added gzip/brotli compression middleware to Express
- Removed Google Fonts CDN reference from SSR HTML in `server/routes.ts`

### SEO & Sitemap
- Shortened default `<title>` in `index.html` from 67 → 58 chars
- Shortened default meta description from 234 → 156 chars
- Synced shortened title/description across Open Graph and Twitter Card meta
- Added 301 redirects from `/sitemap_index.xml`, `/sitemap-index.xml`, `/sitemaps.xml`, `/sitemap1.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/category-sitemap.xml` to `/sitemap.xml`
- Completed LocalBusiness JSON-LD address with `streetAddress` and `postalCode`

### Accessibility
- Added skip-to-main-content link in `index.html` shell (visible on focus)
- Added `id="main-content"` to `<main>` landmark in `App.tsx`

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