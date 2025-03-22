import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpaResponse } from '~/clients/hotel-california/response';
import { HotelCaliforniaService } from '../hotel-california/hotel-california.service';

@ApiTags('spa')
@Controller('spa')
export class SpaController {
  @Inject() private readonly hotelService: HotelCaliforniaService;

  @Get()
  @ApiOperation({ summary: 'Obtenir les informations du spa' })
  @ApiOkResponse({
    description: 'Spa information retrieved successfully',
    type: SpaResponse,
  })
  async getSpaInfo(): Promise<SpaResponse | undefined> {
    const client = this.hotelService.getClient();
    return await client.getSpa();
  }
}
