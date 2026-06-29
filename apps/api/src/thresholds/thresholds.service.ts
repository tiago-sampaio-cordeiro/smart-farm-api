import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DuplicateThresholdException } from './exceptions/duplicate-threshold.exception';
import { CreateTheresholdDto } from './dto/create-thereshold.dto';

@Injectable()
export class ThresholdsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTheresholdDto) {
    const existing = await this.prisma.threshold.findFirst({
      where: {
        farmId: data.farmId,
        type: data.type,
      },
    });
    if (existing) throw new DuplicateThresholdException(data.type, data.farmId);

    return await this.prisma.threshold.create({
      data: {
        type: data.type,
        min: data.min,
        max: data.max,
        farm: {
          connect: { id: data.farmId },
        },
      },
    });
  }

  async findByFarm(farmId: string) {
    return await this.prisma.threshold.findMany({ where: { farmId } });
  }

  async findOne(id: string) {
    const threshold = await this.prisma.threshold.findUnique({ where: { id } });
    if (!threshold) throw new NotFoundException('Threshold não encontrado');
    return threshold;
  }

  async update(id: string, data: Prisma.ThresholdUpdateInput) {
    await this.findOne(id);
    return await this.prisma.threshold.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.threshold.delete({ where: { id } });
  }
}
