import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserRequest {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "User's phone number",
    example: '+33612345678',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Room number if the user is a guest',
    example: '101',
    required: false,
  })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiPropertyOptional({
    description: 'Any special requests or notes for this user',
    example: 'Requires vegetarian meals',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class ListUsersParams {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiPropertyOptional({
    description: 'Search term to filter users by name or email',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
