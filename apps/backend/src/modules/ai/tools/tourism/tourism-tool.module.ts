import { Module } from '@nestjs/common';
import { TourismToolService } from './tourism-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [TourismToolService],
  exports: [TourismToolService],
})
export class TourismToolModule {}
