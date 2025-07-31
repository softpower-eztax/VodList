# MyVideo - Video Streaming List App

## Overview

MyVideo is a web-based video streaming list application that provides a dashboard for discovering and viewing popular videos across different categories. The application focuses on spiritual content including music, sermons, and other educational videos, with support for internationalization in English, Spanish, and Korean.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Internationalization**: Custom i18n implementation supporting English, Spanish, and Korean

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with structured error handling
- **Development**: Hot module replacement with Vite integration

### Component Structure
- **Atomic Design**: Reusable UI components in `/components/ui/`
- **Feature Components**: Domain-specific components for video display, navigation, and stats
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Videos**: Core video metadata including YouTube integration
- **Categories**: Organized content classification (music, sermon, other)
- **Video Stats**: View tracking and analytics data
- **Groups**: Configurable categories and types for content organization
- **Favor Videos**: User-curated favorite video collection
- **Relations**: Proper foreign key relationships between entities

### API Endpoints
- `GET /api/videos` - Retrieve all videos with stats
- `GET /api/videos/category/:category` - Filter videos by category
- `GET /api/videos/top/:category` - Get top videos by category
- `GET /api/videos/top` - Get overall top videos
- `GET /api/stats/dashboard` - Dashboard analytics
- `GET /api/groups` - Retrieve all groups
- `GET /api/groups/type/:type` - Get groups by type (Category/Type)
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `GET /api/favor-videos` - Retrieve all favorite videos
- `POST /api/favor-videos` - Create new favorite video
- `PUT /api/favor-videos/:id` - Update favorite video
- `DELETE /api/favor-videos/:id` - Delete favorite video

### Core Features
- **Dashboard**: Top 10 videos display with category filtering
- **Multi-language Support**: Runtime language switching
- **YouTube Integration**: Embedded video playback via YouTube IDs
- **Responsive UI**: Mobile and desktop optimized interfaces
- **Search Functionality**: Real-time video search across titles and keywords
- **Sorting Options**: Multiple sorting criteria (popular, recent, most viewed)
- **Admin Panel**: Complete CRUD operations for groups and favorite videos
- **Favorite Videos**: Curated video collection with categorization
- **Group Management**: Dynamic category and type management system

## Data Flow

1. **Client Request**: React components make API calls through TanStack Query
2. **Server Processing**: Express routes handle requests and interact with database via Drizzle ORM
3. **Database Operations**: PostgreSQL queries executed through connection pool
4. **Response Formatting**: Structured JSON responses with error handling
5. **Client Updates**: React Query manages caching and UI updates

### State Management
- **Server State**: TanStack Query handles API data, caching, and synchronization
- **Client State**: React hooks for local component state
- **Global State**: Context providers for theme and language preferences

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Video Provider**: YouTube API for video metadata and playback
- **UI Components**: Radix UI primitives for accessible components
- **Development**: Replit-specific development tools and error handling

### Build Tools
- **Bundling**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript compiler
- **Database Migrations**: Drizzle Kit for schema management
- **CSS Processing**: PostCSS with Tailwind CSS

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Direct connection to Neon PostgreSQL
- **Integration**: Single command development with concurrent processes

### Production Build
1. **Frontend**: Vite builds optimized static assets to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Schema pushed via Drizzle migrations
4. **Serving**: Express serves both API and static frontend assets

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection for development/production modes
- **REPL_ID**: Replit-specific development features activation

### Scalability Considerations
- **Database**: Connection pooling for efficient resource usage
- **Caching**: TanStack Query provides client-side caching
- **CDN Ready**: Static assets can be served from CDN
- **Mobile Optimized**: Responsive design reduces mobile data usage