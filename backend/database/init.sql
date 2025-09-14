-- Initialize the lyrics_assistant database
-- This file is executed when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist (handled by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS lyrics_assistant;

-- Connect to the database
\c lyrics_assistant;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The actual tables will be created by Drizzle migrations
-- This file is just for initial database setup