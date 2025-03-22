import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientAgentService {
  constructor(private readonly httpService: AxiosInstance) {
    this.httpService = axios.create({ baseURL: '' });
  }

  async getClientByName(name: string): Promise<any> {
    try {
      const response = await this.httpService.get(
        `/clients?name=${encodeURIComponent(name)}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          `Erreur lors de la récupération du client : ${error.message}`,
          error.response?.status || 500,
        );
      }
    }
  }
}
