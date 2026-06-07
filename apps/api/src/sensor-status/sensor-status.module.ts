import { Module } from '@nestjs/common';
import { SensorStatusService } from './sensor-status.service';
import { AlertsModule } from 'src/alerts/alerts.module';

@Module({
  imports: [AlertsModule],
  providers: [SensorStatusService],
})
export class SensorStatusModule {}
