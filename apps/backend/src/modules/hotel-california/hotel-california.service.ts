import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ClientModel,
  ClientInput,
  ReservationModel,
  ReservationInput,
  ReservationUpdateInput,
  SpaModel,
  PaginatedClientResponse,
  PaginatedReservationResponse,
  PaginatedRestaurantResponse,
  PaginatedMealTypeResponse,
  ListClientsParams,
  ListReservationsParams,
} from './hotel-california.types';
import {
  HotelCaliforniaClient,
  HotelCaliforniaClientConfig,
} from './hotel-california.client';

@Injectable()
export class HotelCaliforniaService implements OnModuleInit {
  private client: HotelCaliforniaClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const config: HotelCaliforniaClientConfig = {
      apiBaseUrl: this.configService.get<string>('HOTEL_API_BASE_URL') ?? '',
      timeout: this.configService.get<number>('HOTEL_API_TIMEOUT', 10000),
    };

    const token = this.configService.get<string>('HOTEL_API_TOKEN');

    if (!config.apiBaseUrl) {
      throw new Error('HOTEL_API_BASE_URL is not configured');
    }

    if (!token) {
      throw new Error('HOTEL_API_TOKEN is not configured');
    }

    this.client = new HotelCaliforniaClient(config, token);
  }

  /**
   * Creates a new client
   * @param input Client input data
   * @returns Created client
   */
  async createClient(input: ClientInput): Promise<ClientModel> {
    return this.client.createClient(input);
  }

  /**
   * Updates an existing client
   * @param clientId Client ID
   * @param input Client update data
   * @returns Updated client
   */
  async updateClient(
    clientId: number,
    input: ClientInput,
  ): Promise<ClientModel> {
    return this.client.updateClient(clientId, input);
  }

  /**
   * Deletes a client
   * @param clientId Client ID
   */
  async deleteClient(clientId: number): Promise<void> {
    return this.client.deleteClient(clientId);
  }

  /**
   * Gets client details
   * @param clientId Client ID
   * @returns Client details or undefined if not found
   */
  async getClient(clientId: number): Promise<ClientModel | undefined> {
    return this.client.getClient(clientId);
  }

  /**
   * Lists clients with optional filtering
   * @param params List parameters
   * @returns Paginated list of clients
   */
  async listClients(
    params: ListClientsParams = {},
  ): Promise<PaginatedClientResponse> {
    return this.client.listClients(params);
  }

  /**
   * Lists all restaurants
   * @param page Page number
   * @returns Paginated list of restaurants
   */
  async listRestaurants(page?: number): Promise<PaginatedRestaurantResponse> {
    return this.client.listRestaurants(page);
  }

  /**
   * Creates a new reservation
   * @param input Reservation input data
   * @returns Created reservation
   */
  async createReservation(input: ReservationInput): Promise<ReservationModel> {
    return this.client.createReservation(input);
  }

  /**
   * Partially updates an existing reservation
   * @param reservationId Reservation ID
   * @param input Update data
   * @returns Updated reservation
   */
  async updateReservation(
    reservationId: number,
    input: ReservationUpdateInput,
  ): Promise<ReservationModel> {
    return this.client.updateReservation(reservationId, input);
  }

  /**
   * Performs a full update of a reservation
   * @param reservationId Reservation ID
   * @param input Complete reservation data
   * @returns Updated reservation
   */
  async replaceReservation(
    reservationId: number,
    input: ReservationInput,
  ): Promise<ReservationModel> {
    return this.client.replaceReservation(reservationId, input);
  }

  /**
   * Deletes a reservation
   * @param reservationId Reservation ID
   */
  async deleteReservation(reservationId: number): Promise<void> {
    return this.client.deleteReservation(reservationId);
  }

  /**
   * Gets reservation details
   * @param reservationId Reservation ID
   * @returns Reservation details or undefined if not found
   */
  async getReservation(
    reservationId: number,
  ): Promise<ReservationModel | undefined> {
    return this.client.getReservation(reservationId);
  }

  /**
   * Lists reservations with optional filtering
   * @param params Filter parameters
   * @returns Paginated list of reservations
   */
  async listReservations(
    params: ListReservationsParams = {},
  ): Promise<PaginatedReservationResponse> {
    return this.client.listReservations(params);
  }

  /**
   * Lists all meal types
   * @param page Page number
   * @returns Paginated list of meal types
   */
  async listMealTypes(page?: number): Promise<PaginatedMealTypeResponse> {
    return this.client.listMealTypes(page);
  }

  /**
   * Gets spa information
   * @returns Spa details or undefined if not found
   */
  async getSpa(): Promise<SpaModel | undefined> {
    return this.client.getSpa();
  }
}
