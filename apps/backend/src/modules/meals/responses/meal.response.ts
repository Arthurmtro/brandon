import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedResponse } from '~/modules/hotel-california/hotel-california.types';

export class MealResponse {
  @ApiProperty({
    description: 'Unique identifier for the meal type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the meal type',
    example: 'Breakfast',
  })
  name: string;
}

export class PaginatedMealResponse implements PaginatedResponse<MealResponse> {
  @ApiProperty({
    description: 'Total number of meal types',
    example: 4,
  })
  count: number;

  @ApiPropertyOptional({
    description: 'URL to the next page',
    example: '/api/meals?page=2',
    nullable: true,
  })
  next: string | null;

  @ApiPropertyOptional({
    description: 'URL to the previous page',
    example: '/api/meals?page=1',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    description: 'List of meal type results',
    type: [MealResponse],
  })
  results: MealResponse[];
}
