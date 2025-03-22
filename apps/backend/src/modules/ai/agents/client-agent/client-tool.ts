import { Tool } from 'langchain/tools';
import { ClientAgentService } from './client-agent.service';

export class ClientTool extends Tool {
  name = 'get_client_by_name';
  description = "Récupère les informations d'un client en fonction de son nom";

  constructor(private readonly clientAgentService: ClientAgentService) {
    super();
  }

  async _call(name: string): Promise<any> {
    return this.clientAgentService.getClientByName(name);
  }
}
