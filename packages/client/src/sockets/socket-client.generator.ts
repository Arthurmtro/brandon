import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { SocketConfig } from '../config.types';

const baseConfig: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  autoConnect: true,
};

export class SocketClientGenerator<T extends object, D extends object> {
  public socket: Socket<T, D>;

  constructor() {
    this.socket = io(baseConfig);
  }

  public init(config?: SocketConfig): void {
    this.socket.offAny();
    this.socket.disconnect();

    this.socket = io(config?.socket.baseUrl, {
      ...baseConfig,
      ...config?.socket.options,
    });
  }

  public clear(): void {
    this.socket.offAny();
    this.socket.disconnect();
  }
}
