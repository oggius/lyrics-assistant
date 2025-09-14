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

  // Swagger documentation (only in development)
  if (configService.isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Lyrics Assistant API')
      .setDescription('API for the Lyrics Assistant application')
      .setVersion('1.0')
      .addTag('songs', 'Song management endpoints')
      .addTag('lyrics', 'Lyrics search endpoints')
      .addTag('health', 'Health check endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger documentation available at /api/docs');
  }

  const port = configService.port;
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