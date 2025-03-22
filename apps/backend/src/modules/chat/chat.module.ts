import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from '../ai/ai.module';
import { SocketModule } from '~/common/sockets/socket.module';

@Module({
  imports: [ConfigModule, SocketModule, AiModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
