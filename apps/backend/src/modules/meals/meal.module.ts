import { HotelCaliforniaModule } from '../hotel-california/hotel-california.module';
import { MealController } from './meal.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [HotelCaliforniaModule],
  controllers: [MealController],
  providers: [],
})
export class MealModule {}
