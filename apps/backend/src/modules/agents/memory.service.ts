import { Injectable } from '@nestjs/common';
import { BufferMemory } from 'langchain/memory';

@Injectable()
export class MemoryService {
  private memories = new Map<string, BufferMemory>();

  getMemory(clientId: string): BufferMemory | undefined {
    if (!this.memories.has(clientId)) {
      this.memories.set(
        clientId,
        new BufferMemory({
          memoryKey: 'chat_history',
          inputKey: 'input',
          outputKey: 'output',
          returnMessages: true,
        }),
      );
    }
    return this.memories.get(clientId);
  }
}
