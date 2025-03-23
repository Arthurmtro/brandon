import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('Swagger');

export async function setupSwagger(
  app: INestApplication,
): Promise<INestApplication> {
  const config = app.get<ConfigService>(ConfigService);
  const host = config.getOrThrow<string>('HOST');
  const port = config.getOrThrow<number>('PORT');

  const writeApiDocs = true;

  const documentBuilder = new DocumentBuilder()
    .setTitle('Brandon API')
    .setDescription('API docs for Brandon')
    .setVersion('1.0')
    .addServer('http://localhost:3040', 'Local')
    .build();

  const extraModels = await collectExtraModels(app);

  let document = SwaggerModule.createDocument(app, documentBuilder, {
    extraModels,
  });

  document = await addWebsocketRoutes(app, document);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  if (writeApiDocs) {
    const sourcePath =
      process
        .cwd()
        .split('apps')?.[0]
        ?.replace(/[\\/]$/, '') ?? '';
    logger.log(
      `Writing API docs to ${sourcePath}/packages/client/src/openapi.json`,
    );
    writeFileSync(
      `${sourcePath}/packages/client/src/openapi.json`,
      JSON.stringify(document, null, 2),
    );
  }

  logger.log(`Check swagger api documentation here: ${host}:${port}/api-docs/`);

  return app;
}
async function collectExtraModels(app: INestApplication): Promise<any[]> {
  try {
    app.select(DiscoveryModule);
  } catch (_err: any) {
    throw new Error('DiscoveryModule must be imported in your AppModule.');
  }
  const discoveryService = app.get(DiscoveryService);
  const wrappers = discoveryService.getProviders();
  const extraModelsSet = new Set<any>();

  wrappers.forEach((wrapper) => {
    if (!wrapper.metatype) return;
    const instance = wrapper.instance;
    if (!instance) return;
    const prototype = Object.getPrototypeOf(instance);
    if (!prototype) return;

    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) =>
        name !== 'constructor' && name !== 'listen' && name !== 'listen$',
    );

    methodNames.forEach((methodName) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
      if (!descriptor || typeof descriptor.value !== 'function') return;
      const methodRef = descriptor.value;
      const metadata = Reflect.getMetadata('socket_event', methodRef);
      if (metadata) {
        if (metadata.payloadType) extraModelsSet.add(metadata.payloadType);
      }
    });
  });

  return Array.from(extraModelsSet);
}

async function addWebsocketRoutes(
  app: INestApplication,
  document: OpenAPIObject,
): Promise<OpenAPIObject> {
  try {
    app.select(DiscoveryModule);
  } catch (_err) {
    throw new Error('DiscoveryModule must be imported in your AppModule.');
  }
  const discoveryService = app.get(DiscoveryService);

  const wrappers = discoveryService.getProviders();

  wrappers.forEach((wrapper) => {
    if (!wrapper.metatype) return;
    const instance = wrapper.instance;
    if (!instance) return;
    const prototype = Object.getPrototypeOf(instance);
    if (!prototype) return;

    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) =>
        name !== 'constructor' && name !== 'listen' && name !== 'listen$',
    );

    methodNames.forEach((methodName) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
      if (!descriptor || typeof descriptor.value !== 'function') return;
      const methodRef = descriptor.value;
      const metadata = Reflect.getMetadata('socket_event', methodRef);
      if (metadata) {
        const gatewayName =
          wrapper?.metatype?.name || instance.constructor.name;
        const path = `/${gatewayName}/${metadata.event}`;
        let fakeEndpoint: any = {};

        if (metadata.direction === 'client-to-server') {
          fakeEndpoint = {
            post: {
              tags: ['WebSocket Events (Client → Server)'],
              summary: metadata.description,
              operationId: metadata.event,
              // @ts-ignored
              'x-event': metadata.event,
              'x-namespace': gatewayName,
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: `#/components/schemas/${metadata.payloadType.name}`,
                    },
                  },
                },
              },
              responses: {},
            },
          } satisfies OpenAPIObject['paths'][string];
        } else if (metadata.direction === 'server-to-client') {
          // For server-to-client events, generate a GET endpoint with a response.
          fakeEndpoint = {
            get: {
              tags: ['WebSocket Events (Server → Client)'],
              summary: metadata.description,
              operationId: metadata.event,
              // @ts-ignored
              'x-event': metadata.event,
              'x-namespace': gatewayName,
              responses: {
                '200': {
                  description: `Event payload for ${metadata.event}`,
                  content: {
                    'application/json': {
                      schema: {
                        $ref: `#/components/schemas/${metadata.payloadType.name}`,
                      },
                    },
                  },
                },
              },
            },
          } satisfies OpenAPIObject['paths'][string];
        }

        document.paths = document.paths || {};
        document.paths[path] = fakeEndpoint;
      }
    });
  });

  return document;
}
