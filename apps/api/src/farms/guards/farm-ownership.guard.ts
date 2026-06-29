import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FarmOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const farmId = request.params.id || request.params.farmId;
    const userId = request.user.id;

    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });

    if (!farm || farm.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta lavoura.',
      );
    }

    return true;
  }
}
