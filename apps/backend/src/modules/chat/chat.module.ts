import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from '../ai/ai.module';
import { SocketModule } from '~/common/sockets/socket.module';
import { ClientAgentModule } from '../ai/agents/client-agent/client-agent.module';

@Module({
  imports: [ConfigModule, SocketModule, AiModule, ClientAgentModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
