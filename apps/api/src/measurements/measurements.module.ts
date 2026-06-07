import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { AlertsModule } from 'src/alerts/alerts.module';
import { ThresholdsModule } from 'src/thresholds/thresholds.module';

@Module({
  imports: [AlertsModule, ThresholdsModule],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
