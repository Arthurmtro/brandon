import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import * as cheerio from 'cheerio';

@Injectable()
export class TourismToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly getTourismInfo = tool(
    async () => {
      console.log('getTourismInfo');
      const url =
        'https://www.lemans-tourisme.com/fr/decouvrir/les-incontournables.html';
      const loader = new CheerioWebBaseLoader(url);
      const [doc] = await loader.load();
      if (!doc) {
        return;
      }
      const $ = cheerio.load(doc.pageContent);

      // Sélecteur pour les titres des incontournables
      const titres = $('h2')
        .map((i: any, el: any) => $(el).text().trim())
        .get();

      // Sélecteur pour les descriptions des incontournables
      const descriptions = $('p')
        .map((i: any, el: any) => $(el).text().trim())
        .get();

      // Combiner les titres et descriptions
      // const incontournables = titres.map((titre: any, index: any) => ({
      //   titre,
      //   description: descriptions[index] || 'Description non disponible',
      // }));
      // Combiner les titres et descriptions
      const incontournables = titres.map(
        (titre: any, index: any) =>
          `${titre}: ${descriptions[index] || 'Description non disponible'}`,
      );

      console.log('incontournables', incontournables);
      // return incontournables;
      return `
      Cité Plantagenêt – Medieval old town with cobbled streets and timber-framed houses.
Cathédrale Saint-Julien – Gothic and Romanesque architecture with stunning stained-glass windows.
Remparts Gallo-Romains – Ancient Roman walls still visible today.
Musée des 24 Heures du Mans – Motor racing museum honoring the famous 24-hour race.
Abbaye Royale de l’Épau – Historic abbey founded in 1229 by Queen Bérengère.
      `;
    },
    {
      name: 'get_tourism_info',
      description: 'Obtenir les choses à faire sur Le Mans.',
      schema: z.object({}),
    },
  );
}
