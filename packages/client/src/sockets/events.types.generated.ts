/**
 * This file is auto-generated.
 */
import type { ChatClientSendChat, ChatClientPingDto, ChatServerPongDto } from "../client";


export interface ChatGatewayWebSocketEventsClientServer {
  "send-chat": (payload: ChatClientSendChat) => void;
  "client:ping": (payload: ChatClientPingDto) => void;
}

export interface ChatGatewayWebSocketEventsServerClient {
  "server:pong": (payload: ChatServerPongDto) => void;
}


export type WebSocketEventsClientServer = ChatGatewayWebSocketEventsClientServer;
export type WebSocketEventsServerClient = ChatGatewayWebSocketEventsServerClient;