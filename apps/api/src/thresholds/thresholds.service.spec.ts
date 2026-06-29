import { Test, TestingModule } from '@nestjs/testing';
import { ThresholdsService } from './thresholds.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { DuplicateThresholdException } from './exceptions/duplicate-threshold.exception';

const mockPrismaService = {
  threshold: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ThresholdsService', () => {
  let service: ThresholdsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThresholdsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ThresholdsService>(ThresholdsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um threshold com sucesso quando não houver duplicata', async () => {
      const dto = {
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
        min: 10,
        max: 40,
      };
      const created = { id: 'threshold-id-1', ...dto };
      mockPrismaService.threshold.findFirst.mockResolvedValue(null);
      mockPrismaService.threshold.create.mockResolvedValue(created);

      const result = await service.create(dto as any);

      expect(mockPrismaService.threshold.findFirst).toHaveBeenCalledWith({
        where: { farmId: dto.farmId, type: dto.type },
      });
      expect(mockPrismaService.threshold.create).toHaveBeenCalledWith({
        data: {
          type: dto.type,
          min: dto.min,
          max: dto.max,
          farm: { connect: { id: dto.farmId } },
        },
      });
      expect(result).toEqual(created);
    });

    it('deve lançar DuplicateThresholdException quando já existir um threshold do mesmo tipo na fazenda', async () => {
      const dto = {
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
        min: 10,
        max: 40,
      };
      const existing = { id: 'threshold-id-existing', ...dto };
      mockPrismaService.threshold.findFirst.mockResolvedValue(existing);

      await expect(service.create(dto as any)).rejects.toThrow(
        DuplicateThresholdException,
      );
      expect(mockPrismaService.threshold.create).not.toHaveBeenCalled();
    });
  });

  describe('findByFarm', () => {
    it('deve retornar todos os thresholds de uma plantação', async () => {
      const thresholds = [
        {
          id: 'threshold-id-1',
          farmId: 'farm-id-1',
          type: 'TEMPERATURA',
          min: 10,
          max: 40,
        },
        {
          id: 'threshold-id-2',
          farmId: 'farm-id-1',
          type: 'UMIDADE',
          min: 30,
          max: 80,
        },
      ];
      mockPrismaService.threshold.findMany.mockResolvedValue(thresholds);

      const result = await service.findByFarm('farm-id-1');

      expect(mockPrismaService.threshold.findMany).toHaveBeenCalledWith({
        where: { farmId: 'farm-id-1' },
      });
      expect(result).toEqual(thresholds);
    });
  });

  describe('findOne', () => {
    it('deve retornar um threshold quando encontrado', async () => {
      const threshold = {
        id: 'threshold-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
        min: 10,
        max: 40,
      };
      mockPrismaService.threshold.findUnique.mockResolvedValue(threshold);

      const result = await service.findOne('threshold-id-1');

      expect(mockPrismaService.threshold.findUnique).toHaveBeenCalledWith({
        where: { id: 'threshold-id-1' },
      });
      expect(result).toEqual(threshold);
    });

    it('deve lançar NotFoundException quando o threshold não for encontrado', async () => {
      mockPrismaService.threshold.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o threshold quando encontrado', async () => {
      const threshold = {
        id: 'threshold-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
        min: 10,
        max: 40,
      };
      const updated = { ...threshold, max: 50 };
      mockPrismaService.threshold.findUnique.mockResolvedValue(threshold);
      mockPrismaService.threshold.update.mockResolvedValue(updated);

      const result = await service.update('threshold-id-1', { max: 50 });

      expect(mockPrismaService.threshold.update).toHaveBeenCalledWith({
        where: { id: 'threshold-id-1' },
        data: { max: 50 },
      });
      expect(result).toEqual(updated);
    });

    it('deve lançar NotFoundException quando o threshold não existir', async () => {
      mockPrismaService.threshold.findUnique.mockResolvedValue(null);

      await expect(service.update('id-invalido', { max: 60 })).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.threshold.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover o threshold quando encontrado', async () => {
      const threshold = {
        id: 'threshold-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
        min: 10,
        max: 40,
      };
      mockPrismaService.threshold.findUnique.mockResolvedValue(threshold);
      mockPrismaService.threshold.delete.mockResolvedValue(threshold);

      const result = await service.remove('threshold-id-1');

      expect(mockPrismaService.threshold.delete).toHaveBeenCalledWith({
        where: { id: 'threshold-id-1' },
      });
      expect(result).toEqual(threshold);
    });

    it('deve lançar NotFoundException quando o threshold não existir', async () => {
      mockPrismaService.threshold.findUnique.mockResolvedValue(null);

      await expect(service.remove('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.threshold.delete).not.toHaveBeenCalled();
    });
  });
});
