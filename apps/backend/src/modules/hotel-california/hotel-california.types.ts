import type { AxiosPromise, RawAxiosRequestConfig } from 'axios';

/**
 * Base models
 */

// Base model that all entities extend
export interface BaseModel {
  id: number;
}

/**
 * Client models
 */
export interface ClientModel extends BaseModel {
  name: string;
  phone_number: string;
  room_number?: string | null;
  special_requests?: string;
}

export interface ClientInput {
  name: string;
  phone_number: string;
  room_number?: string | null;
  special_requests?: string;
}

/**
 * Restaurant models
 */
export interface RestaurantModel extends BaseModel {
  name: string;
  description: string;
  capacity: number;
  opening_hours: string;
  location: string;
  is_active?: boolean;
}

/**
 * Meal models
 */
export interface MealTypeModel extends BaseModel {
  name: string;
}

/**
 * Reservation models
 */
export interface ReservationModel extends BaseModel {
  client: number;
  restaurant: number;
  date: string;
  meal: number;
  number_of_guests: number;
  special_requests?: string;
}

export interface ReservationInput {
  client: number;
  restaurant: number;
  date: string;
  meal: number;
  number_of_guests: number;
  special_requests?: string;
}

/**
 * Used for PATCH requests that allow partial updates
 * Makes all fields from ReservationInput optional and adds update-specific fields
 */
export interface ReservationUpdateInput extends Partial<ReservationInput> {
  status?: 'confirmed' | 'pending' | 'cancelled';
  update_reason?: string;
  notify_client?: boolean;
}

/**
 * Spa models
 */
export interface SpaModel extends BaseModel {
  name: string;
  description: string;
  location: string;
  phone_number: string;
  email: string;
  opening_hours: string;
  created_at: string;
  updated_at: string;
}

/**
 * Pagination utilities
 */
export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export type PaginatedClientResponse = PaginatedResponse<ClientModel>;
export type PaginatedMealTypeResponse = PaginatedResponse<MealTypeModel>;
export type PaginatedReservationResponse = PaginatedResponse<ReservationModel>;
export type PaginatedRestaurantResponse = PaginatedResponse<RestaurantModel>;

/**
 * Request parameter interfaces
 */

// Client parameters
export interface ListClientsParams {
  page?: number;
  search?: string;
}

export interface ClientDetailParams {
  id: number;
}

export interface UpdateClientParams extends ClientDetailParams {
  data: ClientInput;
}

export interface CreateClientParams {
  data: ClientInput;
}

// Restaurant parameters
export interface ListRestaurantsParams {
  page?: number;
}

// Meal parameters
export interface ListMealsParams {
  page?: number;
}

// Reservation parameters
export interface ListReservationsParams {
  client?: number;
  date_from?: string;
  date_to?: string;
  meal?: number;
  page?: number;
  restaurant?: number;
}

export interface ReservationDetailParams {
  id: number;
}

export interface CreateReservationParams {
  data: ReservationInput;
}

export interface UpdateReservationParams extends ReservationDetailParams {
  data: ReservationInput;
}

export interface PartialUpdateReservationParams
  extends ReservationDetailParams {
  data: ReservationUpdateInput;
}

/**
 * Schema parameters
 */
export type SchemaFormat = 'json' | 'yaml';

export type SchemaLanguage =
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'it'
  | 'pt'
  | 'pt-br'
  | 'ja'
  | 'zh-hans'
  | 'zh-hant'
  | 'ar'
  | 'ru'
  | string; // Allow for other language codes not explicitly listed

export interface SchemaParams {
  format?: SchemaFormat;
  lang?: SchemaLanguage;
}

/**
 * API Response types
 */
export type ClientResponse = AxiosPromise<ClientModel>;
export type ReservationResponse = AxiosPromise<ReservationModel>;
export type SpaResponse = AxiosPromise<SpaModel>;
export type SchemaResponse = AxiosPromise<Record<string, any>>;

export type ListClientsResponse = AxiosPromise<PaginatedClientResponse>;
export type ListMealsResponse = AxiosPromise<PaginatedMealTypeResponse>;
export type ListReservationsResponse =
  AxiosPromise<PaginatedReservationResponse>;
export type ListRestaurantsResponse = AxiosPromise<PaginatedRestaurantResponse>;

/**
 * Type guards
 */
export function isClientModel(obj: any): obj is ClientModel {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.phone_number === 'string'
  );
}

export function isReservationModel(obj: any): obj is ReservationModel {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.client === 'number' &&
    typeof obj.restaurant === 'number' &&
    typeof obj.date === 'string' &&
    typeof obj.meal === 'number' &&
    typeof obj.number_of_guests === 'number'
  );
}

export function buildApiConfig(token: string): RawAxiosRequestConfig {
  return {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
}

/**
 * Compatibility with OpenAPI generated types
 */
export type Client = ClientModel;
export type ClientRequest = ClientInput;
export type Reservation = ReservationModel;
export type ReservationRequest = ReservationInput;
export type PatchedReservationRequest = ReservationUpdateInput;
export type Restaurant = RestaurantModel;
export type MealType = MealTypeModel;
export type Spa = SpaModel;

export type PaginatedClientList = PaginatedClientResponse;
export type PaginatedMealTypeList = PaginatedMealTypeResponse;
export type PaginatedReservationList = PaginatedReservationResponse;
export type PaginatedRestaurantList = PaginatedRestaurantResponse;

// Request parameter compatibility
export type ClientsApiClientsCreateRequest = CreateClientParams;
export type ClientsApiClientsDestroyRequest = ClientDetailParams;
export type ClientsApiClientsListRequest = ListClientsParams;
export type ClientsApiClientsRetrieveRequest = ClientDetailParams;
export type ClientsApiClientsUpdateRequest = UpdateClientParams;

export type MealsApiMealsListRequest = ListMealsParams;

export type ReservationsApiReservationsCreateRequest = CreateReservationParams;
export type ReservationsApiReservationsDestroyRequest = ReservationDetailParams;
export type ReservationsApiReservationsListRequest = ListReservationsParams;
export type ReservationsApiReservationsPartialUpdateRequest =
  PartialUpdateReservationParams;
export type ReservationsApiReservationsRetrieveRequest =
  ReservationDetailParams;
export type ReservationsApiReservationsUpdateRequest = UpdateReservationParams;

export type RestaurantsApiRestaurantsListRequest = ListRestaurantsParams;

export type SchemaApiSchemaRetrieveRequest = SchemaParams;
