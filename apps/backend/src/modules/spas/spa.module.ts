import { HotelCaliforniaModule } from '../hotel-california/hotel-california.module';
import { SpaController } from './spa.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [HotelCaliforniaModule],
  controllers: [SpaController],
  providers: [],
})
export class SpaModule {}
