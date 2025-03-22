import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthInterceptor implements NestInterceptor {
  @Inject() private readonly socketService: SocketService;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const client = context.switchToWs().getClient<Socket>();

    if (!client.data.user) {
      console.log('no user associated to the socket');
    }

    // await this.socketService.guardSocket(client);

    return next.handle();
  }
}
