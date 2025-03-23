import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  ListReservationsParams,
  ReservationParams,
  UpdateReservationParams,
} from '~/modules/hotel-california/hotel-california.types';

@Injectable()
export class ReservationToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly listReservations = tool(
    async (input: ListReservationsParams) => {
      console.log('listReservations');
      const client = this.hotelService.getClient();
      const response = await client.listReservations(input);
      return response.results
        .map(
          (r) =>
            `🆔 ${r.id} | Client: ${r.client}, Restaurant: ${r.restaurant}, Date: ${r.date}, Meal: ${r.meal}, Guests: ${r.number_of_guests}, Special Requests: ${r.special_requests || 'None'}`,
        )
        .join('\n');
    },
    {
      name: 'list_reservations',
      description: 'Lister les réservations avec filtres et pagination.',
      schema: z.object({
        clientId: z.number().optional(),
        restaurantId: z.number().optional(),
        mealId: z.number().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        page: z.number().optional(),
      }),
    },
  );

  public readonly createReservation = tool(
    async (input: ReservationParams) => {
      console.log('createReservation');
      const client = this.hotelService.getClient();

      const reservation = await client.createReservation(input);
      return `Réservation créée avec succès (ID: ${reservation.id}) pour le client ${reservation.client}, le ${reservation.date} au restaurant ${reservation.restaurant}.`;
    },
    {
      name: 'create_reservation',
      description: 'Créer une nouvelle réservation.',
      schema: z.object({
        clientId: z.number(),
        restaurantId: z.number(),
        date: z.string(),
        mealId: z.number(),
        numberOfGuests: z.number().int().positive(),
        specialRequests: z.string().optional(),
      }),
    },
  );

  public readonly getReservation = tool(
    async (input) => {
      console.log('getReservation');
      const client = this.hotelService.getClient();
      const r = await client.getReservation(input.id);
      if (!r) return `Aucune réservation trouvée pour l'ID ${input.id}`;
      return `🆔 ${r.id} | Client: ${r.client}, Restaurant: ${r.restaurant}, Date: ${r.date}, Meal: ${r.meal}, Guests: ${r.number_of_guests}, Special Requests: ${r.special_requests || 'None'}`;
    },
    {
      name: 'get_reservation',
      description: 'Obtenir les détails d’une réservation par ID.',
      schema: z.object({
        id: z
          .number()
          .positive()
          .describe('Identifiant unique de la réservation'),
      }),
    },
  );

  public readonly updateReservation = tool(
    async (input: { id: number; data: UpdateReservationParams }) => {
      console.log('updateReservation');
      const client = this.hotelService.getClient();
      const r = await client.updateReservation(input.id, input.data);
      if (!r)
        return `Impossible de trouver ou de mettre à jour la réservation avec l'ID ${input.id}`;
      return `Réservation mise à jour avec succès (ID: ${r.id}). Nouvelle date: ${r.date}, Restaurant: ${r.restaurant}, Clients: ${r.number_of_guests}`;
    },
    {
      name: 'update_reservation',
      description: 'Modifier une réservation existante.',
      schema: z.object({
        id: z.number().positive(),
        data: z.object({
          clientId: z.number().optional(),
          restaurantId: z.number().optional(),
          date: z.string().optional(),
          mealId: z.number().optional(),
          numberOfGuests: z.number().int().positive().optional(),
          specialRequests: z.string().optional(),
        }),
      }),
    },
  );

  public readonly deleteReservation = tool(
    async (input) => {
      console.log('deleteReservation');
      const client = this.hotelService.getClient();
      try {
        await client.deleteReservation(input.id);
        return `Réservation avec l'id ${input.id} supprimée avec succès.`;
      } catch {
        return `Aucune réservation trouvée ou erreur lors de la suppression avec l'id ${input.id}.`;
      }
    },
    {
      name: 'delete_reservation',
      description: 'Supprimer une réservation par son ID.',
      schema: z.object({
        id: z
          .number()
          .positive()
          .describe('Identifiant de la réservation à supprimer'),
      }),
    },
  );
}
