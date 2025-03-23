/**
 * This file is auto-generated.
 */
import type { ChatClientSendChat, ChatClientPingDto, ChatServerSendChat, ChatServerPongDto } from "../client";


export interface ChatGatewayWebSocketEventsClientServer {
  "client:send-chat": (payload: ChatClientSendChat) => void;
  "client:ping": (payload: ChatClientPingDto) => void;
}

export interface ChatGatewayWebSocketEventsServerClient {
  "server:send-chat": (payload: ChatServerSendChat) => void;
  "server:pong": (payload: ChatServerPongDto) => void;
}


export type WebSocketEventsClientServer = ChatGatewayWebSocketEventsClientServer;
export type WebSocketEventsServerClient = ChatGatewayWebSocketEventsServerClient;