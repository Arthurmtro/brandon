import { HotelCaliforniaModule } from '../hotel-california/hotel-california.module';
import { RestaurantController } from './restaurant.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [HotelCaliforniaModule],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule {}
