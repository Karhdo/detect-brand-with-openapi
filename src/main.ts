import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port') ?? 3000;

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Detects Brand With OpenAPI API')
    .setDescription('List of all endpoints for Detects Brand With OpenAPI')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document); // Setup Swagger UI at /docs

  await app.listen(port);

  logger.log(`Application is running on port ${port}`);
}

void bootstrap();
