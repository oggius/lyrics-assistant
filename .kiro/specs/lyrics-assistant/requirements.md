# Requirements Document

## Introduction

The Lyrics Assistant is a Progressive Web Application (PWA) designed for musicians who need hands-free lyrics display during performances. The application provides automatic scrolling functionality to eliminate the need for manual page navigation while performing. Built with React frontend and NestJS backend, it will be deployed on AWS within the free tier constraints and follow Twelve Factor App principles.

## Requirements

### Requirement 1

**User Story:** As a musician, I want to select songs from a list of available songs, so that I can quickly access the lyrics I need for my performance.

#### Acceptance Criteria

1. WHEN the user opens the application THEN the system SHALL display a list of all available songs
2. WHEN the user clicks on a song from the list THEN the system SHALL navigate to the song page for that specific song
3. WHEN the songs list is displayed THEN the system SHALL show song titles and authors (if available)
4. IF no songs are available THEN the system SHALL display an appropriate message indicating the library is empty

### Requirement 2

**User Story:** As a musician, I want to view song lyrics with automatic scrolling controls, so that I can perform without manually scrolling through the text.

#### Acceptance Criteria

1. WHEN a song is selected THEN the system SHALL display the complete lyrics of the song
2. WHEN the song page loads THEN the system SHALL display Play, Stop, Pause, and Config buttons
3. WHEN the Play button is pressed THEN the system SHALL initiate automatic scrolling after the configured delay
4. WHEN the Stop button is pressed THEN the system SHALL stop scrolling AND scroll the page to the top
5. WHEN the Pause button is pressed THEN the system SHALL pause scrolling WITHOUT scrolling to the top
6. WHEN the Config button is pressed THEN the system SHALL open configuration options for scroll settings
7. WHEN scrolling is active THEN the system SHALL scroll at the configured speed (1-10 range)

### Requirement 3

**User Story:** As a musician, I want to configure scrolling behavior, so that I can customize the timing and speed to match my performance needs.

#### Acceptance Criteria

1. WHEN the Config button is pressed THEN the system SHALL display scroll start delay and scroll speed settings
2. WHEN configuring scroll start delay THEN the system SHALL accept values in seconds as unsigned integers
3. WHEN configuring scroll speed THEN the system SHALL accept values within range 1 to 10
4. WHEN configuration changes are saved THEN the system SHALL apply these settings to the current song
5. WHEN no custom configuration exists THEN the system SHALL use default values (0 seconds delay, speed 5)

### Requirement 4

**User Story:** As a musician, I want to add new songs to my library by searching for lyrics online, so that I can quickly expand my song collection without manual typing.

#### Acceptance Criteria

1. WHEN the user accesses the add song feature THEN the system SHALL display Song Title (required) and Song Author (optional) input fields
2. WHEN the user fills in song information and clicks "Find Lyrics" THEN the system SHALL search for lyrics using the Perplexity API
3. WHEN searching via API THEN the system SHALL construct prompts to filter out unnecessary information and return only lyrics
4. WHEN lyrics are found THEN the system SHALL display the lyrics for user confirmation before saving
5. IF lyrics are not found THEN the system SHALL display an appropriate error message
6. WHEN API search is successful THEN the system SHALL save the song with default scroll settings

### Requirement 5

**User Story:** As a musician, I want to manually add song lyrics, so that I can include songs that may not be available through online search.

#### Acceptance Criteria

1. WHEN the user clicks "Add Lyrics Manually" THEN the system SHALL open a popup with song entry fields
2. WHEN the manual entry popup opens THEN the system SHALL prefill Song Title and Song Author if previously entered
3. WHEN entering lyrics manually THEN the system SHALL provide fields for Song Title (required), Song Author (optional), Scroll Start Delay (default 0), and Scroll Speed (default 5)
4. WHEN Scroll Start Delay is entered THEN the system SHALL accept only unsigned integers representing seconds
5. WHEN Scroll Speed is entered THEN the system SHALL accept only integers within range 1 to 10
6. WHEN the Save button is pressed AND all required fields are valid THEN the system SHALL save the song to the library
7. IF required fields are missing or invalid THEN the system SHALL display validation errors

### Requirement 6

**User Story:** As a user, I want to access the application as a Progressive Web App, so that I can use it offline and install it on my device like a native app.

#### Acceptance Criteria

1. WHEN the application is accessed THEN the system SHALL function as a PWA with offline capabilities
2. WHEN the user visits the app THEN the system SHALL provide installation prompts for supported devices
3. WHEN offline THEN the system SHALL allow access to previously loaded songs and basic functionality
4. WHEN online connectivity is restored THEN the system SHALL sync any pending changes

### Requirement 7

**User Story:** As a system administrator, I want the application deployed on AWS within free tier limits, so that hosting costs remain minimal while maintaining reliability.

#### Acceptance Criteria

1. WHEN the application is deployed THEN the system SHALL use AWS services within free tier constraints
2. WHEN deployed THEN the frontend SHALL be hosted on AWS S3 with CloudFront distribution
3. WHEN deployed THEN the backend SHALL run on AWS Lambda or EC2 t2.micro instances
4. WHEN deployed THEN the database SHALL use AWS RDS free tier or DynamoDB
5. WHEN monitoring usage THEN the system SHALL stay within AWS free tier limits

### Requirement 8

**User Story:** As a developer, I want the application to follow Twelve Factor App principles, so that it maintains good architectural practices and deployment flexibility.

#### Acceptance Criteria

1. WHEN the application is built THEN the system SHALL store configuration in environment variables
2. WHEN deployed THEN the system SHALL treat backing services as attached resources
3. WHEN running THEN the system SHALL maintain stateless processes
4. WHEN logging THEN the system SHALL treat logs as event streams
5. WHEN scaling THEN the system SHALL support horizontal scaling through process model
6. WHEN developed THEN the system SHALL maintain strict separation between build, release, and run stages

### Requirement 9

**User Story:** As a developer and API consumer, I want comprehensive API documentation with interactive testing capabilities, so that I can understand, test, and integrate with the API effectively.

#### Acceptance Criteria

1. WHEN accessing the API documentation THEN the system SHALL provide Swagger/OpenAPI documentation at /api/docs
2. WHEN viewing the API documentation THEN the system SHALL display detailed endpoint descriptions, request/response schemas, and example data
3. WHEN using the API documentation THEN the system SHALL provide interactive testing capabilities for all endpoints
4. WHEN documenting endpoints THEN the system SHALL include proper HTTP status codes, error responses, and validation rules
5. WHEN in development or staging environment THEN the system SHALL make API documentation publicly accessible
6. WHEN documenting the API THEN the system SHALL include authentication requirements and rate limiting information