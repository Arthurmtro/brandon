import { ApiProperty } from '@nestjs/swagger';

/**
 * Client Response DTO
 */
export class ClientResponse {
  @ApiProperty({ description: 'Client ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Client name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Client phone number', example: '+33612345678' })
  phoneNumber: string;

  @ApiProperty({ description: 'Client room number', example: '101', nullable: true })
  roomNumber: string | null;

  @ApiProperty({ description: 'Special requests', example: 'Extra pillows', nullable: true })
  specialRequests: string | null;

  @ApiProperty({ description: 'Creation date', example: '2023-10-25T14:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2023-10-26T09:15:00Z' })
  updatedAt: string;
}

/**
 * Restaurant Response DTO
 */
export class RestaurantResponse {
  @ApiProperty({ description: 'Restaurant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Restaurant name', example: 'Le Gourmet' })
  name: string;

  @ApiProperty({ description: 'Restaurant capacity', example: 50 })
  capacity: number;

  @ApiProperty({ description: 'Restaurant opening hours', example: '10:00-22:00' })
  openingHours: string;

  @ApiProperty({ description: 'Creation date', example: '2023-10-25T14:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2023-10-26T09:15:00Z' })
  updatedAt: string;
}

/**
 * Meal Response DTO
 */
export class MealResponse {
  @ApiProperty({ description: 'Meal ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Meal type name', example: 'Breakfast' })
  name: string;

  @ApiProperty({ description: 'Meal time slot', example: '07:00-10:00' })
  timeSlot: string;

  @ApiProperty({ description: 'Creation date', example: '2023-10-25T14:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2023-10-26T09:15:00Z' })
  updatedAt: string;
}

/**
 * Reservation Response DTO
 */
export class ReservationResponse {
  @ApiProperty({ description: 'Reservation ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Client', type: ClientResponse })
  client: ClientResponse;

  @ApiProperty({ description: 'Restaurant', type: RestaurantResponse })
  restaurant: RestaurantResponse;

  @ApiProperty({ description: 'Meal type', type: MealResponse })
  meal: MealResponse;

  @ApiProperty({ description: 'Reservation date', example: '2023-12-25' })
  date: string;

  @ApiProperty({ description: 'Number of guests', example: 4 })
  numberOfGuests: number;

  @ApiProperty({ description: 'Special requests', example: 'Window table', nullable: true })
  specialRequests: string | null;

  @ApiProperty({ description: 'Reservation status', example: 'confirmed' })
  status: string;

  @ApiProperty({ description: 'Creation date', example: '2023-10-25T14:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2023-10-26T09:15:00Z' })
  updatedAt: string;
}

/**
 * Paginated Response - Generic paginated response wrapper
 */
export class PaginatedResponse<T> {
  @ApiProperty({ description: 'List of items', isArray: true })
  items: T[];

  @ApiProperty({ description: 'Total number of items', example: 42 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of pages', example: 5 })
  pages: number;
}

/**
 * Paginated Clients Response
 */
export class PaginatedClientsResponse extends PaginatedResponse<ClientResponse> {
  @ApiProperty({ description: 'List of clients', type: [ClientResponse] })
  items: ClientResponse[];
}

/**
 * Paginated Reservations Response
 */
export class PaginatedReservationsResponse extends PaginatedResponse<ReservationResponse> {
  @ApiProperty({ description: 'List of reservations', type: [ReservationResponse] })
  items: ReservationResponse[];
}

/**
 * Error Response
 */
export class ErrorResponse {
  @ApiProperty({ description: 'Error message', example: 'Invalid input data' })
  message: string;

  @ApiProperty({ description: 'Error code', example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({ description: 'Detailed error information', required: false })
  details?: Record<string, any>;
}