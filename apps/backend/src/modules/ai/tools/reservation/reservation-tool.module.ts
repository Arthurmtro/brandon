import { Module } from '@nestjs/common';
import { ReservationToolService } from './reservation-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [ReservationToolService],
  exports: [ReservationToolService],
})
export class ReservationToolModule {}
