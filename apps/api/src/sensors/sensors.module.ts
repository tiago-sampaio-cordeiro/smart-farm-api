import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { FarmOwnershipGuard } from 'src/farms/guards/farm-ownership.guard';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService, FarmOwnershipGuard],
})
export class SensorsModule { } 
