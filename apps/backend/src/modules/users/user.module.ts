import { UserService } from './user.service';

import { Module } from '@nestjs/common';
import { HotelCaliforniaModule } from '../hotel-california/hotel-california.module';
import { UserController } from './user.controller';

@Module({
  imports: [HotelCaliforniaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
