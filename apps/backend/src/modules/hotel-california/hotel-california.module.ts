import { Module } from '@nestjs/common';
import { HotelCaliforniaService } from './hotel-california.service';

@Module({
  imports: [],
  providers: [HotelCaliforniaService],
  exports: [HotelCaliforniaService],
})
export class HotelCaliforniaModule {}
