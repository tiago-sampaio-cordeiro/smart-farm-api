import { Module } from '@nestjs/common';
import { ThresholdsController } from './thresholds.controller';
import { ThresholdsService } from './thresholds.service';
import { ThresholdOwnershipGuard } from './guards/threshold-ownership.guard';

@Module({
  controllers: [ThresholdsController],
  providers: [ThresholdsService, ThresholdOwnershipGuard],
  exports: [ThresholdsService],
})
export class ThresholdsModule { }
