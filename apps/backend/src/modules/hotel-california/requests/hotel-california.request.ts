import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  IsDateString,
  ValidateNested,
} from 'class-validator';

/**
 * Create Client Request
 */
export class CreateClientRequest {
  @ApiProperty({ description: 'Client name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Client phone number', example: '+33612345678' })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: 'Optional room number', example: '101', required: false })
  @IsOptional()
  @IsString()
  roomNumber?: string | null;

  @ApiProperty({ description: 'Optional special requests', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

/**
 * Update Client Request
 */
export class UpdateClientRequest {
  @ApiProperty({ description: 'Client name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Client phone number', example: '+33612345678' })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: 'Optional room number', example: '101', required: false })
  @IsOptional()
  @IsString()
  roomNumber?: string | null;

  @ApiProperty({ description: 'Optional special requests', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

/**
 * List Clients Request
 */
export class ListClientsRequest {
  @ApiProperty({ description: 'Page number (pagination)', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Search term for filtering clients', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

/**
 * Create or Replace Reservation Request
 */
export class ReservationRequest {
  @ApiProperty({ description: 'Client ID', example: 1 })
  @IsInt()
  @Min(1)
  clientId: number;

  @ApiProperty({ description: 'Restaurant ID', example: 1 })
  @IsInt()
  @Min(1)
  restaurantId: number;

  @ApiProperty({ description: 'Reservation date (YYYY-MM-DD)', example: '2023-12-25' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Meal type ID', example: 1 })
  @IsInt()
  @Min(1)
  mealId: number;

  @ApiProperty({ description: 'Number of guests (1-100)', example: 4 })
  @IsInt()
  @Min(1)
  @Max(100)
  numberOfGuests: number;

  @ApiProperty({ description: 'Optional special requests', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

/**
 * Update Reservation Request
 */
export class UpdateReservationRequest {
  @ApiProperty({ description: 'Client ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  clientId?: number;

  @ApiProperty({ description: 'Restaurant ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  restaurantId?: number;

  @ApiProperty({ description: 'Reservation date (YYYY-MM-DD)', example: '2023-12-25', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Meal type ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  mealId?: number;

  @ApiProperty({ description: 'Number of guests (1-100)', example: 4, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  numberOfGuests?: number;

  @ApiProperty({ description: 'Optional special requests', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

/**
 * List Reservations Request
 */
export class ListReservationsRequest {
  @ApiProperty({ description: 'Filter by client ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  clientId?: number;

  @ApiProperty({ description: 'Filter by start date (YYYY-MM-DD)', example: '2023-12-01', required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ description: 'Filter by end date (YYYY-MM-DD)', example: '2023-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ description: 'Filter by meal type ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  mealId?: number;

  @ApiProperty({ description: 'Page number (pagination)', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Filter by restaurant ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  restaurantId?: number;
}