import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class UserToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  // public readonly getUser = tool(
  //   async (input) => {
  //     console.log('getUser');
  //     const query = encodeURIComponent(input.query);
  //     try {
  //       const client = this.hotelService.getClient();
  //       const { results } = await client.listClients({ search: query });

  //       if (!results || results.length === 0) {
  //         return `Aucun client trouvé pour : ${input.query}`;
  //       }

  //       return results
  //         .map((c) => {
  //           return `👤 ${c.name}\n📞 Téléphone : ${c.phone_number}\n🚪 Chambre : ${c.room_number}\n📝 Demandes spéciales : ${c.special_requests || 'Aucune'}`;
  //         })
  //         .join('\n\n');
  //     } catch (error) {
  //       return `Erreur lors de la recherche : ${(error as any)?.message}`;
  //     }
  //   },
  //   {
  //     name: 'get_client',
  //     description:
  //       'Recherche un client par nom, prénom ou numéro de téléphone.',
  //     schema: z.object({
  //       query: z
  //         .string()
  //         .describe('Nom, prénom ou numéro du client à chercher'),
  //     }),
  //   },
  // );

  public readonly createClient = tool(
    async (input) => {
      console.log('createClient');
      const result = await this.hotelService.createClient(input);
      // .catch((err) => {
      //   console.log('err', err);
      //   throw new Error(err);
      // });
      console.log('result', result);
      return `Client créé avec succès : 👤 ${result.name} (ID: ${result.id})\n📞 Téléphone : ${result.phone_number}\n🚪 Chambre : ${result.room_number}\n📝 Demandes spéciales : ${result.special_requests || 'Aucune'}`;
    },
    {
      name: 'create_client',
      description: 'Créer un nouveau client.',
      schema: z.object({
        name: z.string().min(1),
        phone_number: z.string(),
        room_number: z.string().nullable().optional(),
        special_requests: z.string().optional(),
      }),
    },
  );

  public readonly getClientById = tool(
    async (input) => {
      console.log('getClientById');
      const c = await this.hotelService.getClient(input.id);

      if (!c) return `Aucun client trouvé pour l'ID ${input.id}`;

      // 👇 Return a formatted string explicitly
      return `👤 ${c.name} (ID: ${c.id})
  📞 Téléphone : ${c.phone_number}
  🚪 Chambre : ${c.room_number}
  📝 Demandes spéciales : ${c.special_requests || 'Aucune'}`;
    },
    {
      name: 'get_client_by_id',
      description: 'Récupérer les détails d’un client par ID.',
      schema: z.object({
        id: z.number().positive().describe('Identifiant unique du client'),
      }),
    },
  );

  public readonly updateClient = tool(
    async (input) => {
      console.log('updateClient');

      return await this.hotelService.updateClient(input.id, input.data);
    },
    {
      name: 'update_client',
      description: 'Mettre à jour les informations d’un client existant.',
      schema: z.object({
        id: z.number().positive().describe('Identifiant du client à modifier'),
        data: z.object({
          name: z.string(),
          phone_number: z.string(),
          room_number: z.string().nullable().optional(),
          special_requests: z.string().optional(),
        }),
      }),
    },
  );

  public readonly deleteClient = tool(
    async (input) => {
      console.log('deleteClient');
      await this.hotelService.deleteClient(input.id);
      return `Client avec l'id ${input.id} supprimé avec succès.`;
    },
    {
      name: 'delete_client',
      description: 'Supprimer un client par son ID.',
      schema: z.object({
        id: z.number().positive().describe('Identifiant du client à supprimer'),
      }),
    },
  );

  public readonly listClients = tool(
    async (input) => {
      console.log('listClients');
      const result = await this.hotelService.listClients(input);

      if (!result.results || result.results.length === 0) {
        return 'Aucun client trouvé.';
      }
      return result.results
        .map(
          (c) =>
            `👤 ${c.name} (ID: ${c.id})\n📞 Téléphone : ${c.phone_number}\n🚪 Chambre : ${c.room_number}\n📝 Demandes spéciales : ${c.special_requests || 'Aucune'}`,
        )
        .join('\n\n');
    },
    {
      name: 'list_clients',
      description: 'Lister les clients avec pagination et option de recherche.',
      schema: z.object({
        search: z.string().optional(),
        page: z.number().positive().optional(),
      }),
    },
  );
}
