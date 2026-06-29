import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ThresholdOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

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

    // Para rotas /thresholds/:id - verifica via threshold -> farm
    const thresholdId = request.params.id;
    if (thresholdId) {
      const threshold = await this.prisma.threshold.findUnique({
        where: { id: thresholdId },
        include: { farm: true },
      });
      if (!threshold || threshold.farm.userId !== userId) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar este threshold.',
        );
      }
      return true;
    }

    return false;
  }
}
