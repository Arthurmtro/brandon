import { ApiOperation } from '@nestjs/swagger';
import { ClientToServerEvents, ServerToClientEvents } from './socket.types';

export function ApiSocketEvent(options: {
  event: keyof ClientToServerEvents;
  description: string;
  payloadType: any;
}) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: options.description })(target, key, descriptor);

    // Store metadata with direction marked as client-to-server.
    Reflect.defineMetadata(
      'socket_event',
      {
        direction: 'client-to-server',
        event: options.event,
        description: options.description,
        payloadType: options.payloadType,
      },
      descriptor.value,
    );
    return descriptor;
  };
}

export function ApiServerEvent(options: {
  event: keyof ServerToClientEvents;
  description: string;
  payloadType: any;
}) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: options.description })(target, key, descriptor);
    // Store metadata with direction marked as server-to-client.
    Reflect.defineMetadata(
      'socket_event',
      {
        direction: 'server-to-client',
        event: options.event,
        description: options.description,
        payloadType: options.payloadType,
      },
      descriptor.value,
    );
    return descriptor;
  };
}
