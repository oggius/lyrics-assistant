# Project Structure

## Root Level
```
lyrics-assistant/
├── frontend/           # React PWA application
├── backend/            # NestJS API server
├── docker-compose.yml  # PostgreSQL database setup
├── package.json        # Workspace configuration
└── .kiro/              # Kiro IDE configuration
```

## Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── app.module.ts           # Root application module
│   ├── main.ts                 # Application bootstrap
│   ├── common/                 # Shared utilities
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Response interceptors
│   │   └── middleware/         # Security & rate limiting
│   ├── config/                 # Configuration management
│   ├── database/               # Database setup & migrations
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   ├── migrations/         # Database migration files
│   │   └── seed.ts             # Sample data seeding
│   ├── health/                 # Health check endpoints
│   ├── songs/                  # Song management module
│   │   ├── dto/                # Data transfer objects
│   │   ├── songs.controller.ts # REST endpoints
│   │   ├── songs.service.ts    # Business logic
│   │   └── songs.repository.ts # Database operations
│   └── lyrics/                 # Lyrics processing module
├── docs/                       # API documentation
├── .env.example               # Environment template
└── drizzle.config.ts          # Database configuration
```

## Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── main.tsx               # Application entry point
│   ├── App.tsx                # Root component
│   ├── components/            # Reusable UI components
│   │   ├── Layout.tsx         # Application layout
│   │   ├── ScrollControls.tsx # Auto-scroll controls
│   │   └── ErrorBoundary.tsx  # Error handling
│   ├── pages/                 # Route components
│   │   ├── SongsListPage.tsx  # Song listing
│   │   ├── SongPage.tsx       # Song display & scrolling
│   │   └── AddSongPage.tsx    # Song creation
│   ├── hooks/                 # Custom React hooks
│   │   ├── useApi.ts          # API integration
│   │   └── useScrollService.ts # Scroll functionality
│   ├── services/              # Business logic
│   │   └── ScrollService.ts   # Auto-scroll implementation
│   ├── types/                 # TypeScript definitions
│   └── test/                  # Test utilities
├── public/                    # Static assets
└── vite.config.ts            # Build configuration
```

## Key Patterns

### Backend Modules
- Each feature has its own module (songs, lyrics, health)
- Modules contain: controller, service, repository, DTOs
- Common utilities in `src/common/`
- Configuration centralized in `src/config/`

### Frontend Organization
- Pages for route-level components
- Components for reusable UI elements
- Hooks for stateful logic
- Services for business logic
- Types for shared interfaces

### Database
- Schema defined in `backend/src/database/schema.ts`
- Migrations in `backend/src/database/migrations/`
- Drizzle ORM with PostgreSQL

### Testing
- Backend: `*.spec.ts` files alongside source
- Frontend: `*.test.tsx` files alongside components
- Integration tests in dedicated files

### Configuration
- Environment variables in `.env` files
- TypeScript path aliases: `@/*` maps to `src/*`
- Workspace-level scripts in root `package.json`