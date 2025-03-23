import { Module } from '@nestjs/common';
import { MistralModule } from './mistral/mistral.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [MistralModule, OpenAIModule],
  exports: [MistralModule, OpenAIModule],
})
export class AiStrategiesModule {}
