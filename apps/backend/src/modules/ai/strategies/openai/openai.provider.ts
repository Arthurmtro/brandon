import { ChatOpenAI } from '@langchain/openai';
import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OPENAI_PROVIDER } from './openai.const';

export function InjectOpenAIChat() {
  return Inject(OPENAI_PROVIDER);
}

export const OpenAIChatModelProvider: Provider<ChatOpenAI> = {
  provide: OPENAI_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.get('OPENAI_API_KEY');
    return new ChatOpenAI({
      apiKey,
      temperature: 0.3,
      model: 'gpt-4o',
    });
  },
  inject: [ConfigService],
};
