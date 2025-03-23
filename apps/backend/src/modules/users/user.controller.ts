import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  transformUserRequestToClient,
  transformClientToUserResponse,
  transformClientToPaginatedUserResponse,
} from './user.transformers';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import { ListUsersParams, UserRequest } from './requests/user.request';
import {
  PaginatedUsersResponse,
  UserResponse,
} from './responses/user.response';
import { isAxiosError } from 'axios';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly hotelService: HotelCaliforniaService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns a paginated list of users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginatedUsersResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Users not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listUsers(
    @Query() queryParams: ListUsersParams,
  ): Promise<PaginatedUsersResponse> {
    try {
      const response = await this.hotelService.listClients({ ...queryParams });
      return transformClientToPaginatedUserResponse(response);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw new HttpException(
          'Failed to retrieve users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`Users not found`);
      }

      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a single user by ID',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUser(@Param('id') id: number): Promise<UserResponse> {
    try {
      const response = await this.hotelService.getClient(id);

      console.log(response);

      if (!response) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return transformClientToUserResponse(response);
    } catch (error) {
      if (!isAxiosError(error)) {
        console.error(error);
        throw new HttpException(
          'Failed to retrieve users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Creates a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createUser(@Body() userData: UserRequest): Promise<UserResponse> {
    try {
      const clientData = transformUserRequestToClient(userData);
      const response = await this.hotelService.createClient(clientData);
      return transformClientToUserResponse(response);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw new HttpException(
          `Failed to create user`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error.response?.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(error.response.data.message);
      }

      throw new HttpException(
        `Failed to create user: ${error.response?.data.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UserRequest,
  ): Promise<UserResponse> {
    try {
      const clientData = transformUserRequestToClient(userData);
      const response = await this.hotelService.updateClient(id, clientData);
      return transformClientToUserResponse(response);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw new HttpException(
          'Failed to update user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error.response?.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        `Failed to update user: ${error.response?.data.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Deletes a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteUser(@Param('id') id: number): Promise<void> {
    try {
      await this.hotelService.deleteClient(id);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw new HttpException(
          'Failed to delete user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error.response?.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        `Failed to delete user: ${error.response?.data.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
