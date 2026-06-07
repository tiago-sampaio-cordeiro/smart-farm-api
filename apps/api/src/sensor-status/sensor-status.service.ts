import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertsService } from 'src/alerts/alerts.service';

@Injectable()
export class SensorStatusService {
  private readonly logger = new Logger(SensorStatusService.name);

  constructor(
    private prisma: PrismaService,
    private alertsService: AlertsService,
  ) {}

  @Cron('*/1 * * * *') // executa a cada 1 minuto
  async checkInactiveSensors() {
    const inactivityMinutes = parseInt(
      process.env.SENSOR_INACTIVITY_MINUTES || '5',
    );
    const inactivityThreshold = new Date(
      Date.now() - inactivityMinutes * 60 * 1000,
    );

    this.logger.log(
      `Verificando sensores inativos (limite: ${inactivityMinutes} minutos)`,
    );

    // Busca sensores ativos cujo lastSeen ultrapassou o limite
    const inactiveSensors = await this.prisma.sensor.findMany({
      where: {
        status: 'ativo',
        lastSeen: {
          lt: inactivityThreshold,
        },
      },
    });

    for (const sensor of inactiveSensors) {
      // Atualiza status para inativo
      await this.prisma.sensor.update({
        where: { id: sensor.id },
        data: { status: 'inativo' },
      });

      // Gera alerta sensor_offline
      await this.alertsService.create({
        type: 'sensor_offline',
        severity: 'MODERADO',
        sensorId: sensor.id,
      } as any);

      this.logger.warn(`Sensor ${sensor.id} marcado como inativo.`);
    }
  }
}
