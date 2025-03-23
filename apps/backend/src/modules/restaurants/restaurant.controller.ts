import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListRestaurantsParams } from './requests/restaurant.request';
import { PaginatedRestaurantResponse } from './responses/restaurant.response';
import { transformToPaginatedRestaurantResponse } from './restaurant.transformer';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import { isAxiosError } from 'axios';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly hotelService: HotelCaliforniaService) {}

  @Get()
  @ApiOperation({
    summary: 'List restaurants',
    description: 'Returns a paginated list of restaurants in the hotel',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurants retrieved successfully',
    type: PaginatedRestaurantResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listRestaurants(
    @Query() queryParams: ListRestaurantsParams,
  ): Promise<PaginatedRestaurantResponse> {
    try {
      const response = await this.hotelService.listRestaurants(
        queryParams.page,
      );
      return transformToPaginatedRestaurantResponse(response);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Failed to retrieve restaurants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
