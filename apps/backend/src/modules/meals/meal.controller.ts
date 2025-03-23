import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedMealTypeListResponse } from '~/clients/hotel-california/response';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';

@ApiTags('meals')
@Controller('meals')
export class MealController {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  @Get()
  @ApiOperation({ summary: 'Lister les types de repas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse({
    description: 'Meal types retrieved successfully',
    type: PaginatedMealTypeListResponse,
  })
  async listMealTypes(
    @Query('page') page?: number,
  ): Promise<PaginatedMealTypeListResponse> {
    const client = this.hotelService.getClient();
    return await client.listMealTypes(page);
  }
}
