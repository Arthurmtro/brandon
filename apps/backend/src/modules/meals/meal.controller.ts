import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { transformClientToPaginatedMealResponse } from './meal.transformer';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import { PaginatedMealResponse } from './responses/meal.response';
import { ListMealsParams } from './requests/meal.request';
import { isAxiosError } from 'axios';

@ApiTags('Meals')
@Controller('meals')
export class MealController {
  constructor(private readonly hotelService: HotelCaliforniaService) {}

  @Get()
  @ApiOperation({
    summary: 'List meal types',
    description:
      'Returns a paginated list of meal types available at the hotel',
  })
  @ApiResponse({
    status: 200,
    description: 'Meal types retrieved successfully',
    type: PaginatedMealResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listMealTypes(
    @Query() queryParams: ListMealsParams,
  ): Promise<PaginatedMealResponse> {
    try {
      const response = await this.hotelService.listMealTypes(queryParams.page);

      return transformClientToPaginatedMealResponse(response);
    } catch (error) {
      if (isAxiosError(error) && error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve meal types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
