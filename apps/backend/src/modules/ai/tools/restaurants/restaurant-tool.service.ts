import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class RestaurantToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly listRestaurants = tool(
    async (input: { page?: number }) => {
      console.log('listRestaurants');
      const client = this.hotelService.getClient();
      const response = await client.listRestaurants(input.page);

      const restaurantsList = response.results
        .map(
          (restaurant) =>
            `🍴 ${restaurant.name} (ID: ${restaurant.id}) - ${restaurant.location}, Capacité: ${restaurant.capacity}`,
        )
        .join('\n');

      return restaurantsList || 'Aucun restaurant trouvé.';
    },
    {
      name: 'list_restaurants',
      description: 'Lister les restaurants disponibles avec pagination.',
      schema: z.object({
        page: z.number().optional(),
      }),
    },
  );

  public readonly getRestaurant = tool(
    async (input: { id: number }) => {
      console.log('getRestaurant');
      const client = this.hotelService.getClient();
      const response = await client.listRestaurants();

      const restaurant = response.results.find(
        (resto) => resto.id === input.id,
      );

      if (!restaurant) return `Aucun restaurant trouvé avec l'ID ${input.id}.`;

      return `🍴 ${restaurant.name} (ID: ${restaurant.id})\n📍 Location: ${restaurant.location}\n🕒 Horaires: ${restaurant.opening_hours}\n📋 Description: ${restaurant.description}\n👥 Capacité: ${restaurant.capacity}\n✅ Actif: ${restaurant.is_active ? 'Oui' : 'Non'}`;
    },
    {
      name: 'get_restaurant',
      description: 'Obtenir les détails d’un restaurant par ID.',
      schema: z.object({
        id: z.number().positive().describe('Identifiant unique du restaurant'),
      }),
    },
  );
}
