import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { UserToolModule } from './users/user-tool.module';
import { ReservationToolModule } from './reservation/reservation-tool.module';
import { RestaurantToolModule } from './restaurants/restaurant-tool.module';
import { MealToolModule } from './meals/meal-tool.module';
import { SpaToolModule } from './spas/spa-tool.module';
import { MeteoToolModule } from './meteo/meteo-tool.module';
import { TourismToolModule } from './tourism/tourism-tool.module';

@Module({
  imports: [
    ReservationToolModule,
    RestaurantToolModule,
    UserToolModule,
    MealToolModule,
    SpaToolModule,
    MeteoToolModule,
    TourismToolModule,
  ],
  providers: [ToolService],
  exports: [ToolService],
})
export class ToolModule {}
