import { HotelCaliforniaModule } from '../hotel-california/hotel-california.module';
import { ReservationController } from './reservation.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [HotelCaliforniaModule],
  controllers: [ReservationController],
  providers: [],
})
export class ReservationModule {}
