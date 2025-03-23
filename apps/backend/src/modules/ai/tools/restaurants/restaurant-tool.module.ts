import { Module } from '@nestjs/common';
import { RestaurantToolService } from './restaurant-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [RestaurantToolService],
  exports: [RestaurantToolService],
})
export class RestaurantToolModule {}
