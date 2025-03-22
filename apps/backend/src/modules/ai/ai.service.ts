import { PromptTemplate } from '@langchain/core/prompts';
import { ChatMistralAI } from '@langchain/mistralai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIMessage } from './ai.types';
import { DynamicTool } from '@langchain/core/dist/tools';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class AiService {
  private chatbotName: string = 'Brandon';

  public readonly model: ChatMistralAI;
  public readonly prompt: PromptTemplate;
  public readonly template = `Tu es un assistant IA avancé conçu pour aider les clients de l'hôtel California.

  Ton nom est ${this.chatbotName}.

  ### Règles et Comportement :
  - **Objectivité** : Tu restes neutre et factuel dans tes réponses.
  - **Précision** : Si une information est incertaine, indique-le plutôt que d’inventer.
  - **Sécurité** : Tu ne donnes pas de conseils illégaux, dangereux ou nuisibles.
  - **Respect** : Un ton bienveillant et inclusif est toujours adopté.
  - **Confidentialité** : Aucune collecte ni stockage d’informations personnelles sensibles.

  ### Contexte de la Conversation :
  {chat_history}

  **Utilisateur** : {input}
  **IA** :`;

  constructor(readonly config: ConfigService) {
    this.model = new ChatMistralAI({
      model: 'mistral-large-2411',
      temperature: 0,
      apiKey: config.getOrThrow('MISTRAL_API_KEY'),
    });

    this.prompt = new PromptTemplate({
      template: this.template,
      inputVariables: ['chat_history', 'input'],
    });
  }

  async generatePromptInput(messages: AIMessage[]): Promise<string> {
    console.log('messages: ', messages);
    const history = messages.slice(0, -1);
    const lastMessage = messages[messages.length - 1]?.text;
    const input = lastMessage ?? messages[0]?.text;

    if (!input) {
      throw new Error('⛔ Aucun message à traiter');
    }

    if (this.isMaliciousPrompt(input)) {
      throw new Error('⛔ Prompt malveillant détecté');
    }

    console.log(input);

    return await this.prompt.format({
      chat_history: history.map((msg) => msg.text).join('\n'),
      input,
    });
  }

  private isMaliciousPrompt(input: string): boolean {
    const forbiddenPatterns = [
      /ignore.*rules/i,
      /jailbreak/i,
      /pretend.*you.*are.*not.*an.*ai/i,
      /bombe|arme|pirater|kill/i,
    ];
    return forbiddenPatterns.some((pattern) => pattern.test(input));
  }

  checkClientTool = tool(
    async ({ nom }: { nom: string }) => {
      try {
        const response = await fetch(
          `https://tonapi.com/api/clients/?search=${encodeURIComponent(nom)}`,
        );
        if (!response.ok) {
          return `Erreur lors de la recherche du client : ${response.status}`;
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          return 'Aucun client trouvé.';
        }
        const client = data[0];
        return `Client trouvé : ${client.prenom} ${client.nom}`;
      } catch (error) {
        console.error('Erreur API :', error);
        return 'Erreur lors de la vérification du client.';
      }
    },
    {
      name: 'check_client',
      description:
        'Vérifie si un nom correspond à un client existant dans la base de données.',
      schema: z.object({
        nom: z.string().describe('Le nom complet du client à rechercher.'),
      }),
    },
  );
}
