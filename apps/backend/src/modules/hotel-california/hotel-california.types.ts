/**
 * Hotel California Client Configuration
 */
export interface HotelCaliforniaClientConfig {
  /** Base URL for the API */
  apiBaseUrl: string;
}

/**
 * Parameters for creating a client
 */
export interface CreateClientParams {
  /** Client name */
  name: string;
  /** Client phone number */
  phoneNumber: string;
  /** Optional room number */
  roomNumber?: string | null;
  /** Optional special requests */
  specialRequests?: string;
}

/**
 * Parameters for updating a client
 */
export interface UpdateClientParams {
  /** Client name */
  name: string;
  /** Client phone number */
  phoneNumber: string;
  /** Optional room number */
  roomNumber?: string | null;
  /** Optional special requests */
  specialRequests?: string;
}

/**
 * Parameters for listing clients
 */
export interface ListClientsParams {
  /** Page number (pagination) */
  page?: number;
  /** Search term for filtering clients */
  search?: string;
}

/**
 * Parameters for creating or replacing a reservation
 */
export interface ReservationParams {
  /** Client ID */
  clientId: number;
  /** Restaurant ID */
  restaurantId: number;
  /** Reservation date (YYYY-MM-DD) */
  date: string;
  /** Meal type ID */
  mealId: number;
  /** Number of guests (1-100) */
  numberOfGuests: number;
  /** Optional special requests */
  specialRequests?: string;
}

/**
 * Parameters for partial updating a reservation
 */
export interface UpdateReservationParams {
  /** Client ID */
  clientId?: number;
  /** Restaurant ID */
  restaurantId?: number;
  /** Reservation date (YYYY-MM-DD) */
  date?: string;
  /** Meal type ID */
  mealId?: number;
  /** Number of guests (1-100) */
  numberOfGuests?: number;
  /** Optional special requests */
  specialRequests?: string;
}

/**
 * Parameters for listing reservations
 */
export interface ListReservationsParams {
  /** Filter by client ID */
  clientId?: number;
  /** Filter by start date (YYYY-MM-DD) */
  dateFrom?: string;
  /** Filter by end date (YYYY-MM-DD) */
  dateTo?: string;
  /** Filter by meal type ID */
  mealId?: number;
  /** Page number (pagination) */
  page?: number;
  /** Filter by restaurant ID */
  restaurantId?: number;
}
