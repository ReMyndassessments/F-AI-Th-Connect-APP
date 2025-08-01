# F-AI-TH-Connect - Christian AI Chat Application

## Overview
F-AI-TH-Connect is a Christian-focused AI chat application that offers biblical guidance, spiritual support, and Christian wisdom through conversational AI. The application aims to combine modern web technologies with AI-powered responses grounded in Scripture and Christian theology, providing an accessible platform for spiritual growth and support. Key capabilities include AI chat, Bible study tools, and faith-based games.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application features a modern full-stack architecture, separating client and server components, and prioritizing developer experience with fast iteration cycles while maintaining production readiness through scalable design patterns.

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI**: shadcn/ui (Radix UI primitives) and Tailwind CSS with a custom Christian-themed design system
- **Build Tool**: Vite
- **UI/UX Decisions**: Mobile-first responsive design, intuitive chat interface, advanced text highlighting, integrated scripture display, accessible navigation, and comprehensive help center. Includes a prompt library designed for ease of use, especially for older users.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Development**: Hot module replacement via Vite integration

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Centralized definitions in `/shared/schema.ts`
- **Development Storage**: In-memory for rapid development
- **Production Storage**: PostgreSQL via Neon Database

### Key Features & Technical Implementations
- **AI Integration**: DeepSeek AI API with Christian-focused system prompts. Optimized for speed and context, including dynamic token allocation and scripture reference extraction.
- **Data Flow**: Supports text input, voice transcription (removed), file uploads (text, PDFs, images up to 5MB), AI message processing, and user interaction features like message actions (copy, download, share).
- **Authentication**: Secure admin authentication with bcrypt password hashing and role-based access.
- **Content Management**: Feature flag system for rollouts and advertisements, and a complete CRUD system for faith-based promotional content.
- **Bible Tools**: Dynamic Bible verse loading via `bible-api.com` (formerly API.Bible) with version comparison (KJV, NIV, ESV, NLT, NASB), predictive text, search history, favorites, and text-to-speech for verses and AI responses (using ElevenLabs premium voices).
- **Bible Games**: Comprehensive system with four game types (Scripture Scramble, Fill-in-the-Blank, Character Guessing, Memory Challenge), multiple difficulty levels, score tracking, hints, multi-question sessions, and intelligent spell check with biblical terms dictionary.
- **Ministry Support**: GiveSendGo donation integration and tasteful ministry support reminders.
- **PWA Support**: Full Progressive Web App (PWA) implementation with service worker, app manifest, install prompts, offline capability, and home screen installation.

## External Dependencies

### Production
- **AI Service**: DeepSeek API
- **Database**: PostgreSQL (via Neon Database)
- **UI Libraries**: Radix UI component collection
- **Text-to-Speech**: ElevenLabs API (premium voices)
- **Bible API**: `bible-api.com`

### Development
- **Type Safety**: TypeScript
- **Build Tools**: Vite, esbuild