import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedResponse } from '~/modules/hotel-california/hotel-california.types';

export class ReservationResponse {
  @ApiProperty({
    description: 'Unique identifier for the reservation',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Client ID',
    example: 1,
  })
  clientId: number;

  @ApiProperty({
    description: 'Restaurant ID',
    example: 2,
  })
  restaurantId: number;

  @ApiProperty({
    description: 'Reservation date (YYYY-MM-DD)',
    example: '2023-12-25',
  })
  date: string;

  @ApiProperty({
    description: 'Meal type ID (1: Breakfast, 2: Lunch, 3: Dinner, etc.)',
    example: 3,
  })
  mealId: number;

  @ApiProperty({
    description: 'Number of guests',
    example: 4,
  })
  numberOfGuests: number;

  @ApiPropertyOptional({
    description: 'Special requests or notes for the reservation',
    example: 'Window table preferred, celebrating anniversary',
  })
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Reservation status',
    enum: ['confirmed', 'pending', 'cancelled'],
    example: 'confirmed',
  })
  status?: string;
}

export class PaginatedReservationResponse
  implements PaginatedResponse<ReservationResponse>
{
  @ApiProperty({
    description: 'Total number of reservations matching the criteria',
    example: 42,
  })
  count: number;

  @ApiPropertyOptional({
    description: 'URL to the next page',
    example: '/api/reservations?page=2',
    nullable: true,
  })
  next: string | null;

  @ApiPropertyOptional({
    description: 'URL to the previous page',
    example: '/api/reservations?page=1',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    description: 'List of reservation results',
    type: [ReservationResponse],
  })
  results: ReservationResponse[];
}
