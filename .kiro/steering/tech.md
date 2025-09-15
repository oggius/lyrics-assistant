# Technology Stack

## Architecture
- **Monorepo Structure**: Frontend and backend in separate workspaces
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful with Swagger documentation
- **Deployment**: Docker containerization support

## Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: TanStack React Query
- **PWA**: Vite PWA plugin with Workbox
- **Testing**: Vitest + React Testing Library

## Backend Stack
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL 14
- **ORM**: Drizzle ORM with migrations
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## Development Tools
- **Package Manager**: npm with workspaces
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier (single quotes, trailing commas)
- **Database**: Docker Compose for local PostgreSQL
- **Process Management**: Concurrently for dev servers

## Common Commands

### Development
```bash
# Start both frontend and backend
npm run dev

# Start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001

# Database setup
npm run docker:db     # Start PostgreSQL container
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Drizzle Studio
```

### Testing
```bash
npm run test          # Run all tests
npm run test:frontend # Frontend tests only
npm run test:backend  # Backend tests only
```

### Building
```bash
npm run build         # Build both applications
npm run build:frontend
npm run build:backend
```

## Configuration
- **Environment**: `.env` files in backend/ and frontend/
- **TypeScript**: Strict mode disabled, path aliases configured
- **API Documentation**: Available at `/api` when backend running
- **CORS**: Configured for local development