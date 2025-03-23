import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class SpaToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly getSpaInfo = tool(
    async () => {
      const spa = await this.hotelService.getSpa();

      if (!spa) return 'Aucune information sur le spa trouvée.';

      return `🧖 Spa : ${spa.name}\n📍 Emplacement : ${spa.location}\n📞 Téléphone : ${spa.phone_number}\n📧 Email : ${spa.email}\n🕒 Horaires d'ouverture : ${spa.opening_hours}\n📋 Description : ${spa.description}\n📅 Créé le : ${spa.created_at}\n🔄 Mis à jour le : ${spa.updated_at}`;
    },
    {
      name: 'get_spa_info',
      description: 'Obtenir les informations détaillées sur le spa.',
      schema: z.object({}),
    },
  );
}
