import axios, { AxiosInstance, isAxiosError } from 'axios';

import {
  ClientsApi,
  RestaurantsApi,
  ReservationsApi,
  MealsApi,
  SpasApi,
  DefaultApi,
  SchemaApi,
  Configuration,
  ClientRequest,
} from '~/clients/hotel-california/api';
import {
  ClientResponse,
  PaginatedClientListResponse,
  PaginatedRestaurantListResponse,
  ReservationResponse,
  ReservationRequest,
  PatchedReservationRequest,
  PaginatedReservationListResponse,
  PaginatedMealTypeListResponse,
  SpaResponse,
} from '~/clients/hotel-california/response';
import {
  CreateClientParams,
  HotelCaliforniaClientConfig,
  ListClientsParams,
  ListReservationsParams,
  ReservationParams,
  UpdateClientParams,
  UpdateReservationParams,
} from './hotel-california.types';

export class HotelCaliforniaClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly clientsApi: ClientsApi;
  private readonly restaurantsApi: RestaurantsApi;
  private readonly reservationsApi: ReservationsApi;
  private readonly mealsApi: MealsApi;
  private readonly spasApi: SpasApi;
  private readonly defaultApi: DefaultApi;
  private readonly schemaApi: SchemaApi;

  /**
   * Constructor.
   * @param config Client configuration
   * @param token Authentication token
   */
  constructor(
    readonly config: HotelCaliforniaClientConfig,
    private readonly token: string,
  ) {
    this.axiosInstance = axios.create({ baseURL: this.config.apiBaseUrl });

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

    this.defaultApi = new DefaultApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );

    this.schemaApi = new SchemaApi(
      apiConfig,
      this.config.apiBaseUrl,
      this.axiosInstance,
    );
  }

  /**
   * Creates a new client
   * @param params Client creation parameters
   * @returns Created client
   */
  async createClient(params: CreateClientParams): Promise<ClientResponse> {
    const clientRequest: ClientRequest = {
      name: params.name,
      phone_number: params.phoneNumber,
      room_number: params.roomNumber,
      special_requests: params.specialRequests,
    };

    const response = await this.clientsApi.clientsCreate({
      clientRequest,
    });

    return response.data as unknown as ClientResponse;
  }

  /**
   * Updates an existing client
   * @param clientId Client ID
   * @param params Client update parameters
   * @returns Updated client
   */
  async updateClient(
    clientId: number,
    params: UpdateClientParams,
  ): Promise<ClientResponse> {
    const clientRequest: ClientRequest = {
      name: params.name,
      phone_number: params.phoneNumber,
      room_number: params.roomNumber,
      special_requests: params.specialRequests,
    };

    const response = await this.clientsApi.clientsUpdate({
      id: clientId,
      clientRequest,
    });

    return response.data as unknown as ClientResponse;
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
   * @returns Client details
   */
  async getClient(clientId: number): Promise<ClientResponse | undefined> {
    try {
      const response = await this.clientsApi.clientsRetrieve({
        id: clientId,
      });
      return response.data as unknown as ClientResponse;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
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
  ): Promise<PaginatedClientListResponse> {
    const response = await this.clientsApi.clientsList({
      page: params.page,
      search: params.search,
    });

    return response.data as unknown as PaginatedClientListResponse;
  }

  /**
   * Lists all restaurants
   * @param page Page number
   * @returns Paginated list of restaurants
   */
  async listRestaurants(
    page?: number,
  ): Promise<PaginatedRestaurantListResponse> {
    const response = await this.restaurantsApi.restaurantsList({
      page,
    });

    return response.data as unknown as PaginatedRestaurantListResponse;
  }

  /**
   * Creates a new reservation
   * @param params Reservation parameters
   * @returns Created reservation
   */
  async createReservation(
    params: ReservationParams,
  ): Promise<ReservationResponse> {
    const reservationRequest: ReservationRequest = {
      client: params.clientId,
      restaurant: params.restaurantId,
      date: params.date,
      meal: params.mealId,
      number_of_guests: params.numberOfGuests,
      special_requests: params.specialRequests,
    };

    const response = await this.reservationsApi.reservationsCreate({
      reservationRequest,
    });

    return response.data as unknown as ReservationResponse;
  }

  /**
   * Updates an existing reservation
   * @param reservationId Reservation ID
   * @param params Update parameters
   * @returns Updated reservation
   */
  async updateReservation(
    reservationId: number,
    params: UpdateReservationParams,
  ): Promise<ReservationResponse> {
    const patchedReservationRequest: PatchedReservationRequest = {};

    if (params.clientId !== undefined)
      patchedReservationRequest.client = params.clientId;
    if (params.restaurantId !== undefined)
      patchedReservationRequest.restaurant = params.restaurantId;
    if (params.date !== undefined) patchedReservationRequest.date = params.date;
    if (params.mealId !== undefined)
      patchedReservationRequest.meal = params.mealId;
    if (params.numberOfGuests !== undefined)
      patchedReservationRequest.number_of_guests = params.numberOfGuests;
    if (params.specialRequests !== undefined)
      patchedReservationRequest.special_requests = params.specialRequests;

    const response = await this.reservationsApi.reservationsPartialUpdate({
      id: reservationId,
      patchedReservationRequest,
    });

    return response.data as unknown as ReservationResponse;
  }

  /**
   * Performs a full update of a reservation
   * @param reservationId Reservation ID
   * @param params Update parameters
   * @returns Updated reservation
   */
  async replaceReservation(
    reservationId: number,
    params: ReservationParams,
  ): Promise<ReservationResponse> {
    const reservationRequest: ReservationRequest = {
      client: params.clientId,
      restaurant: params.restaurantId,
      date: params.date,
      meal: params.mealId,
      number_of_guests: params.numberOfGuests,
      special_requests: params.specialRequests,
    };

    const response = await this.reservationsApi.reservationsUpdate({
      id: reservationId,
      reservationRequest,
    });

    return response.data as unknown as ReservationResponse;
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
   * @returns Reservation details
   */
  async getReservation(
    reservationId: number,
  ): Promise<ReservationResponse | undefined> {
    try {
      const response = await this.reservationsApi.reservationsRetrieve({
        id: reservationId,
      });
      return response.data as unknown as ReservationResponse;
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
  ): Promise<PaginatedReservationListResponse> {
    const response = await this.reservationsApi.reservationsList({
      client: params.clientId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      meal: params.mealId,
      page: params.page,
      restaurant: params.restaurantId,
    });

    return response.data as unknown as PaginatedReservationListResponse;
  }

  /**
   * Lists all meal types
   * @param page Page number
   * @returns Paginated list of meal types
   */
  async listMealTypes(page?: number): Promise<PaginatedMealTypeListResponse> {
    const response = await this.mealsApi.mealsList({
      page,
    });

    return response.data as unknown as PaginatedMealTypeListResponse;
  }

  /**
   * Gets spa information
   * @returns Spa details
   */
  async getSpa(): Promise<SpaResponse | undefined> {
    try {
      const response = await this.spasApi.spasRetrieve();
      return response.data as unknown as SpaResponse;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}
