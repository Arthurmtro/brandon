import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import { SpaResponse } from './responses/spa.response';
import { transformToSpaResponse } from './spa.transformer';
import { isAxiosError } from 'axios';

@ApiTags('Spa')
@Controller('spa')
export class SpaController {
  constructor(private readonly hotelService: HotelCaliforniaService) {}

  @Get()
  @ApiOperation({
    summary: 'Get spa information',
    description:
      'Returns information about the hotel spa including contact details and opening hours',
  })
  @ApiResponse({
    status: 200,
    description: 'Spa information retrieved successfully',
    type: SpaResponse,
  })
  @ApiResponse({ status: 404, description: 'Spa information not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSpa(): Promise<SpaResponse> {
    try {
      const response = await this.hotelService.getSpa();

      if (!response) {
        throw new HttpException(
          'Spa information not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return transformToSpaResponse(response);
    } catch (error) {
      if (isAxiosError(error) && error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve spa information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
