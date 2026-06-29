import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SensorUncheckedCreateInput) {
    return await this.prisma.sensor.create({ data });
  }

  async findAll() {
    return await this.prisma.sensor.findMany();
  }

  async findByFarm(farmId: string) {
    return await this.prisma.sensor.findMany({ where: { farmId } });
  }

  async findOne(id: string) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id } });
    if (!sensor) throw new NotFoundException('Sensor não encontrado');
    return sensor;
  }

  async update(id: string, data: Prisma.SensorUpdateInput) {
    await this.findOne(id);
    return await this.prisma.sensor.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.sensor.delete({ where: { id } });
  }
}
