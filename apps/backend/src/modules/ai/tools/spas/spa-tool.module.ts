import { Module } from '@nestjs/common';
import { SpaToolService } from './spa-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [SpaToolService],
  exports: [SpaToolService],
})
export class SpaToolModule {}
