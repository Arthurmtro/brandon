import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HumanMessage } from '@langchain/core/messages';
import { Inject } from '@nestjs/common';
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

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @Inject() private readonly aiService: AiService;
  // @Inject() private readonly clientAgentService: ClientAgentService;

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('connected with id :', client.id);
  }

  @ApiSocketEvent({
    event: 'send-chat',
    description: 'Send a chat',
    payloadType: ChatClientSendChat,
  })
  @SubscribeMessage('send-chat')
  async handleMessage(
    @MessageBody() data: ChatClientSendChat,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('data', data);
      const { messages } = data;

      // const clientTool = new ClientTool(this.clientAgentService);

      console.log(messages);

      if (!Array.isArray(messages)) {
        client.emit('test', {
          text: '⛔ Format invalide : "messages" doit être un tableau',
        });
        return;
      }

      const input = await this.aiService.generatePromptInput(messages);

      console.log('🧪 Prompt généré :', input);

      const responseStream = await this.aiService.model.stream([
        new HumanMessage(input),
      ]);

      for await (const chunk of responseStream) {
        client.emit('response', { text: chunk.content });
      }
    } catch (err) {
      console.error('🔥 ERREUR WEBSOCKET :', err);
      client.emit('response', { text: '❌ Une erreur est survenue.' });
    }
  }

  @SubscribeMessage('client:ping')
  @ApiSocketEvent({
    event: 'client:ping',
    description: 'Ping for test',
    payloadType: ChatClientPingDto,
  })
  async ping(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody() payload: ChatClientPingDto,
  ) {
    // console.log('ping');
    this.emitPont(socket, payload);
  }

  @ApiServerEvent({
    event: 'server:pong',
    description: 'Server emits a pong message to clients',
    payloadType: ChatServerPongDto,
  })
  emitPont(client: ChatSocket, payload: ChatServerPongDto): void {
    client.emit('server:pong', payload);
  }
}
