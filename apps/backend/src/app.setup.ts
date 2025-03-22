import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { json } from 'express';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService, ConfigType } from '@nestjs/config';

/**
 * Sets up the application with the required configs.
 * @param app
 * @returns the app for chaining
 */
export function setupApp(app: INestApplication): INestApplication {
  const config = app.get<ConfigService>(ConfigService);

  // Add the validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { exposeDefaultValues: true },
    }),
  );

  app.use(
    json({ limit: '50mb', verify: (req: any, _, buf) => (req.rawBody = buf) }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  // app.useGlobalInterceptors(new LoggerInterceptor());

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`, 'unpkg.com'],
          styleSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'cdn.jsdelivr.net',
            'fonts.googleapis.com',
            'unpkg.com',
          ],
          fontSrc: [`'self'`, 'fonts.scalar.com', 'data:'],
          imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
          scriptSrc: [
            `'self'`,
            `https: 'unsafe-inline'`,
            `cdn.jsdelivr.net`,
            `'unsafe-eval'`,
          ],
        },
      },
    }),
  );

  app.enableCors({ origin: '*' });

  return app;
}
