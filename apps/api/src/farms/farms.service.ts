import { Injectable } from '@nestjs/common';
import { FarmNotFoundException } from './exceptions/farm-not-found.exception';
import { CreateFarmDto } from './dto/create-farm.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFarmDto) {
    return await this.prisma.farm.create({ data });
  }

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) throw new FarmNotFoundException(id);
    return farm;
  }

  async update(id: string, data: Prisma.FarmUpdateInput) {
    await this.findOne(id);
    return await this.prisma.farm.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.farm.delete({ where: { id } });
  }
}
