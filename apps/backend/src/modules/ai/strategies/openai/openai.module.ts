import { Module } from '@nestjs/common';
import { OpenAIChatModelProvider } from './openai.provider';

@Module({
  providers: [OpenAIChatModelProvider],
  exports: [OpenAIChatModelProvider],
})
export class OpenAIModule {}
