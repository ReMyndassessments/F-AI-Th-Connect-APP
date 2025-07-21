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
The application uses three main entities:
- **Users**: Basic user authentication (id, username, password)
- **Chat Sessions**: Conversation containers with unique session IDs
- **Messages**: Individual messages with role (user/assistant), content, and optional scripture references

### API Endpoints
- `POST /api/chat/sessions` - Create new chat sessions
- `GET /api/chat/sessions/:sessionId/messages` - Retrieve conversation history  
- `POST /api/chat/sessions/:sessionId/messages` - Send messages and receive AI responses

### AI Integration
- **Provider**: DeepSeek AI API integration
- **Specialization**: Christian-focused system prompts for biblical guidance
- **Performance**: Optimized for large content (sermons, studies) with 60-second timeouts
- **Dynamic Token Allocation**: 1200 tokens for extensive content, 600 for regular messages
- **Context Optimization**: Reduced conversation history for large message processing
- **Features**: Scripture reference extraction and theological accuracy
- **Fallback**: Scripture service for common verses when API unavailable

### UI Components
- **Landing Page**: Multi-section marketing site with hero, features, testimonials
- **Interactive Demo**: Animated walkthrough modal showcasing app features
- **Chat Interface**: Real-time conversation UI with message bubbles and advanced input options
- **Scripture Display**: Formatted biblical references with proper citations
- **Message Actions**: Copy, download, and share functionality for all messages
- **Speech Input**: Voice-to-text capability using browser's Speech Recognition API
- **File Upload**: Support for text files, PDFs, and images (up to 5MB)
- **Progress Indicators**: Visual feedback with progress bars for large content processing
- **Feature Flag System**: Comprehensive system for managing advertisement display and feature rollouts
- **Advertisement Management**: Tasteful faith-based promotion system with placement controls
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