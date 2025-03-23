import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedResponse } from '~/modules/hotel-california/hotel-california.types';

export class RestaurantResponse {
  @ApiProperty({
    description: 'Unique identifier for the restaurant',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the restaurant',
    example: 'Le Bistro Californien',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the restaurant',
    example: 'A cozy bistro offering California-inspired French cuisine',
  })
  description: string;

  @ApiProperty({
    description: 'Maximum number of guests the restaurant can accommodate',
    example: 80,
  })
  capacity: number;

  @ApiProperty({
    description: 'Restaurant opening hours',
    example: 'Mon-Sun: 12:00-15:00, 19:00-23:00',
  })
  openingHours: string;

  @ApiProperty({
    description: 'Physical location of the restaurant within the hotel',
    example: 'Ground Floor, West Wing',
  })
  location: string;

  @ApiProperty({
    description: 'Whether the restaurant is currently active',
    example: true,
  })
  isActive: boolean;
}

export class PaginatedRestaurantResponse
  implements PaginatedResponse<RestaurantResponse>
{
  @ApiProperty({
    description: 'Total number of restaurants matching the criteria',
    example: 5,
  })
  count: number;

  @ApiPropertyOptional({
    description: 'URL to the next page',
    example: '/api/restaurants?page=2',
    nullable: true,
  })
  next: string | null;

  @ApiPropertyOptional({
    description: 'URL to the previous page',
    example: '/api/restaurants?page=1',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    description: 'List of restaurant results',
    type: [RestaurantResponse],
  })
  results: RestaurantResponse[];
}
