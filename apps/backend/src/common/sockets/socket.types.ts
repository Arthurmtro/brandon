import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '~/modules/chat/chat.sockets';

export type ClientToServerEvents = ChatClientToServerEvents;

export type ServerToClientEvents = ChatServerToClientEvents;

export interface SocketAuthData {
  // readonly user: User;
}
