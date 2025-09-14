# Lyrics Assistant

A Progressive Web Application for musicians with automatic lyrics scrolling functionality.

## Project Structure

This is a monorepo containing:
- `frontend/` - React PWA with TypeScript
- `backend/` - NestJS API with TypeScript
- `docker-compose.yml` - PostgreSQL database setup

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (or use Docker setup)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start the database:**
   ```bash
   # Using Docker Compose
   docker-compose up -d postgres
   
   # Or using npm script
   npm run docker:db
   ```

3. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start development servers:**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:backend  # Backend on http://localhost:3001
   npm run dev:frontend # Frontend on http://localhost:3000
   ```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run test` - Run tests for both applications
- `npm run docker:db` - Start PostgreSQL database container
- `npm run docker:db:stop` - Stop and remove database container

### Backend Scripts
- `npm run start:dev` - Start backend in development mode
- `npm run build` - Build backend for production
- `npm run test` - Run backend tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio for database management

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run test` - Run frontend tests
- `npm run preview` - Preview production build

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Material-UI for components
- React Router for navigation
- React Query for state management
- PWA capabilities with Workbox

### Backend
- NestJS with TypeScript
- PostgreSQL database
- Drizzle ORM
- Swagger API documentation
- Class-validator for validation

### Development
- Docker for database
- ESLint and Prettier for code formatting
- Jest and Vitest for testing

## API Documentation

When the backend is running, visit http://localhost:3001/api for Swagger documentation.

## Database Management

- **Drizzle Studio**: Run `npm run db:studio` to open the database management interface
- **Migrations**: Database schema changes are managed through Drizzle migrations
- **Seeding**: Use `npm run db:seed` to populate the database with sample data

## PWA Features

The frontend is configured as a Progressive Web App with:
- Offline functionality
- App installation prompts
- Service worker for caching
- Responsive design for mobile devices

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/lyrics_assistant
FRONTEND_URL=http://localhost:3000
PERPLEXITY_API_KEY=your_api_key_here
```

## Contributing

1. Follow the existing code style and formatting
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting changes

## License

This project is private and not licensed for public use.