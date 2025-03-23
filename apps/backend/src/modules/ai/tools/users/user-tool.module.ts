import { Module } from '@nestjs/common';
import { UserToolService } from './user-tool.service';
import { HotelCaliforniaModule } from '~/modules/hotel-california/hotel-california.module';

@Module({
  imports: [HotelCaliforniaModule],
  providers: [UserToolService],
  exports: [UserToolService],
})
export class UserToolModule {}
