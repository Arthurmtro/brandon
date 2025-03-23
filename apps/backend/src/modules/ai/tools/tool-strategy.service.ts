import { DynamicStructuredTool } from 'langchain/tools';

export class ToolStrategyService {
  readonly tools: DynamicStructuredTool[] = [];

  public createTools(): DynamicStructuredTool[] {
    const toolMethods = Object.keys(this)
      .filter((prop) => (this as any)[prop] instanceof DynamicStructuredTool)
      .map((prop) => (this as any)[prop] as DynamicStructuredTool);

    return toolMethods;
  }
}
