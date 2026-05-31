import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@Injectable()
export class MeasurementsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateMeasurementDto) {
        return await this.prisma.measurement.create({ data });
    }

    async findAll(sensorId?: string) {
        return await this.prisma.measurement.findMany({
            where: sensorId ? { sensorId } : undefined,
        });
    }

    async findOne(id: string) {
        const measurement = await this.prisma.measurement.findUnique({ where: { id } });
        if (!measurement) throw new NotFoundException('Medição não encontrada');
        return measurement;
    }
}