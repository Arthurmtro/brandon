import axios, { AxiosInstance, isAxiosError } from 'axios';

import {
  ClientsApi,
  RestaurantsApi,
  ReservationsApi,
  MealsApi,
  SpasApi,
  Configuration,
} from '~/clients/hotel-california/api';

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

/**
 * Configuration for the Hotel California API client
 */
export interface HotelCaliforniaClientConfig {
  apiBaseUrl: string;
  timeout?: number;
}

/**
 * Client implementation for the Hotel California API
 */
export class HotelCaliforniaClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly clientsApi: ClientsApi;
  private readonly restaurantsApi: RestaurantsApi;
  private readonly reservationsApi: ReservationsApi;
  private readonly mealsApi: MealsApi;
  private readonly spasApi: SpasApi;

  /**
   * Constructor.
   * @param config Client configuration
   * @param token Authentication token
   */
  constructor(
    readonly config: HotelCaliforniaClientConfig,
    private readonly token: string,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: this.config.timeout,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers.set('Authorization', `Token ${this.token}`);
      return config;
    });

    const apiConfig = new Configuration({
      basePath: this.config.apiBaseUrl,
      apiKey: `Token ${this.token}`,
    });

    this.clientsApi = new ClientsApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );

    this.restaurantsApi = new RestaurantsApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );

    this.reservationsApi = new ReservationsApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );

    this.mealsApi = new MealsApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );

    this.spasApi = new SpasApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );
  }

  /**
   * Creates a new client
   * @param input Client input data
   * @returns Created client
   */
  async createClient(input: ClientInput): Promise<ClientModel> {
    const response = await this.clientsApi.clientsCreate({
      clientRequest: input,
    });

    return response.data;
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
    const response = await this.clientsApi.clientsUpdate({
      id: clientId,
      clientRequest: input,
    });

    return response.data;
  }

  /**
   * Deletes a client
   * @param clientId Client ID
   */
  async deleteClient(clientId: number): Promise<void> {
    await this.clientsApi.clientsDestroy({
      id: clientId,
    });
  }

  /**
   * Gets client details
   * @param clientId Client ID
   * @returns Client details or undefined if not found
   */
  async getClient(clientId: number): Promise<ClientModel | undefined> {
    try {
      const response = await this.clientsApi.clientsRetrieve({
        id: clientId,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lists clients with optional filtering
   * @param params List parameters
   * @returns Paginated list of clients
   */
  async listClients(
    params: ListClientsParams = {},
  ): Promise<PaginatedClientResponse> {
    const response = await this.clientsApi.clientsList({
      page: params.page,
      search: params.search,
    });

    return response.data;
  }

  /**
   * Lists all restaurants
   * @param page Page number
   * @returns Paginated list of restaurants
   */
  async listRestaurants(page?: number): Promise<PaginatedRestaurantResponse> {
    const response = await this.restaurantsApi.restaurantsList({
      page,
    });

    return response.data;
  }

  /**
   * Creates a new reservation
   * @param input Reservation input data
   * @returns Created reservation
   */
  async createReservation(input: ReservationInput): Promise<ReservationModel> {
    const response = await this.reservationsApi.reservationsCreate({
      reservationRequest: input,
    });

    return response.data;
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
    const response = await this.reservationsApi.reservationsPartialUpdate({
      id: reservationId,
      patchedReservationRequest: input,
    });

    return response.data;
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
    const response = await this.reservationsApi.reservationsUpdate({
      id: reservationId,
      reservationRequest: input,
    });

    return response.data;
  }

  /**
   * Deletes a reservation
   * @param reservationId Reservation ID
   */
  async deleteReservation(reservationId: number): Promise<void> {
    await this.reservationsApi.reservationsDestroy({
      id: reservationId,
    });
  }

  /**
   * Gets reservation details
   * @param reservationId Reservation ID
   * @returns Reservation details or undefined if not found
   */
  async getReservation(
    reservationId: number,
  ): Promise<ReservationModel | undefined> {
    try {
      const response = await this.reservationsApi.reservationsRetrieve({
        id: reservationId,
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * Lists reservations with optional filtering
   * @param params Filter parameters
   * @returns Paginated list of reservations
   */
  async listReservations(
    params: ListReservationsParams = {},
  ): Promise<PaginatedReservationResponse> {
    const response = await this.reservationsApi.reservationsList({
      client: params.client,
      dateFrom: params.date_from,
      dateTo: params.date_to,
      meal: params.meal,
      page: params.page,
      restaurant: params.restaurant,
    });

    return response.data;
  }

  /**
   * Lists all meal types
   * @param page Page number
   * @returns Paginated list of meal types
   */
  async listMealTypes(page?: number): Promise<PaginatedMealTypeResponse> {
    const response = await this.mealsApi.mealsList({
      page,
    });

    return response.data;
  }

  /**
   * Gets spa information
   * @returns Spa details or undefined if not found
   */
  async getSpa(): Promise<SpaModel | undefined> {
    try {
      const response = await this.spasApi.spasRetrieve();
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}
