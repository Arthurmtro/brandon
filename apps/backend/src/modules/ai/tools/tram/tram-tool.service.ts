import { Inject, Injectable } from '@nestjs/common';
import { HotelCaliforniaService } from '~/modules/hotel-california/hotel-california.service';
import { ToolStrategyService } from '../tool-strategy.service';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

@Injectable()
export class TramToolService extends ToolStrategyService {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  public readonly getTramInfo = tool(
    async ({ from, to, deadline }) => {
      const stops = await this.loadGTFSFile('stops.txt');
      const trips = await this.loadGTFSFile('trips.txt');
      const stopTimes = await this.loadGTFSFile('stop_times.txt');

      // Récupérer stop_ids pour from et to
      const fromStop = stops.find((s) =>
        s.stop_name.toLowerCase().includes(from.toLowerCase()),
      );
      const toStop = stops.find((s) =>
        s.stop_name.toLowerCase().includes(to.toLowerCase()),
      );
      if (!fromStop || !toStop) {
        return `Impossible de trouver les arrêts "${from}" ou "${to}".`;
      }

      const fromStopId = fromStop.stop_id;
      const toStopId = toStop.stop_id;

      // Récupérer les trips qui passent par from et ensuite par to
      const matchingTrips = stopTimes
        .filter((s) => s.stop_id === fromStopId)
        .map((s) => ({
          trip_id: s.trip_id,
          departure_time: s.departure_time,
          from_sequence: parseInt(s.stop_sequence),
        }))
        .filter((trip) => {
          const toMatch = stopTimes.find(
            (s) => s.trip_id === trip.trip_id && s.stop_id === toStopId,
          );
          return (
            toMatch && parseInt(toMatch.stop_sequence) > trip.from_sequence
          );
        });

      // TODO : Appel au flux temps réel TripUpdate
      // pour corriger les horaires si dispo

      return matchingTrips.slice(0, 5); // juste un aperçu pour tester
    },
    {
      name: 'get_tram_info',
      description: 'Obtenir les informations des trajets.',
      schema: z.object({
        from: z.string(),
        to: z.string(),
        deadline: z.string(), // format "HH:MM"
      }),
    },
  );

  async loadGTFSFile(fileName: string): Promise<any[]> {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(
        path.join(__dirname, '..', '..', 'gtfs-setram-lmm', fileName),
      )
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}
