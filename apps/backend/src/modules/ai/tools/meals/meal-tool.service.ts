import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class MealToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly listMealTypes = tool(
    async (input: { page?: number }) => {
      console.log('listMealTypes');
      const client = this.hotelService.getClient();
      const response = await client.listMealTypes(input.page);

      const mealsList = response.results
        .map((meal) => `🍽️ ${meal.name} (ID: ${meal.id})`)
        .join('\n');

      return mealsList || 'Aucun type de repas trouvé.';
    },
    {
      name: 'list_meal_types',
      description: 'Lister les types de repas disponibles avec pagination.',
      schema: z.object({
        page: z.number().optional(),
      }),
    },
  );
}
