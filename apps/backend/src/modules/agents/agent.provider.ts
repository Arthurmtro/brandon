import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Tool } from '@langchain/core/tools';
import { ChatMistralAI } from '@langchain/mistralai';
import { Inject, Provider } from '@nestjs/common';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant.'],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export function InjectAgent() {
  return Inject('AGENT_EXECUTOR');
}

function handleParsingErrors(e: any) {
  console.log('ERROROROROORRR', e);
  return 'hey';
}

export const AgentExecutorProvider: Provider<AgentExecutor> = {
  provide: 'AGENT_EXECUTOR',
  useFactory: async (llm: ChatMistralAI, tools: Tool[]) => {
    const agent = await createToolCallingAgent({
      llm,
      tools: [],
      prompt,
      streamRunnable: false,
    });

    return AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      handleParsingErrors,
      verbose: true,
    });
  },
  inject: ['MISTRAL_CHAT_MODEL', 'TOOLS'],
};
