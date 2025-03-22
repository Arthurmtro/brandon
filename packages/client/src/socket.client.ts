import {
  ChatGatewayWebSocketEventsClientServer,
  ChatGatewayWebSocketEventsServerClient,
} from "./sockets/events.types.generated";
import { SocketClientGenerator } from "./sockets/socket-client.generator";

class SocketApiClient {
  readonly sockets = {
    chat: new SocketClientGenerator<
      ChatGatewayWebSocketEventsServerClient,
      ChatGatewayWebSocketEventsClientServer
    >(),
  };

  get chat() {
    return this.sockets.chat;
  }
}

export const socketApi = new SocketApiClient();
