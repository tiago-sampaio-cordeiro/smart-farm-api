import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlertsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.AlertCreateInput) {
        return await this.prisma.alert.create({ data });
    }

    async findAll(severity?: string, type?: string) {
        return await this.prisma.alert.findMany({
            where: {
                ...(severity && { severity: severity as any }),
                ...(type && { type: type as any }),
            },
        });
    }

    async findOne(id: string) {
        const alert = await this.prisma.alert.findUnique({ where: { id } });
        if (!alert) throw new NotFoundException('Alerta não encontrado');
        return alert;
    }
}