import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ToolsProvider } from './tools.providet';
import { AgentController } from './agent.controller';
import { AiStrategiesModule } from '../ai/strategies/ai-strategies.module';
import { ToolModule } from '../ai/tools/tool.module';
import { MemoryService } from './memory.service';

@Module({
  imports: [AiStrategiesModule, ToolModule],
  providers: [AgentService, ToolsProvider, MemoryService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}
