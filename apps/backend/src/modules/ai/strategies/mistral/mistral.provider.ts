import { ChatMistralAI } from '@langchain/mistralai';
import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MISTRAL_PROVIDER } from './mistral.const';

export function InjectMistralChat() {
  return Inject(MISTRAL_PROVIDER);
}

export const MistralAIChatModelProvider: Provider<ChatMistralAI> = {
  provide: MISTRAL_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.get('MISTRAL_API_KEY');
    return new ChatMistralAI({
      apiKey,
      model: 'mistral-large-latest',
      temperature: 0.3,
    });
  },
  inject: [ConfigService],
};
