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
  PaginatedClientListResponse,
  ClientResponse,
} from '~/clients/hotel-california/response';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';
import {
  ListClientsParams,
  UpdateClientParams,
  CreateClientParams,
} from '../hotel-california/hotel-california.types';

@ApiTags('users')
@Controller('users')
export class UserController {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  @Get()
  @ApiOperation({ summary: 'Rechercher un client' })
  @ApiQuery({
    name: 'search',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiOkResponse({
    description: 'Clients retrieved successfully',
    type: PaginatedClientListResponse,
  })
  async getClients(
    @Query() params?: ListClientsParams,
  ): Promise<PaginatedClientListResponse> {
    const client = this.hotelService.getClient();
    return await client.listClients(params);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un client' })
  @ApiBody({ type: Object })
  @ApiOkResponse({
    description: 'Client created successfully',
    type: ClientResponse,
  })
  async createClient(
    @Body() data: CreateClientParams,
  ): Promise<ClientResponse> {
    const client = this.hotelService.getClient();
    return await client.createClient(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détailler un client' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiOkResponse({
    description: 'Client retrieved successfully',
    type: ClientResponse,
  })
  async getClientById(
    @Param('id') id: number,
  ): Promise<ClientResponse | undefined> {
    const client = this.hotelService.getClient();
    return await client.getClient(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un client' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({ type: Object })
  @ApiOkResponse({
    description: 'Client updated successfully',
    type: ClientResponse,
  })
  async updateClient(
    @Param('id') id: number,
    @Body() data: UpdateClientParams,
  ): Promise<ClientResponse> {
    const client = this.hotelService.getClient();
    return await client.updateClient(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiOkResponse({
    description: 'Client deleted successfully',
  })
  async deleteClient(@Param('id') id: number): Promise<void> {
    const client = this.hotelService.getClient();
    await client.deleteClient(id);
  }
}
