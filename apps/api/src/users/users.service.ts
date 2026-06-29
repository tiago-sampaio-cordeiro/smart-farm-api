import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    roles: true,
    createdAt: true,
  };

  async findAll(filter?: string, page: number = 1) {
    const limit = 10;
    return await this.prisma.user.findMany({
      where: filter
        ? {
            email: { contains: filter, mode: 'insensitive' },
          }
        : undefined,
      select: this.userSelect,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.findOne(id);
    return await this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
  }
}
