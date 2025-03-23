import { ApiProperty } from '@nestjs/swagger';

export class SpaResponse {
  @ApiProperty({
    description: 'Unique identifier for the spa',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the spa',
    example: 'Zen Garden Spa',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the spa and its services',
    example:
      'A luxurious spa offering a variety of treatments and massages for complete relaxation',
  })
  description: string;

  @ApiProperty({
    description: 'Physical location of the spa within the hotel',
    example: 'Ground Floor, East Wing',
  })
  location: string;

  @ApiProperty({
    description: 'Contact phone number for the spa',
    example: '+33612345678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Contact email for the spa',
    example: 'spa@hotelcalifornia.com',
  })
  email: string;

  @ApiProperty({
    description: 'Spa opening hours',
    example: 'Mon-Sun: 9:00-20:00',
  })
  openingHours: string;

  @ApiProperty({
    description: 'Date when the spa information was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date when the spa information was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  updatedAt: string;
}
