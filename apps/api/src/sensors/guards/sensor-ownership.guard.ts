import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SensorOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Para rotas /farms/:farmId/sensors - verifica a farm direto
    const farmId = request.params.farmId;
    if (farmId) {
      const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
      if (!farm || farm.userId !== userId) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar esta lavoura.',
        );
      }
      return true;
    }

    // Para rotas /sensors/:id - verifica via o sensor -> farm
    const sensorId = request.params.id;
    if (sensorId) {
      const sensor = await this.prisma.sensor.findUnique({
        where: { id: sensorId },
        include: { farm: true },
      });
      if (!sensor || sensor.farm.userId !== userId) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar este sensor.',
        );
      }
      return true;
    }

    return false;
  }
}
