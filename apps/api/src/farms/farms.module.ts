import { Module } from '@nestjs/common';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { FarmOwnershipGuard } from './guards/farm-ownership.guard';

@Module({
  controllers: [FarmsController],
  providers: [FarmsService, FarmOwnershipGuard],
})
export class FarmsModule {}
