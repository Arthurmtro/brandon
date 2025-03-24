import { Controller, Get, Inject, Query, Sse } from '@nestjs/common';
import { AgentService } from './agent.service';
import { from, map, Observable } from 'rxjs';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

@Controller('agents')
export class AgentController {
  @Inject() private readonly agentService: AgentService;

  @Get()
  @ApiOkResponse({ type: String })
  async sendMEssage(
    @Query('input') input: string,
    @Query('clientId') clientId: string,
  ) {
    const response = await this.agentService.sendMessage(clientId, input);

    return response;
  }
}
