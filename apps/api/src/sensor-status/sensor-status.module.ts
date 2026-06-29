import { Module } from '@nestjs/common';
import { SensorStatusService } from './sensor-status.service';
import { AlertsModule } from 'src/alerts/alerts.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AlertsModule],
  providers: [SensorStatusService, ConfigService],
})
export class SensorStatusModule {}
