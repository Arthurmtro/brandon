import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Socket } from 'socket.io';

export type ChatSocket = Socket<
  ChatClientToServerEvents,
  ChatServerToClientEvents,
  ChatServerToClientEvents
>;

export interface ChatClientToServerEvents {
  'client:ping': (payload: ChatClientPingDto) => void;
  'client:send-chat': (payload: ChatClientSendChat) => void;
}

export interface ChatServerToClientEvents {
  'server:pong': (payload: ChatClientPingDto) => void;
  'server:send-chat': (payload: ChatServerSendChat) => void;
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

export class ChatClientSendChat {
  @ApiProperty({ description: 'text' })
  @IsString()
  readonly text: string;
}

export class ChatServerSendChat {
  @ApiProperty({ description: 'text' })
  @IsString()
  readonly text: string;
}
