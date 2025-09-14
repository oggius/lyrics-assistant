import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

describe('Swagger Documentation', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should generate Swagger document without errors', () => {
    const config = new DocumentBuilder()
      .setTitle('Lyrics Assistant API')
      .setDescription('API for the Lyrics Assistant application')
      .setVersion('1.0.0')
      .build();

    expect(() => {
      const document = SwaggerModule.createDocument(app, config);
      expect(document).toBeDefined();
      expect(document.info).toBeDefined();
      expect(document.info.title).toBe('Lyrics Assistant API');
    }).not.toThrow();
  });

  it('should have proper API tags defined', () => {
    const config = new DocumentBuilder()
      .setTitle('Lyrics Assistant API')
      .setDescription('API for the Lyrics Assistant application')
      .setVersion('1.0.0')
      .addTag('app', 'Application information endpoints')
      .addTag('health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    expect(document.tags).toBeDefined();
    expect(document.tags).toHaveLength(2);
  });
});