import { Injectable } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';
import { InjectAgent } from './agent.provider';

@Injectable()
export class AgentService {
  @InjectAgent() private agentExecutor: AgentExecutor;

  private readonly histories: Record<string, string> = {};

  async sendMessage(clientId: string, input: string) {
    const history = this.histories[clientId] || [];
    const { output } = await this.agentExecutor.invoke({
      input,
      // chat_history: history,
      chat_history: [],
    });
    console.log('output', output);

    // this.histories[clientId] = [...history, { input, output }];

    return output;
  }
}
