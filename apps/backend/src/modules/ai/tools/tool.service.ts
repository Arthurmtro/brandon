import { ToolInterface } from '@langchain/core/tools';
import { Inject, Injectable } from '@nestjs/common';
import { UserToolService } from './users/user-tool.service';
import { ReservationToolService } from './reservation/reservation-tool.service';
import { MealToolService } from './meals/meal-tool.service';
import { RestaurantToolService } from './restaurants/restaurant-tool.service';
import { SpaToolService } from './spas/spa-tool.service';
import { MeteoToolService } from './meteo/meteo-tool.service';
import { TourismToolService } from './tourism/tourism-tool.service';

@Injectable()
export class ToolService {
  @Inject() readonly reservationTool: ReservationToolService;
  @Inject() readonly restaurantTool: RestaurantToolService;
  @Inject() readonly spaTool: SpaToolService;
  @Inject() readonly userTool: UserToolService;
  @Inject() readonly meanTool: MealToolService;
  @Inject() readonly meteoTool: MeteoToolService;
  @Inject() readonly tourismTool: TourismToolService;

  getTools(): ToolInterface[] {
    return [
      ...this.reservationTool.createTools(),
      ...this.restaurantTool.createTools(),
      ...this.userTool.createTools(),
      ...this.meanTool.createTools(),
      ...this.spaTool.createTools(),
      ...this.meteoTool.createTools(),
      ...this.tourismTool.createTools(),
    ];
  }
}
