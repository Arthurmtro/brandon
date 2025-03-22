import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupApp } from './app.setup';
import { setupSwagger } from './app.swagger';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const port = config.getOrThrow<number>('PORT');
  const host = config.getOrThrow<string>('HOST');

  // Configure app
  setupApp(app);

  // Configure Swagger
  setupSwagger(app);

  await app.listen(port);

  logger.log(`🚀 Brandon server has started on ${host}:${port}`);
}

bootstrap();
