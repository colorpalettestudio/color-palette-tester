# Color Palette Tester

## Overview

The Color Palette Tester is a web-based accessibility tool that allows users to test all color combinations from their brand palette against WCAG (Web Content Accessibility Guidelines) standards. Users can paste colors in various formats (HEX, RGB, HSL), view contrast ratios for every foreground/background pairing, filter by WCAG compliance levels, and export their favorite combinations as PNG or PDF.

The application is designed as a free, privacy-focused microsite with SEO optimization, serving designers, developers, and brand owners who need to ensure their color choices meet accessibility standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Single-page application (SPA) with client-side routing via Wouter

**UI Component Library**
- shadcn/ui components built on Radix UI primitives
- TailwindCSS for utility-first styling with custom design tokens
- Design system follows the "New York" style variant with custom color variables
- CSS custom properties for theme support (light/dark mode capability)

**State Management**
- React hooks (useState, useEffect) for local component state
- No global state management library - state is lifted where needed
- Real-time color testing with automatic re-calculation on palette changes

**Color Processing**
- Custom color utilities for parsing HEX, RGB, and HSL formats
- WCAG contrast ratio calculations using relative luminance formulas
- Support for drag-and-drop reordering of color swatches

**Export Functionality**
- html2canvas for PNG image generation of favorite color pairs
- jsPDF for PDF export with custom card layouts
- Studio Code format export (proprietary format: `CPS[#color1,#color2,...]`)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API routes
- Node.js runtime environment
- Middleware-based request/response pipeline with logging

**Development vs Production**
- Development: Vite dev server integrated with Express for HMR
- Production: Static file serving from `dist/public` directory
- Build process bundles server code with esbuild

**Session & Storage**
- MemStorage class for in-memory user data (currently minimal backend data requirements)
- Interface-based storage design (IStorage) allows easy swapping to database implementation
- No server-side color processing - all calculations happen client-side for privacy

### Data Storage

**Database Configuration**
- Drizzle ORM configured for PostgreSQL (via @neondatabase/serverless)
- Schema defined in `shared/schema.ts` with user table structure
- Currently using in-memory storage; database connection prepared but not actively used
- Migration files in `migrations/` directory

**Client-Side Storage**
- LocalStorage for cookie consent preferences
- No persistent storage of user color palettes (privacy-by-design)
- Favorites stored in component state only (lost on page refresh)

### Design System

**Typography**
- Primary font: Inter (loaded from Google Fonts)
- Font hierarchy with bold weights for headings, regular for body text
- Font size range: 10-32px for adjustable preview text

**Color Palette**
- Pure white background (#FFFFFF) for light mode
- Near-black primary actions (#111827)
- Muted gray borders (#E5E7EB)
- Green badges for passing contrast, red for failing
- Animated rainbow gradient on "Color Palette" text (respects prefers-reduced-motion)

**Layout System**
- Max container width: 960-1200px, centered
- Tailwind spacing scale (4, 6, 8, 12, 16, 24)
- Responsive grid for color pair cards (min-width ~280px)
- Generous whitespace following design guidelines

### SEO & Performance

**Meta Tags**
- Comprehensive Open Graph and Twitter Card tags
- Structured data (Schema.org SoftwareApplication type)
- Canonical URLs and proper meta descriptions
- Preconnect hints for Google Fonts

**Performance Optimization**
- Vite's code splitting and tree shaking
- Font preloading for Inter, Roboto, Open Sans, Lato, Montserrat
- Lazy loading of export functionality (html2canvas, jsPDF loaded on demand)

**Content Structure**
- Semantic HTML with proper heading hierarchy
- Educational sections for SEO (How It Works, WCAG Levels, FAQ)
- Internal linking to related tools and legal pages

## External Dependencies

### Third-Party Services

**Google Services**
- Google Fonts API: Serving Inter and other font families
- Google Analytics: Traffic analysis (referenced in privacy policy)
- Google AdSense: Advertisement placeholders throughout the site

**Design Tools Ecosystem**
- References to companion tools: Color Code Converter, Color Palette Generator, Color Palette Fixer
- All part of "The Color Palette Studio" product family

### NPM Dependencies

**UI & Interaction**
- @radix-ui/* (multiple packages): Accessible UI primitives for dialogs, dropdowns, tooltips, etc.
- @tanstack/react-query: Server state management (minimal usage, prepared for future API calls)
- wouter: Lightweight client-side routing
- embla-carousel-react: Carousel functionality
- cmdk: Command palette component

**Forms & Validation**
- react-hook-form: Form state management
- @hookform/resolvers: Form validation resolvers
- zod: Schema validation
- drizzle-zod: Drizzle ORM to Zod schema conversion

**Export & Document Generation**
- html2canvas: Capturing DOM elements as images
- jsPDF: PDF generation from canvas/HTML
- date-fns: Date formatting utilities

**Database & ORM**
- drizzle-orm: TypeScript ORM for PostgreSQL
- @neondatabase/serverless: Neon database driver
- connect-pg-simple: PostgreSQL session store for Express

**Styling**
- tailwindcss: Utility-first CSS framework
- tailwind-merge: Merging Tailwind classes safely
- clsx: Conditional className construction
- class-variance-authority: Creating component variants

**Build Tools**
- vite: Build tool and dev server
- @vitejs/plugin-react: React support for Vite
- typescript: Type checking
- esbuild: Bundling server code
- @replit/vite-plugin-*: Replit-specific development tools

### Deployment Platform

**Vercel**
- Configured via `vercel.json`
- Build command: `npm run build`
- Output directory: `dist/public`
- SPA routing with rewrites to `/index.html`

### Legal & Compliance

**Cookie Consent**
- Custom cookie consent banner component
- Cookie preferences page for granular control (necessary, analytics, advertising)
- LocalStorage-based preference persistence

**Legal Pages**
- Privacy Policy: Details Google Analytics and AdSense data collection
- Terms of Service: "As is" warranty disclaimer and acceptable use policy
- Contact page: Email support at support@thecolorpalettestudio.com