# F-AI-TH-Connect - Christian AI Chat Application

## Overview
F-AI-TH-Connect is a Christian-focused AI chat application that offers biblical guidance, spiritual support, and Christian wisdom through conversational AI. The application aims to combine modern web technologies with AI-powered responses grounded in Scripture and Christian theology, providing an accessible platform for spiritual growth and support. Key capabilities include AI chat, Bible study tools, and faith-based games.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)
- ✅ Fixed all unscramble letter mismatches for Bible character names (Nebuchadnezzar, Abraham, Jeremiah, Ruth, Melchizedek, Zechariah)
- ✅ Resolved API route order issue preventing Quick Fire and Team Building modes from functioning
- ✅ All four Bible Games modes now fully operational with proper API endpoints
- ✅ Enhanced spell check system working correctly with biblical terms dictionary and real-time suggestions
- ✅ Help Center comprehensively updated with detailed documentation for all new features
- ✅ Mobile responsiveness verified and optimized across all pages and features
- ✅ Multi-question quiz sessions with progress tracking and score management
- ✅ Question skipping functionality and enhanced user experience features implemented
- ✅ Comprehensive demo video assets created and expanded to showcase 25+ features (vs. original 5 screens)
- ✅ Demo video extended from 4:20 to 5:45 runtime with complete feature coverage
- ✅ Added file upload processing, Prompt Library, advanced text highlighting, and feature integration demos
- ✅ Professional marketing visuals generated for video thumbnail and app interface showcases
- ✅ **Multiple Choice Dropdown System Implemented** - Replaced text input with 4-option dropdowns for all quiz questions, including smart answer generation and comprehensive error handling (February 2025)
- ✅ **Predictive Bible Verse Search** - Added real-time verse content search allowing users to find verses by typing remembered words or phrases, with 300ms debounced search and formatted results display (February 2025)
- ✅ **Comprehensive Bible Search Database** - Expanded to 100+ verses covering all 66 Bible books with enhanced fuzzy matching, word-based search, and relevance scoring for better verse discovery (February 2025)

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
- **Bible Tools**: Dynamic Bible verse loading via `bible-api.com` (formerly API.Bible) with version comparison (KJV, NIV, ESV, NLT, NASB), predictive text, search history, favorites, predictive verse content search, and text-to-speech for verses and AI responses (using ElevenLabs premium voices).
- **Bible Games**: Comprehensive system with four game types (Scripture Scramble, Fill-in-the-Blank, Character Guessing, Memory Challenge), multiple difficulty levels, score tracking, hints, multi-question sessions, enhanced spell check with biblical terms dictionary, and **multiple choice dropdown interface** with smart answer generation. Features four distinct game modes:
  * Individual Play - Original quiz system with enhanced spell check and intelligent biblical term suggestions
  * Bible Study Icebreaker - Customizable group challenges (3-15 people, 10-30 minutes) with balanced difficulty and facilitator instructions
  * Quick Fire - Rapid-fire questions for energizing groups (10-20 questions) with immediate feedback
  * Team Building - Structured challenges with warm-up, collaboration, and discussion phases for ministry teams
  All questions now feature 4-option multiple choice dropdowns with 1 correct answer and 3 contextually relevant wrong answers. Full mobile optimization with large touch targets and comprehensive error handling.
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