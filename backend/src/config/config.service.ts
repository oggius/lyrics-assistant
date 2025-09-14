import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Frontend configuration
  get frontendUrl(): string {
    return this.configService.get<string>('frontend.url');
  }

  // Database configuration
  get databaseConfig() {
    return {
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      url: this.configService.get<string>('database.url'),
    };
  }

  // API configuration
  get apiConfig() {
    return {
      prefix: this.configService.get<string>('api.prefix'),
      version: this.configService.get<string>('api.version'),
    };
  }

  // Perplexity API configuration
  get perplexityConfig() {
    return {
      apiKey: this.configService.get<string>('perplexity.apiKey'),
      baseUrl: this.configService.get<string>('perplexity.baseUrl'),
    };
  }

  // Security configuration
  get securityConfig() {
    return {
      corsOrigins: this.configService.get<string[]>('security.corsOrigins'),
      rateLimitWindowMs: this.configService.get<number>('security.rateLimitWindowMs'),
      rateLimitMaxRequests: this.configService.get<number>('security.rateLimitMaxRequests'),
    };
  }

  // Logging configuration
  get loggingConfig() {
    return {
      level: this.configService.get<string>('logging.level'),
    };
  }

  // Validation method to ensure required configuration is present
  validateConfiguration(): void {
    const requiredConfigs = [
      'port',
      'nodeEnv',
      'frontend.url',
      'database.host',
      'database.port',
      'database.username',
      'database.password',
      'database.name',
    ];

    const missingConfigs = requiredConfigs.filter(
      (config) => !this.configService.get(config),
    );

    if (missingConfigs.length > 0) {
      throw new Error(
        `Missing required configuration: ${missingConfigs.join(', ')}`,
      );
    }
  }
}