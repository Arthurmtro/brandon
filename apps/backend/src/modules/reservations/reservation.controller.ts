import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Inject,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  PaginatedReservationListResponse,
  ReservationResponse,
  // ReservationParams,
  // UpdateReservationParams,
} from '~/clients/hotel-california/response';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import {
  ListReservationsParams,
  ReservationParams,
  UpdateReservationParams,
} from '../hotel-california/hotel-california.types';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  @Get()
  @ApiOperation({ summary: 'Lister les réservations' })
  @ApiQuery({ name: 'clientId', required: false, type: Number })
  @ApiQuery({ name: 'restaurantId', required: false, type: Number })
  @ApiQuery({ name: 'mealId', required: false, type: Number })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse({
    description: 'Reservations retrieved successfully',
    type: PaginatedReservationListResponse,
  })
  async listReservations(
    @Query() params?: ListReservationsParams,
  ): Promise<PaginatedReservationListResponse> {
    console.log('listReservations');
    const client = this.hotelService.getClient();
    return await client.listReservations(params);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiBody({ type: Object })
  @ApiOkResponse({
    description: 'Reservation created successfully',
    type: ReservationResponse,
  })
  async createReservation(
    @Body() data: ReservationParams,
  ): Promise<ReservationResponse> {
    console.log('createReservation');
    const client = this.hotelService.getClient();
    return await client.createReservation(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détailler une réservation' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiOkResponse({
    description: 'Reservation retrieved successfully',
    type: ReservationResponse,
  })
  async getReservation(
    @Param('id') id: number,
  ): Promise<ReservationResponse | undefined> {
    console.log('getReservation');
    const client = this.hotelService.getClient();
    return await client.getReservation(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une réservation' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({ type: Object })
  @ApiOkResponse({
    description: 'Reservation updated successfully',
    type: ReservationResponse,
  })
  async updateReservation(
    @Param('id') id: number,
    @Body() data: UpdateReservationParams,
  ): Promise<ReservationResponse> {
    console.log('updateReservation');
    const client = this.hotelService.getClient();
    return await client.updateReservation(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiOkResponse({
    description: 'Reservation deleted successfully',
  })
  async deleteReservation(@Param('id') id: number): Promise<void> {
    console.log('deleteReservation');
    const client = this.hotelService.getClient();
    await client.deleteReservation(id);
  }
}
