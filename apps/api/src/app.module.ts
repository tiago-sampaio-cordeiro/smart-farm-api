import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [DatabaseModule, UsersModule, FarmsModule, SensorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
