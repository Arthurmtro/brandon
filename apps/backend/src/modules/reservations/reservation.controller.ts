import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateReservationRequest,
  UpdateReservationRequest,
  PatchReservationRequest,
  ListReservationsParams,
} from './requests/reservation.request';
import {
  ReservationResponse,
  PaginatedReservationResponse,
} from './responses/reservation.response';
import {
  transformRequestToReservation,
  transformUpdateRequestToReservation,
  transformPatchRequestToReservationUpdate,
  transformReservationModelToResponse,
  transformToPaginatedReservationResponse,
  transformToClientListParams,
} from './reservation.transformer';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import { isAxiosError } from 'axios';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly hotelService: HotelCaliforniaService) {}

  @Get()
  @ApiOperation({
    summary: 'List reservations',
    description:
      'Returns a paginated list of reservations with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully',
    type: PaginatedReservationResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listReservations(
    @Query() queryParams: ListReservationsParams,
  ): Promise<PaginatedReservationResponse> {
    try {
      const clientParams = transformToClientListParams(queryParams);
      const response = await this.hotelService.listReservations(clientParams);
      return transformToPaginatedReservationResponse(response);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Failed to retrieve reservations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reservation by ID',
    description: 'Returns a single reservation by ID',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully',
    type: ReservationResponse,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getReservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservationResponse> {
    try {
      const reservation = await this.hotelService.getReservation(id);

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return transformReservationModelToResponse(reservation);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create reservation',
    description: 'Creates a new reservation',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: ReservationResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createReservation(
    @Body() createReservationRequest: CreateReservationRequest,
  ): Promise<ReservationResponse> {
    try {
      const reservationInput = transformRequestToReservation(
        createReservationRequest,
      );
      const createdReservation =
        await this.hotelService.createReservation(reservationInput);
      return transformReservationModelToResponse(createdReservation);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        throw new BadRequestException(error.response.data.message);
      }

      throw new HttpException(
        'Failed to create reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Replace reservation',
    description: 'Completely replaces an existing reservation',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: ReservationResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async replaceReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationRequest: UpdateReservationRequest,
  ): Promise<ReservationResponse> {
    try {
      const reservationInput = transformUpdateRequestToReservation(
        updateReservationRequest,
      );
      const updatedReservation = await this.hotelService.replaceReservation(
        id,
        reservationInput,
      );
      return transformReservationModelToResponse(updatedReservation);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('Reservation not found');
      }

      throw new HttpException(
        'Failed to update reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update reservation',
    description: 'Partially updates an existing reservation',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: ReservationResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchReservationRequest: PatchReservationRequest,
  ): Promise<ReservationResponse> {
    try {
      const updateInput = transformPatchRequestToReservationUpdate(
        patchReservationRequest,
      );
      const updatedReservation = await this.hotelService.updateReservation(
        id,
        updateInput,
      );
      return transformReservationModelToResponse(updatedReservation);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('Reservation not found');
      }

      throw new HttpException(
        'Failed to update reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete reservation',
    description: 'Deletes a reservation',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteReservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.hotelService.deleteReservation(id);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('Reservation not found');
      }

      throw new HttpException(
        'Failed to delete reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
