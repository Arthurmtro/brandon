import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedResponse } from '~/modules/hotel-california/hotel-california.types';

export class UserResponse {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: "User's phone number",
    example: '+33612345678',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Room number if the user is a guest',
    example: '101',
    required: false,
  })
  roomNumber?: string;

  @ApiPropertyOptional({
    description: 'Any special requests or notes for this user',
    example: 'Requires vegetarian meals',
    required: false,
  })
  specialRequests?: string;
}

export class PaginatedUsersResponse implements PaginatedResponse<UserResponse> {
  @ApiProperty({
    description: 'Total number of users matching the criteria',
    example: 100,
  })
  count: number;

  @ApiPropertyOptional({
    description: 'URL to the next page',
    example: '/api/users?page=2',
    nullable: true,
  })
  next: string | null;

  @ApiPropertyOptional({
    description: 'URL to the previous page',
    example: '/api/users?page=1',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    description: 'List of user results',
    type: [UserResponse],
  })
  results: UserResponse[];
}
