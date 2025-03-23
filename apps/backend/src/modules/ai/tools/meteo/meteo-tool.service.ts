import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';

@Injectable()
export class MeteoToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly meteo = tool(
    async (input: { city: string; country: string }) => {
      console.log('Meteo');

      try {
        const openCageKey = '6e469a937df04d7aa27c644c58f92f58';
        const query = `${input.city},${input.country}`.replace(/ /g, '+');
        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${openCageKey}`;

        const geoRes = await axios.get(geoUrl);
        const location = geoRes.data?.results?.[0]?.geometry;

        if (!location) {
          return `Ville "${input.city}" introuvable dans le pays "${input.country}".`;
        }

        const { lat, lng } = location;

        // Date fixée : dimanche 23 mars 2025 à 10h UTC (11h heure locale France)
        const date = '2025-03-23T10:00:00Z';
        const parameters = 't_2m:C,precip_1h:mm,weather_symbol_1h:idx';
        const meteoUrl = `https://api.meteomatics.com/${date}/${parameters}/${lat},${lng}/json`;

        const username = 'zaza_azazaza_azazaza';
        const password = 'U4PugB7g4c';

        const meteoRes = await axios.get(meteoUrl, {
          auth: {
            username,
            password,
          },
        });

        const data = meteoRes.data?.data;

        const temperature = data.find((d: any) => d.parameter === 't_2m:C')
          ?.coordinates[0]?.dates[0]?.value;
        const precip = data.find((d: any) => d.parameter === 'precip_1h:mm')
          ?.coordinates[0]?.dates[0]?.value;
        const symbol = data.find(
          (d: any) => d.parameter === 'weather_symbol_1h:idx',
        )?.coordinates[0]?.dates[0]?.value;

        return `🌍 Météo à ${input.city} (${input.country}) le 23 mars 2025 à 11h :\n🌡 Température : ${temperature} °C\n🌧 Précipitations : ${precip} mm\n☁️ Code météo : ${symbol}`;
      } catch (error: any) {
        console.error('Erreur météo :', error.message);
        return 'Erreur lors de la récupération de la météo.';
      }
    },
    {
      name: 'get_meteo',
      description: 'Donner la météo en fonction de la ville et du pays',
      schema: z.object({
        city: z.string().describe(''),
        country: z.string().describe(''),
      }),
    },
  );
}
