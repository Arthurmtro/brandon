import { Controller, Get, Inject, Query, Sse } from '@nestjs/common';
import { AgentService } from './agent.service';
import { from, map, Observable } from 'rxjs';

@Controller('agents')
export class AgentController {
  @Inject() private readonly agentService: AgentService;

  @Get()
  async test(
    @Query('input') input: string,
    @Query('clientId') clientId: string,
  ): Promise<Observable<MessageEvent<any>>> {
    const iterableReadableStream = await this.agentService.sendMessage(
      clientId,
      input,
    );

    return iterableReadableStream;
  }

  @Sse('stream')
  async testStream(
    @Query('input') input: string,
    @Query('clientId') clientId: string,
  ) {
    const iterableReadableStream = await this.agentService.sendMessageStream(
      clientId,
      input,
    );

    let finalEvent;
    for await (const event of iterableReadableStream) {
      if (event?.data && 'chunk' in event.data) {
        console.log(event.data.chunk.content);
      }
      // finalEvent = event;
    }
  }
}
