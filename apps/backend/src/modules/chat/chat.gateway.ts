import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  ChatServerSendChat,
  ChatSocket,
} from './chat.sockets';
import { AgentService } from '../agents/agent.service';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {
  @Inject() private readonly agentService: AgentService;
  @Inject() private readonly aiService: AiService;
  // @Inject() private readonly clientAgentService: ClientAgentService;

  @WebSocketServer() server: Server;

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
    console.log('ping');
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

  @ApiServerEvent({
    event: 'server:send-chat',
    description: 'Server emits a pong message to clients',
    payloadType: ChatServerSendChat,
  })
  emitMessage(client: ChatSocket, payload: ChatServerSendChat): void {
    client.emit('server:send-chat', payload);
  }
}
