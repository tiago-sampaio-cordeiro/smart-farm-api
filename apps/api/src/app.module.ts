import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { SensorsModule } from './sensors/sensors.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { AlertsModule } from './alerts/alerts.module';
import { ThresholdsModule } from './thresholds/thresholds.module';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [DatabaseModule, UsersModule, FarmsModule, SensorsModule, MeasurementsModule, AlertsModule, ThresholdsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica o logger para absolutamente todas as rotas do sistema
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
