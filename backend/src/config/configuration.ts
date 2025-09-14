export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Frontend configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'lyrics_assistant',
    url: process.env.DATABASE_URL,
  },

  // API configuration
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
  },

  // External services
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseUrl: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
  },

  // Security configuration
  security: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // API Documentation configuration
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
});