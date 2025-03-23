import { z, Schema } from 'zod';
import {} from 'langchain/tools/chain';
import { tool } from '@langchain/core/tools';

export interface ToolBase {
  readonly name: string;
  readonly description: string;
  readonly schema: Schema;

  // constructor() {}
}
