import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import * as cheerio from 'cheerio';
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class TourismToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly getTourismInfo = tool(
    async () => {
      console.log('getTourismInfo');
      const url =
        'https://www.lemans-tourisme.com/fr/decouvrir/les-incontournables.html';
      const docs = await this.loadWebPages([url]);
      console.log('📄 docs:', docs);

      if (!docs.length)
        return 'Aucune donnée trouvée sur les incontournables du Mans.';

      return docs
        .map((d, i) => `# Incontournable ${i + 1}\n\n${d.pageContent}`)
        .join('\n\n');
    },
    {
      name: 'get_tourism_info',
      description: 'Savoir les activités à faire sur Le Mans.',
      schema: z.object({}),
    },
  );

  splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  async loadWebPages(webPages: string[]) {
    const loaders = webPages.map(
      (page) =>
        new PuppeteerWebBaseLoader(page, {
          launchOptions: { headless: true },
          gotoOptions: { waitUntil: 'networkidle0' },
          evaluate: async (page) => {
            await page.evaluate(
              () => new Promise((resolve) => setTimeout(resolve, 2000)),
            );
            return await page.content();
          },
        }),
    );

    const docs = await Promise.all(loaders.map((loader) => loader.load()));
    console.log('loadWebPages', docs);

    const flatDocs = docs.flat();
    return this.splitter.splitDocuments(flatDocs);
  }
}
