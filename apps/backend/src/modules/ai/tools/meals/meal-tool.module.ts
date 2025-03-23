import { Module } from '@nestjs/common';
import { MealToolService } from './meal-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [MealToolService],
  exports: [MealToolService],
})
export class MealToolModule {}
