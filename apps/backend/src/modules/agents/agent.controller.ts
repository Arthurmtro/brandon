import { Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('')
  async test() {
    this.agentService.sendMessage('1', 'hello');
  }
}
