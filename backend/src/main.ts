import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  const logger = new Logger('Bootstrap');

  // Validate configuration
  try {
    configService.validateConfiguration();
    logger.log('Configuration validation passed');
  } catch (error) {
    logger.error('Configuration validation failed:', error.message);
    process.exit(1);
  }

  // Set global prefix
  const apiConfig = configService.apiConfig;
  app.setGlobalPrefix(`${apiConfig.prefix}/${apiConfig.version}`);

  // Enable CORS with configuration
  const securityConfig = configService.securityConfig;
  app.enableCors({
    origin: securityConfig.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: configService.isProduction,
    }),
  );

  const port = configService.port;

  // Swagger documentation (configurable via environment)
  const swaggerConfig = configService.swaggerConfig;
  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle('Lyrics Assistant API')
      .setDescription('RESTful API for the Lyrics Assistant application - A Progressive Web App for musicians with automatic lyrics scrolling')
      .setVersion('1.0.0')
      .addTag('app', 'Application information endpoints')
      .addTag('health', 'Health check endpoints - System monitoring and status')
      .addServer(`http://localhost:${port}`, 'Local development server')
      .addServer(`https://api.lyrics-assistant.com`, 'Production server')
      .setContact('Lyrics Assistant Team', 'https://lyrics-assistant.com', 'support@lyrics-assistant.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document, {
      customSiteTitle: 'Lyrics Assistant API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #1976d2 }
      `,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });
    logger.log(`Swagger documentation available at http://localhost:${port}/${swaggerConfig.path}`);
  }
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${configService.nodeEnv}`);
  logger.log(`API Base URL: http://localhost:${port}/${apiConfig.prefix}/${apiConfig.version}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', error);
  process.exit(1);
});