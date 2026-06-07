import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { AlertsService } from 'src/alerts/alerts.service';
import { ThresholdsService } from 'src/thresholds/thresholds.service';

@Injectable()
export class MeasurementsService {
  constructor(
    private prisma: PrismaService,
    private alertsService: AlertsService,
    private thresholdsService: ThresholdsService,
  ) {}

  async create(data: CreateMeasurementDto) {
    const measurement = await this.prisma.measurement.create({ data });

    const sensor = await this.prisma.sensor.findUnique({
      where: { id: data.sensorId },
    });

    if (sensor) {
      // 3. Busca os thresholds da lavoura
      const thresholds = await this.thresholdsService.findByFarm(sensor.farmId);

      // 4. Compara medições com os thresholds
      for (const threshold of thresholds) {
        const value = measurement[
          threshold.type as keyof typeof measurement
        ] as number;

        if (value === undefined || value === null) continue;

        let severity: 'NORMAL' | 'MODERADO' | 'CRITICO' | null = null;

        if (value > threshold.max) {
          const diff = ((value - threshold.max) / threshold.max) * 100;
          if (diff >= 20) severity = 'CRITICO';
          else if (diff >= 10) severity = 'MODERADO';
          else severity = 'NORMAL';
        } else if (value < threshold.min) {
          const diff = ((threshold.min - value) / threshold.min) * 100;
          if (diff >= 20) severity = 'CRITICO';
          else if (diff >= 10) severity = 'MODERADO';
          else severity = 'NORMAL';
        }

        // 5. Gera alerta se necessário
        if (severity) {
          await this.alertsService.create({
            type: 'threshold_exceeded',
            severity,
            measurement: { connect: { id: measurement.id } },
          });
        }
      }
    }

    return measurement;
  }

  async findAll(sensorId?: string, from?: string, to?: string) {
    return await this.prisma.measurement.findMany({
      where: {
        ...(sensorId && { sensorId }),
        ...((from || to) && {
          timestamp: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async findOne(id: string) {
    const measurement = await this.prisma.measurement.findUnique({
      where: { id },
    });
    if (!measurement) throw new NotFoundException('Medição não encontrada');
    return measurement;
  }
}
