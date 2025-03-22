import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentExecutorProvider } from './agent.provider';
import { MistralAIChatModelProvider } from './mistral.provider';
import { ToolsProvider } from './tools.providet';
import { AgentController } from './agent.controller';

@Module({
  providers: [
    AgentService,
    AgentExecutorProvider,
    MistralAIChatModelProvider,
    ToolsProvider,
  ],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}
