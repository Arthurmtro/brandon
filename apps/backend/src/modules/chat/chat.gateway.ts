import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import {
  ApiServerEvent,
  ApiSocketEvent,
} from '~/common/sockets/socket.decorator';
import {
  ChatClientPingDto,
  ChatClientSendChat,
  ChatServerPongDto,
  ChatServerSendChat,
  ChatSocket,
} from './chat.sockets';
import { AgentService } from '../agents/agent.service';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @Inject() private readonly agentService: AgentService;

  @WebSocketServer() server: Server;
  private connectedClients: Map<string, Socket> = new Map();

  afterInit() {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Emit welcome event to the connected client
    client.emit('server:welcome', {
      message: 'Connected to chat service',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @ApiSocketEvent({
    event: 'client:send-chat',
    description: 'Send a chat',
    payloadType: ChatClientSendChat,
  })
  @SubscribeMessage('client:send-chat')
  async handleMessage(
    @MessageBody() data: ChatClientSendChat,
    @ConnectedSocket() client: Socket,
  ) {
    const iterableReadableStream = await this.agentService.sendMessageStream(
      client.id,
      data.text,
    );

    for await (const event of iterableReadableStream) {
      if (event?.data && event.data?.chunk?.content) {
        console.log(event.data.chunk.content);
        this.emitMessage(client, {
          text: event.data.chunk.content,
        });
      }
    }
  }

  @ApiSocketEvent({
    event: 'client:ping',
    description: 'Ping for connection testing',
    payloadType: ChatClientPingDto,
  })
  @SubscribeMessage('client:ping')
  async ping(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody() payload: ChatClientPingDto,
  ) {
    this.logger.debug(`Ping received from client ${socket.id}`);
    this.emitPong(socket, {
      ...payload,
    });
  }

  @ApiServerEvent({
    event: 'server:pong',
    description: 'Server emits a pong message to clients',
    payloadType: ChatServerPongDto,
  })
  emitPong(client: ChatSocket, payload: ChatServerPongDto): void {
    this.logger.debug(`Sending pong to client ${client.id}`);
    this.sendToClient(client.id, 'server:pong', payload);
  }

  private sendErrorToClient(client: Socket, message: string): void {
    this.logger.warn(`Sending error to client ${client.id}: ${message}`);
    client.emit('error', {
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Utility method to broadcast to all connected clients
  broadcastToAll(event: string, data: any): void {
    this.logger.debug(`Broadcasting ${event} to all clients`);
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // Utility method to send to specific client
  sendToClient(clientId: string, event: string, data: any): boolean {
    const client = this.connectedClients.get(clientId);
    if (client) {
      this.logger.debug(`Sending ${event} to client ${clientId}`);
      client.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    this.logger.warn(`Failed to send ${event}: client ${clientId} not found`);
    return false;
  }

  @ApiServerEvent({
    event: 'server:send-chat',
    description: 'Server emits a pong message to clients',
    payloadType: ChatServerSendChat,
  })
  emitMessage(client: ChatSocket, payload: ChatServerSendChat): void {
    client.emit('server:send-chat', payload);
  }
}
