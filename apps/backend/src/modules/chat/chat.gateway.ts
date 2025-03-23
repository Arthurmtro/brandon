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
import { HumanMessage } from '@langchain/core/messages';
import { Inject, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import {
  ApiServerEvent,
  ApiSocketEvent,
} from '~/common/sockets/socket.decorator';
import {
  ChatClientPingDto,
  ChatClientSendChat,
  ChatServerPongDto,
  ChatSocket,
} from './chat.sockets';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @Inject() private readonly aiService: AiService;
  private readonly logger = new Logger(ChatGateway.name);
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
    event: 'send-chat',
    description: 'Send a chat message and receive AI response',
    payloadType: ChatClientSendChat,
  })
  @SubscribeMessage('send-chat')
  async handleMessage(
    @MessageBody() data: ChatClientSendChat,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.debug(`Received chat message from client ${client.id}`);
      const { messages } = data;

      if (!Array.isArray(messages)) {
        this.sendErrorToClient(
          client,
          'Format invalide : "messages" doit être un tableau',
        );
        return;
      }

      // Generate prompt from messages
      const input = await this.aiService.generatePromptInput(messages);
      this.logger.debug(`Generated prompt: ${input.substring(0, 100)}...`);

      // Stream AI response back to the client
      const responseStream = await this.aiService.model.stream([
        new HumanMessage(input),
      ]);

      let accumulatedResponse = '';
      for await (const chunk of responseStream) {
        accumulatedResponse += chunk.content;
        client.emit('response', {
          text: chunk.content,
          isComplete: false,
          timestamp: new Date().toISOString(),
        });
      }

      // Send completion message
      client.emit('response', {
        text: '',
        isComplete: true,
        fullResponse: accumulatedResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      this.logger.error(`Error handling chat message: ${err.message}`);
      this.sendErrorToClient(
        client,
        'Une erreur est survenue lors du traitement de votre message.',
      );
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
}
