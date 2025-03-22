export interface AIMessage {
  readonly role: 'user' | 'assistant';
  readonly text: string;
}
