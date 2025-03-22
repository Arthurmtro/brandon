import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelCaliforniaClient } from './hotel-california.client';

@Injectable()
export class HotelCaliforniaService {
  private readonly client: HotelCaliforniaClient;

  constructor(private readonly configService: ConfigService) {
    const apiBaseUrl = this.configService.get<string>('HOTEL_API_BASE_URL');
    const apiToken = this.configService.get<string>('HOTEL_API_TOKEN');

    if (!apiBaseUrl || !apiToken) {
      throw new Error('Hotel API configuration is missing');
    }

    this.client = new HotelCaliforniaClient({ apiBaseUrl }, apiToken);
  }

  getClient(): HotelCaliforniaClient {
    return this.client;
  }
}
