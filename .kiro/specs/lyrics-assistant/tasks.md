# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Create monorepo structure with frontend and backend directories
  - Initialize NestJS backend with TypeScript configuration
  - Initialize React frontend with TypeScript and PWA template
  - Set up Docker configuration for local PostgreSQL database
  - Configure package.json scripts for development workflow
  - _Requirements: 6.1, 8.1_

- [x] 2. Configure database layer with Drizzle ORM
  - Install and configure Drizzle ORM with PostgreSQL driver
  - Create Drizzle schema for songs table with proper types
  - Set up database connection configuration with environment variables
  - Create migration scripts and database seeding utilities
  - Configure Drizzle Studio for local database management
  - _Requirements: 1.1, 5.6, 8.1_

- [x] 3. Implement core backend API structure
  - Create NestJS modules for songs and lyrics functionality
  - Set up global exception filters and validation pipes
  - Configure CORS and security middleware
  - Implement health check endpoint for monitoring
  - Set up environment configuration service
  - Configure comprehensive Swagger/OpenAPI documentation
  - _Requirements: 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 4. Build songs repository and service layer
  - Implement SongsRepository with Drizzle query operations
  - Create CRUD operations for songs (create, read, update, delete)
  - Add search functionality for songs by title and author
  - Implement data validation and transformation logic
  - Write unit tests for repository and service layers
  - _Requirements: 1.1, 1.2, 5.6_

- [x] 5. Create songs REST API endpoints
  - Implement GET /songs endpoint to retrieve all songs
  - Implement GET /songs/:id endpoint for individual song retrieval
  - Implement POST /songs endpoint for creating new songs
  - Implement PUT /songs/:id endpoint for updating songs
  - Implement DELETE /songs/:id endpoint for removing songs
  - Add comprehensive Swagger documentation with examples and schemas
  - Add request validation and error handling
  - _Requirements: 1.1, 1.2, 5.6, 9.2, 9.3, 9.4_

- [x] 6. Integrate Perplexity API for lyrics search
  - Create LyricsSearchService with Perplexity API integration
  - Implement prompt construction for filtering lyrics-only content
  - Add error handling for API failures and rate limiting
  - Create POST /lyrics/search endpoint for lyrics retrieval
  - Implement response parsing and content cleaning
  - Add detailed Swagger documentation for lyrics search API
  - Write unit tests with mocked API responses
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 9.2, 9.3, 9.4_

- [x] 7. Set up React frontend project structure
  - Configure React Router for navigation between pages
  - Set up Material-UI or Tailwind CSS for styling
  - Create global state management with React Query
  - Configure TypeScript interfaces for API responses
  - Set up error boundary components for error handling
  - _Requirements: 1.1, 1.2, 6.1_

- [x] 8. Build songs list page and navigation
  - Create SongsList component to display available songs
  - Implement song selection and navigation to song page
  - Add search and filter functionality for songs
  - Handle empty state when no songs are available
  - Implement loading states and error handling
  - Write component tests with React Testing Library
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 9. Implement song page with lyrics display
  - Create SongPage component to display song lyrics
  - Implement responsive layout for lyrics content
  - Add navigation back to songs list
  - Handle loading and error states for song retrieval
  - Implement proper text formatting for lyrics display
  - Write component tests for lyrics rendering
  - _Requirements: 2.1, 2.2_

- [ ] 10. Build auto-scroll functionality and controls
  - Create ScrollService for managing automatic scrolling logic
  - Implement Play button to start scrolling with configurable delay
  - Implement Stop button to stop scrolling and return to top
  - Implement Pause button to pause scrolling without reset
  - Add scroll speed configuration (1-10 range)
  - Write unit tests for scroll service functionality
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 11. Create configuration modal for scroll settings
  - Build ConfigModal component for scroll configuration
  - Implement form inputs for scroll start delay and speed
  - Add input validation for delay (unsigned integer) and speed (1-10)
  - Implement save functionality to apply settings to current song
  - Add default values and reset functionality
  - Write component tests for configuration modal
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 12. Build add song page with search functionality
  - Create AddSong component with song title and author inputs
  - Implement "Find Lyrics" button with Perplexity API integration
  - Add loading states and error handling for API search
  - Display search results for user confirmation before saving
  - Implement form validation for required fields
  - Write integration tests for lyrics search workflow
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 13. Implement manual lyrics entry functionality
  - Create manual entry modal with all required fields
  - Pre-fill song title and author from previous form inputs
  - Add lyrics text area with proper formatting
  - Implement scroll configuration inputs with validation
  - Add save functionality to create song with custom settings
  - Write component tests for manual entry workflow
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 14. Configure PWA functionality
  - Set up service worker with Workbox for caching strategies
  - Configure app manifest for PWA installation
  - Implement offline functionality for previously loaded songs
  - Add installation prompts for supported devices
  - Configure caching for static assets and API responses
  - Test PWA functionality across different browsers
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 15. Set up comprehensive testing suite
  - Configure Jest and React Testing Library for frontend tests
  - Set up backend testing with NestJS testing utilities
  - Write integration tests for API endpoints
  - Create E2E tests with Cypress for critical user flows
  - Add test coverage reporting and quality gates
  - Configure CI/CD pipeline for automated testing
  - _Requirements: All requirements validation_

- [ ] 16. Prepare AWS deployment configuration
  - Create CloudFormation templates for AWS infrastructure
  - Configure Serverless Framework for Lambda deployment
  - Set up S3 bucket and CloudFront distribution for frontend
  - Configure RDS PostgreSQL instance within free tier limits
  - Set up AWS Secrets Manager for API keys and database credentials
  - Create deployment scripts and environment configuration
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2_

- [ ] 17. Implement production optimizations
  - Add code splitting and lazy loading for React components
  - Configure compression and caching headers
  - Optimize database queries and add connection pooling
  - Implement rate limiting and security headers
  - Add monitoring and logging for production environment
  - Write deployment documentation and runbooks
  - _Requirements: 7.5, 8.4, 8.5, 8.6_