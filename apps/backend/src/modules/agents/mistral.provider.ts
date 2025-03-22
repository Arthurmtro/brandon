import { MistralAI } from '@langchain/mistralai';
import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { GroqConfig } from '~configs/types/groq-config.type';
// import { GROQ_CHAT_MODEL } from '../constants/groq-chat-model.constant';

export function InjectChatModel() {
  return Inject('MISTRAL_CHAT_MODEL');
}

export const MistralAIChatModelProvider: Provider<MistralAI> = {
  provide: 'MISTRAL_CHAT_MODEL',
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.get('MISTRAL_API_KEY');
    return new MistralAI({
      apiKey,
      model: 'codestral-latest',
      // model: 'ministral-8b-latest',
      temperature: 0.3,
      maxTokens: 2048,
      streaming: false,
    });
  },
  inject: [ConfigService],
};
