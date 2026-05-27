import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { SensorsModule } from './sensors/sensors.module';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [DatabaseModule, UsersModule, FarmsModule, SensorsModule, MeasurementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
