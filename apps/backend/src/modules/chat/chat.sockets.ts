import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Socket } from 'socket.io';
import { AIMessage } from '../ai/ai.types';

export type ChatSocket = Socket<
  ChatClientToServerEvents,
  ChatServerToClientEvents,
  ChatServerToClientEvents
>;

export interface ChatClientToServerEvents {
  'client:ping': (payload: ChatClientPingDto) => void;
  'send-chat': (payload: ChatClientSendChat) => void;
}

export interface ChatServerToClientEvents {
  'server:pong': (payload: ChatClientPingDto) => void;
}

export class ChatClientPingDto {
  @ApiProperty({ description: 'client send ping' })
  @IsString()
  message: string;
}

export class ChatServerPongDto {
  @ApiProperty({ description: 'server send pong' })
  @IsString()
  message: string;
}

export class AiMessageDto implements AIMessage {
  @ApiProperty({ description: 'text' })
  @IsString()
  readonly text: string;

  @ApiProperty({ description: 'role' })
  @IsString()
  readonly role: 'user' | 'assistant';
}

export class ChatClientSendChat {
  @ApiProperty({ description: 'blablabla', isArray: true, type: AiMessageDto })
  @IsArray({ each: true })
  @ValidateNested()
  readonly messages: AiMessageDto[];
}
