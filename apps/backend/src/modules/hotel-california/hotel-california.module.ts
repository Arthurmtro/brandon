import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HotelCaliforniaService } from './hotel-california.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [HotelCaliforniaService],
  exports: [HotelCaliforniaService],
})
export class HotelCaliforniaModule {}
