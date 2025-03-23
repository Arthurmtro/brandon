import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedRestaurantListResponse,
  RestaurantResponse,
} from '~/clients/hotel-california/response';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  @Get()
  @ApiOperation({ summary: 'Lister les restaurants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse({
    description: 'Restaurants retrieved successfully',
    type: PaginatedRestaurantListResponse,
  })
  async listRestaurants(
    @Query('page') page?: number,
  ): Promise<PaginatedRestaurantListResponse> {
    const client = this.hotelService.getClient();
    return await client.listRestaurants(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détailler un restaurant' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiOkResponse({
    description: 'Restaurant retrieved successfully',
    type: RestaurantResponse,
  })
  async getRestaurant(
    @Param('id') id: number,
  ): Promise<RestaurantResponse | undefined> {
    const client = this.hotelService.getClient();
    const restaurants = await client.listRestaurants();
    return restaurants.results.find((restaurant) => restaurant.id === id);
  }
}
