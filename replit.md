# F-AI-TH-Connect - Christian AI Chat Application

## Overview

F-AI-TH-Connect is a Christian-focused AI chat application that provides biblical guidance, spiritual support, and Christian wisdom through conversational AI. The application combines modern web technologies with AI-powered responses grounded in Scripture and Christian theology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Christian-themed design system
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Development**: Hot module replacement via Vite integration

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Development Storage**: In-memory storage implementation for rapid development
- **Production Ready**: PostgreSQL configuration via Neon Database

## Key Components

### Database Schema
The application uses these main entities:
- **Users**: Basic user authentication (id, username, password)
- **Chat Sessions**: Conversation containers with unique session IDs
- **Messages**: Individual messages with role (user/assistant), content, and optional scripture references
- **Admin Users**: Secure admin authentication with bcrypt password hashing and role-based access
- **Admin Sessions**: Session management for admin dashboard access with expiration
- **Feature Flags**: System for controlling feature rollouts and advertisements
- **Advertisements**: Faith-based promotional content with placement and targeting controls

### API Endpoints

**Chat Endpoints:**
- `POST /api/chat/sessions` - Create new chat sessions
- `GET /api/chat/sessions/:sessionId/messages` - Retrieve conversation history  
- `POST /api/chat/sessions/:sessionId/messages` - Send messages and receive AI responses

**Admin Authentication Endpoints:**
- `POST /api/admin/login` - Admin login with username/password
- `POST /api/admin/logout` - Admin logout and session cleanup
- `GET /api/admin/verify` - Verify admin session validity

**Protected Admin Endpoints:**
- `GET /api/feature-flags` - Manage application feature flags
- `GET /api/advertisements` - Manage promotional content
- All admin endpoints require `x-admin-session` header

**Public Endpoints:**
- `GET /api/feature-flags/public` - Check enabled features
- `GET /api/advertisements/public` - Fetch active advertisements for display

### AI Integration
- **Provider**: DeepSeek AI API integration
- **Specialization**: Christian-focused system prompts for biblical guidance
- **Performance**: Optimized for speed with 30-second timeouts and reduced token limits
- **Dynamic Token Allocation**: 800 tokens for extensive content, 400 for regular messages
- **Context Optimization**: Limited conversation history (2-6 messages) and 300-character truncation for faster responses
- **Features**: Scripture reference extraction and theological accuracy
- **Fallback**: Scripture service for common verses when API unavailable

### UI Components
- **Landing Page**: Multi-section marketing site with hero, features, testimonials
- **Interactive Demo**: Animated walkthrough modal showcasing app features
- **Chat Interface**: Real-time conversation UI with message bubbles and advanced input options
- **Text Highlighting System**: Advanced highlighting for Bible study preparation with 5 categories (Key Verse, Prayer Point, Study Note, Action Item, Discussion)
- **Scripture Display**: Formatted biblical references with proper citations
- **Message Actions**: Copy, download, and share functionality for all messages

- **File Upload**: Support for text files, PDFs, and images (up to 5MB)
- **Progress Indicators**: Visual feedback with progress bars for large content processing
- **Feature Flag System**: Comprehensive system for managing advertisement display and feature rollouts
- **Advertisement Management**: Complete CRUD system for faith-based promotions with placement controls and edit functionality
- **Daily Memory Verses**: Rotating scripture verses that change daily across all pages
- **Ministry Support Integration**: GiveSendGo donation button prominently featured in navigation and hero section
- **Tasteful Support Reminders**: Optional ministry support messages every 3rd AI response (feature flag controlled) - ACTIVE
- **Prompt Library**: Comprehensive pre-written prompt collection organized by ministry categories with search functionality, favorites, and one-click insertion - designed specifically for older users unfamiliar with AI
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

1. **Session Creation**: Users start conversations by creating new chat sessions
2. **Input Processing**: Support for text input, voice transcription, and file uploads
3. **Content Optimization**: Large content triggers optimized processing with reduced context
4. **Message Flow**: User messages trigger AI API calls with conversation context
5. **Response Processing**: AI responses include both text content and scripture references
6. **Message Actions**: Users can copy, download, or share any message content
7. **State Management**: React Query handles caching and synchronization
8. **Real-time Updates**: Optimistic updates with progress indicators provide immediate feedback

## External Dependencies

### Production Dependencies
- **AI Service**: DeepSeek API for Christian-focused responses
- **Database**: PostgreSQL via Neon Database serverless platform
- **UI Libraries**: Comprehensive Radix UI component collection
- **Development Tools**: Vite plugins for Replit integration

### Development Tools
- **Type Safety**: Full TypeScript coverage across client/server/shared code
- **Code Quality**: ESM modules with strict TypeScript configuration
- **Build Process**: Vite for client bundling, esbuild for server compilation

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Memory Storage**: Fast in-memory data persistence for development
- **Error Handling**: Runtime error overlays for debugging

### Production Build
- **Client Build**: Static asset generation to `/dist/public`
- **Server Build**: Bundled Node.js server with external dependencies
- **Database**: PostgreSQL connection via environment variables
- **Scaling**: Serverless-ready architecture for cloud deployment

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **AI API**: `DEEPSEEK_API_KEY` or `API_KEY` for AI service authentication
- **Build Mode**: `NODE_ENV` for development/production switching

The architecture prioritizes developer experience with fast iteration cycles while maintaining production readiness through proper separation of concerns and scalable design patterns.

## Recent Changes

### January 22, 2025
- **Ministry Support Reminders Activated**: Successfully implemented and enabled tasteful ministry support messages that appear every 3rd AI response
- **Feature Flag System**: Verified working properly with server restart capability for configuration updates  
- **GiveSendGo Integration**: Complete ministry support system with navigation buttons and automated reminders
- **Speech Recognition Removed**: After extensive testing, removed speech-to-text functionality due to browser API limitations and reliability issues across devices
- **Legal Pages Added**: Created comprehensive Help Center, Contact Us, Privacy Policy, and Terms of Service pages with proper navigation links
- **Mobile Advertisement Display**: Fixed mobile layout to show advertisements below daily verse for consistent monetization across all device sizes

### January 23, 2025
- **Text Highlighting System Completed**: Successfully implemented and tested comprehensive highlighting system for AI responses with 5 study categories (Key Verse, Prayer Point, Study Note, Action Item, Discussion), persistent storage, inline toolbar interface, and export functionality for Bible study preparation - CONFIRMED WORKING
- **Enhanced Export Feature**: Upgraded highlighting export to include both original content and formatted content with visual highlight markers, plus comprehensive summaries by category for complete Bible study preparation
- **Prompt Library Implementation**: Added comprehensive prompt library with 8 ministry categories (Leadership, Men's Ministry, Women's Ministry, Missions & Outreach, Church Planting, Health & Wellness, Personal Growth, Youth Ministry) containing 30+ pre-written prompts to help older users discover AI capabilities and reduce intimidation
- **Admin Dashboard Analytics Fixed**: Resolved issue where Overview, Sessions, and Topics stats were not displaying. Fixed timestamp field references in analytics calculations and verified all metrics are now working correctly (totalSessions, totalMessages, activeSessionsToday, dailyStats, sessionDurations, messageVolumeTrends)
- **Prompt Library Scrolling Fixed**: Improved dialog layout with proper height constraints and scrollable areas to ensure all prompts are accessible on all devices

### January 25, 2025
- **Highlight Isolation Bug Fixed**: Resolved critical issue where highlights were contaminating across different chat sessions. Implemented session-specific storage using `sessionId + messageId` keys to ensure complete isolation between conversations
- **Print Functionality Enhanced**: Redesigned print system for better browser compatibility using category labels (e.g., [KEY VERSE], [STUDY NOTE]) with thick colored borders and bold text formatting instead of relying solely on background colors that browsers strip during printing - CONFIRMED WORKING
- **QR Code Generator Added**: Implemented comprehensive QR code generator in admin dashboard for printing on T-shirts and promotional materials with customizable sizes, error correction levels, and print-ready formats
- **Progressive Web App (PWA) Implementation**: Added full PWA support including service worker, app manifest, install prompts, offline capability, and home screen installation for mobile and desktop devices. Users can now install F-AI-TH-Connect as a native-like app with offline access to their spiritual resources

### January 26, 2025
- **Share Icon & QR Code Page**: Added share icon to landing page header (desktop and mobile) leading to comprehensive QR code sharing page at /share with download functionality and ministry-focused messaging
- **Enhanced PWA Installation**: Upgraded QR code page with Progressive Web App installation capabilities including native install prompts, browser-specific instructions, and offline functionality benefits
- **Service Worker Integration**: Successfully integrated service worker for offline caching and native app experience with automatic registration and PWA detection hooks
- **Ministry Sharing Tools**: Complete sharing solution for church bulletins, flyers, and digital ministry outreach with step-by-step installation instructions for all major browsers