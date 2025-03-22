import { SpaModule } from './modules/spas/spa.module';
import { MealModule } from './modules/meals/meal.module';
import { RestaurantModule } from './modules/restaurants/restaurant.module';
import { ReservationModule } from './modules/reservations/reservation.module';
import { AiModule } from './modules/ai/ai.module';
import { UserModule } from './modules/users/user.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { ChatModule } from './modules/chat/chat.module';
import { HotelCaliforniaModule } from './modules/hotel-california/hotel-california.module';
import { AgentModule } from './modules/agents/agent.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class ConfigModuleGlobal {}

@Module({
  imports: [
    UserModule,
    DiscoveryModule,
    ConfigModuleGlobal,
    // ChatModule,
    AiModule,
    HotelCaliforniaModule,
    ReservationModule,
    SpaModule,
    MealModule,
    AgentModule,
    RestaurantModule,
  ],
})
export class AppModule {}
