import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  Min,
  IsNotEmpty,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationRequest {
  @ApiProperty({
    description: 'Client ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: 'Restaurant ID',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    description: 'Reservation date (YYYY-MM-DD)',
    example: '2023-12-25',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Meal type ID (1: Breakfast, 2: Lunch, 3: Dinner, etc.)',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  mealId: number;

  @ApiProperty({
    description: 'Number of guests',
    example: 4,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  numberOfGuests: number;

  @ApiPropertyOptional({
    description: 'Special requests or notes for the reservation',
    example: 'Window table preferred, celebrating anniversary',
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class UpdateReservationRequest extends CreateReservationRequest {}

export class PatchReservationRequest {
  @ApiPropertyOptional({
    description: 'Client ID',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Restaurant ID',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  restaurantId?: number;

  @ApiPropertyOptional({
    description: 'Reservation date (YYYY-MM-DD)',
    example: '2023-12-25',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Meal type ID (1: Breakfast, 2: Lunch, 3: Dinner, etc.)',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  mealId?: number;

  @ApiPropertyOptional({
    description: 'Number of guests',
    example: 4,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  numberOfGuests?: number;

  @ApiPropertyOptional({
    description: 'Special requests or notes for the reservation',
    example: 'Window table preferred, celebrating anniversary',
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Reservation status',
    enum: ['confirmed', 'pending', 'cancelled'],
    example: 'confirmed',
  })
  @IsString()
  @IsOptional()
  status?: 'confirmed' | 'pending' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Reason for update',
    example: 'Guest requested a different date',
  })
  @IsString()
  @IsOptional()
  updateReason?: string;

  @ApiPropertyOptional({
    description: 'Whether to notify the client about changes',
    example: true,
  })
  @IsOptional()
  notifyClient?: boolean;
}

export class ListReservationsParams {
  @ApiPropertyOptional({
    description: 'Filter by client ID',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Filter by restaurant ID',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  restaurantId?: number;

  @ApiPropertyOptional({
    description: 'Filter by meal type ID',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  mealId?: number;

  @ApiPropertyOptional({
    description: 'Start date for filtering (YYYY-MM-DD)',
    example: '2023-12-01',
  })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;
}
