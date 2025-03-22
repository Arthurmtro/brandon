import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsBoolean,
  IsDate,
  IsPositive,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Client DTOs
export class ClientRequest {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Client phone number' })
  @IsString()
  @IsPhoneNumber()
  phone_number: string;

  @ApiPropertyOptional({ description: 'Client room number', nullable: true })
  @IsOptional()
  @IsString()
  room_number?: string | null;

  @ApiPropertyOptional({ description: 'Client special requests' })
  @IsOptional()
  @IsString()
  special_requests?: string;
}

export class ClientResponse {
  @ApiProperty({ description: 'Client ID' })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'Client name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Client phone number' })
  @IsString()
  phone_number: string;

  @ApiPropertyOptional({ description: 'Client room number', nullable: true })
  @IsOptional()
  @IsString()
  room_number?: string | null;

  @ApiPropertyOptional({ description: 'Client special requests' })
  @IsOptional()
  @IsString()
  special_requests?: string;
}

// MealType DTOs
export class MealTypeResponse {
  @ApiProperty({ description: 'Meal type ID' })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'Meal type name' })
  @IsString()
  name: string;
}

// Reservation DTOs
export class ReservationRequest {
  @ApiProperty({ description: 'Client ID' })
  @IsNumber()
  @IsPositive()
  client: number;

  @ApiProperty({ description: 'Restaurant ID' })
  @IsNumber()
  @IsPositive()
  restaurant: number;

  @ApiProperty({ description: 'Reservation date (YYYY-MM-DD)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
  date: string;

  @ApiProperty({ description: 'Meal type ID' })
  @IsNumber()
  @IsPositive()
  meal: number;

  @ApiProperty({ description: 'Number of guests', minimum: 1, maximum: 100 })
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  number_of_guests: number;

  @ApiPropertyOptional({ description: 'Special requests for the reservation' })
  @IsOptional()
  @IsString()
  special_requests?: string;
}

export class PatchedReservationRequest {
  @ApiPropertyOptional({ description: 'Client ID' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  client?: number;

  @ApiPropertyOptional({ description: 'Restaurant ID' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  restaurant?: number;

  @ApiPropertyOptional({ description: 'Reservation date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
  date?: string;

  @ApiPropertyOptional({ description: 'Meal type ID' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  meal?: number;

  @ApiPropertyOptional({
    description: 'Number of guests',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  number_of_guests?: number;

  @ApiPropertyOptional({ description: 'Special requests for the reservation' })
  @IsOptional()
  @IsString()
  special_requests?: string;
}

export class ReservationResponse {
  @ApiProperty({ description: 'Reservation ID' })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'Client ID' })
  @IsNumber()
  @IsPositive()
  client: number;

  @ApiProperty({ description: 'Restaurant ID' })
  @IsNumber()
  @IsPositive()
  restaurant: number;

  @ApiProperty({ description: 'Reservation date (YYYY-MM-DD)' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Meal type ID' })
  @IsNumber()
  @IsPositive()
  meal: number;

  @ApiProperty({ description: 'Number of guests', minimum: 1, maximum: 100 })
  @IsNumber()
  @IsInt()
  number_of_guests: number;

  @ApiPropertyOptional({ description: 'Special requests for the reservation' })
  @IsOptional()
  @IsString()
  special_requests?: string;
}

// Restaurant DTOs
export class RestaurantResponse {
  @ApiProperty({ description: 'Restaurant ID' })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'Restaurant name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Restaurant description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Restaurant capacity' })
  @IsNumber()
  @IsPositive()
  capacity: number;

  @ApiProperty({ description: 'Restaurant opening hours' })
  @IsString()
  opening_hours: string;

  @ApiProperty({ description: 'Restaurant location' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ description: 'Restaurant active status' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

// Spa DTOs
export class SpaResponse {
  @ApiProperty({ description: 'Spa ID' })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({ description: 'Spa name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Spa description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Spa location' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Spa phone number' })
  @IsString()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({ description: 'Spa email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Spa opening hours' })
  @IsString()
  opening_hours: string;

  @ApiProperty({ description: 'Spa creation date' })
  @IsString()
  created_at: string;

  @ApiProperty({ description: 'Spa last update date' })
  @IsString()
  updated_at: string;
}

// Paginated Response DTOs
export class PaginatedClientListResponse {
  @ApiProperty({ description: 'Total number of clients' })
  @IsNumber()
  @IsInt()
  count: number;

  @ApiPropertyOptional({ description: 'URL to next page', nullable: true })
  @IsOptional()
  @IsString()
  next?: string | null;

  @ApiPropertyOptional({ description: 'URL to previous page', nullable: true })
  @IsOptional()
  @IsString()
  previous?: string | null;

  @ApiProperty({ description: 'List of clients', type: [ClientResponse] })
  @Type(() => ClientResponse)
  results: ClientResponse[];
}

export class PaginatedMealTypeListResponse {
  @ApiProperty({ description: 'Total number of meal types' })
  @IsNumber()
  @IsInt()
  count: number;

  @ApiPropertyOptional({ description: 'URL to next page', nullable: true })
  @IsOptional()
  @IsString()
  next?: string | null;

  @ApiPropertyOptional({ description: 'URL to previous page', nullable: true })
  @IsOptional()
  @IsString()
  previous?: string | null;

  @ApiProperty({ description: 'List of meal types', type: [MealTypeResponse] })
  @Type(() => MealTypeResponse)
  results: MealTypeResponse[];
}

export class PaginatedReservationListResponse {
  @ApiProperty({ description: 'Total number of reservations' })
  @IsNumber()
  @IsInt()
  count: number;

  @ApiPropertyOptional({ description: 'URL to next page', nullable: true })
  @IsOptional()
  @IsString()
  next?: string | null;

  @ApiPropertyOptional({ description: 'URL to previous page', nullable: true })
  @IsOptional()
  @IsString()
  previous?: string | null;

  @ApiProperty({
    description: 'List of reservations',
    type: [ReservationResponse],
  })
  @Type(() => ReservationResponse)
  results: ReservationResponse[];
}

export class PaginatedRestaurantListResponse {
  @ApiProperty({ description: 'Total number of restaurants' })
  @IsNumber()
  @IsInt()
  count: number;

  @ApiPropertyOptional({ description: 'URL to next page', nullable: true })
  @IsOptional()
  @IsString()
  next?: string | null;

  @ApiPropertyOptional({ description: 'URL to previous page', nullable: true })
  @IsOptional()
  @IsString()
  previous?: string | null;

  @ApiProperty({
    description: 'List of restaurants',
    type: [RestaurantResponse],
  })
  @Type(() => RestaurantResponse)
  results: RestaurantResponse[];
}

// Query Parameter DTOs
export class ClientsListQueryParams {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Search term for clients' })
  @IsString()
  @IsNotEmpty()
  search: string;
}

export class MealsListQueryParams {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}

export class ReservationsListQueryParams {
  @ApiPropertyOptional({ description: 'Filter by client ID' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  client?: number;

  @ApiPropertyOptional({ description: 'Filter by start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
  date_from?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
  date_to?: string;

  @ApiPropertyOptional({ description: 'Filter by meal type ID' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  meal?: number;

  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Filter by restaurant ID' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  restaurant?: number;
}

export class RestaurantsListQueryParams {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}

export class SchemaRetrieveQueryParams {
  @ApiPropertyOptional({ description: 'Schema format', enum: ['json', 'yaml'] })
  @IsOptional()
  @IsString()
  format?: 'json' | 'yaml';

  @ApiPropertyOptional({ description: 'Schema language' })
  @IsOptional()
  @IsString()
  lang?: string;
}

// ID Parameter DTO
export class IdParam {
  @ApiProperty({ description: 'Resource ID' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
