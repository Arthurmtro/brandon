import { Module } from '@nestjs/common';
import { MistralAIChatModelProvider } from './mistral.provider';

@Module({
  providers: [MistralAIChatModelProvider],
  exports: [MistralAIChatModelProvider],
})
export class MistralModule {}
