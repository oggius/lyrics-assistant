# Database Layer Documentation

This directory contains the database configuration and utilities for the Lyrics Assistant backend using Drizzle ORM with PostgreSQL.

## Files Overview

- `schema.ts` - Database schema definitions and validation utilities
- `connection.ts` - Database connection configuration
- `database.module.ts` - NestJS module for dependency injection
- `migrate.ts` - Migration runner utility
- `seed.ts` - Database seeding utility
- `test-connection.ts` - Connection testing utility
- `migrations/` - Generated SQL migration files

## Available Scripts

```bash
# Generate new migration after schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Test database connection
npm run db:test

# Open Drizzle Studio for database management
npm run db:studio
```

## Environment Variables

Make sure to set the following environment variable:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/lyrics_assistant
```

## Schema

The `songs` table includes:
- `id` (UUID, primary key)
- `title` (varchar, required)
- `author` (varchar, optional)
- `lyrics` (text, required)
- `scrollStartDelay` (integer, default: 0)
- `scrollSpeed` (integer, default: 5, range: 1-10)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Validation

Use the provided validation utilities:
- `validateScrollSpeed(speed)` - Ensures speed is 1-10
- `validateScrollStartDelay(delay)` - Ensures delay is >= 0

## Usage in NestJS

Import the `DatabaseModule` in your app module and inject the database connection:

```typescript
import { DATABASE_CONNECTION } from './database';

@Injectable()
export class SomeService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: Database
  ) {}
}
```