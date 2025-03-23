import { Module } from '@nestjs/common';
import { TramToolService } from './tram-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [TramToolService],
  exports: [TramToolService],
})
export class SpaToolModule {}
