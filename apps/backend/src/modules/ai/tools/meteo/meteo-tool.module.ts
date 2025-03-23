import { Module } from '@nestjs/common';
import { MeteoToolService } from './meteo-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [MeteoToolService],
  exports: [MeteoToolService],
})
export class MeteoToolModule {}
