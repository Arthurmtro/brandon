import { ManagerOptions, SocketOptions } from "socket.io-client";

export interface ApiConfig {
  readonly sentryDNS?: string;

  readonly api: {
    readonly baseUrl: string;
    readonly autoTokenRefresh?: boolean;
  };
}

export interface SocketConfig {
  readonly socket: {
    readonly baseUrl: string;
    readonly options?: Partial<ManagerOptions & SocketOptions>;
  };
}
